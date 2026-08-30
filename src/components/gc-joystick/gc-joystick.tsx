import { type PointerEvent as ReactPointerEvent, useMemo, useRef, useState } from "react";
import { EVENTS, gcJoystickClockHourEvent } from "../../events";
import { resolveComponentCss } from "../../lib/component-css";
import { dispatchComposed } from "../../lib/dispatch-event";
import { defineOnce, defineReactElement } from "../../lib/r2wc-element";
import { getCustomElementHost, isShadowContainer } from "../../lib/shadow-host";
import styles from "./gc-joystick.css?raw";
import {
  buildJoystickMoveSnapshot,
  computeJoystickKinematics,
  DEFAULT_JOYSTICK_SECTORS,
  type GcJoystickCardinal,
  type JoystickKinematics,
  type JoystickMoveSnapshotFields,
  type JoystickSector,
  joystickClockLabel,
  parseJoystickSectorsJson,
} from "./joystick-math";

export type { GcJoystickCardinal, JoystickMoveSnapshotFields, JoystickSector };
export { DEFAULT_JOYSTICK_SECTORS };

const HOST_CLASS = "gcjoystick-host";
const TAG = "gc-joystick";

export type GcJoystickMoveDetail = JoystickMoveSnapshotFields & {
  controller: HTMLElement;
};

export type GcJoystickProps = {
  deadZone?: number;
  emitCardinal?: boolean;
  emitClock?: boolean;
  emitSectors?: boolean;
  sectorsJson?: string | null;
  sectors?: JoystickSector[];
  container?: HTMLElement;
  onPointerDown?: (detail: { controller: HTMLElement }) => void;
  onMove?: (detail: GcJoystickMoveDetail) => void;
};

function coerceBool(value: unknown, fallback = false): boolean {
  if (value === true) return true;
  if (value === false || value === undefined || value === null) return fallback;
  if (typeof value === "string") {
    return value === "" || /^[ty1-9]/i.test(value);
  }
  return Boolean(value);
}

function resolveSectors(
  sectorsJson: string | null | undefined,
  sectorsProp: JoystickSector[] | undefined,
): JoystickSector[] {
  if (sectorsJson) {
    return parseJoystickSectorsJson(sectorsJson) ?? [...DEFAULT_JOYSTICK_SECTORS];
  }
  if (Array.isArray(sectorsProp) && sectorsProp.length > 0) {
    return sectorsProp;
  }
  return [...DEFAULT_JOYSTICK_SECTORS];
}

export function GcJoystick({
  deadZone = 0.12,
  emitCardinal,
  emitClock,
  emitSectors,
  sectorsJson,
  sectors: sectorsProp,
  container,
  onPointerDown,
  onMove,
}: GcJoystickProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const lastCardinal = useRef<GcJoystickCardinal>("none");
  const lastSectorId = useRef<string | null>(null);
  const lastClockHour = useRef<number | null>(null);
  const dragging = useRef(false);
  const [knob, setKnob] = useState({ dx: 0, dy: 0 });

  const inShadow = isShadowContainer(container);
  const css = resolveComponentCss(styles, HOST_CLASS, inShadow);
  const doCardinal = coerceBool(emitCardinal);
  const doClock = coerceBool(emitClock);
  const doSectors = coerceBool(emitSectors);
  const sectors = useMemo(
    () => resolveSectors(sectorsJson, sectorsProp),
    [sectorsJson, sectorsProp],
  );

  const host = () => getCustomElementHost(container, rootRef.current);

  const kinState = (next: {
    knobDx: number;
    knobDy: number;
    nx: number;
    ny: number;
    mag: number;
    angleDeg: number | null;
  }): JoystickKinematics => next;

  const buildDetail = (kin: JoystickKinematics): GcJoystickMoveDetail | null => {
    const controller = host();
    if (!controller) return null;
    return {
      controller,
      ...buildJoystickMoveSnapshot(kin, sectors),
    };
  };

  const emitMove = (kin: JoystickKinematics) => {
    const detail = buildDetail(kin);
    if (!detail) return null;
    onMove?.(detail);
    dispatchComposed(detail.controller, EVENTS.gcJoystick.move, { ...detail });
    return detail;
  };

  const emitAuxiliary = (detail: GcJoystickMoveDetail) => {
    if (doCardinal && detail.cardinal !== lastCardinal.current) {
      const prev = lastCardinal.current;
      lastCardinal.current = detail.cardinal;
      dispatchComposed(detail.controller, EVENTS.gcJoystick.cardinal[detail.cardinal], {
        ...detail,
        previousCardinal: prev,
      });
    }

    if (doSectors) {
      const sid = detail.sectorId;
      if (sid !== lastSectorId.current) {
        const prev = lastSectorId.current;
        lastSectorId.current = sid;
        dispatchComposed(detail.controller, EVENTS.gcJoystick.sector, {
          ...detail,
          previousSectorId: prev,
        });
      }
    }

    if (doClock) {
      const h = detail.clockHour;
      if (h !== lastClockHour.current) {
        const prev = lastClockHour.current;
        lastClockHour.current = h;
        if (h !== null) {
          dispatchComposed(detail.controller, gcJoystickClockHourEvent(h), {
            ...detail,
            hour: h,
            previousHour: prev,
          });
        }
        dispatchComposed(detail.controller, EVENTS.gcJoystick.clock, {
          ...detail,
          hour: h,
          previousHour: prev,
          label: detail.clockLabel,
          previousLabel: prev === null ? null : joystickClockLabel(prev),
        });
      }
    }
  };

  const knobHalfPx = () => {
    const el = host() ?? rootRef.current;
    if (!el) return 14;
    const raw = getComputedStyle(el).getPropertyValue("--gc-joystick-knob-size").trim();
    const sz = Number.parseFloat(raw || "28") || 28;
    return sz / 2;
  };

  const updateStick = (clientX: number, clientY: number) => {
    const ring = ringRef.current;
    if (!ring) return;

    const rect = ring.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const half = knobHalfPx();
    const maxTravel = Math.max(8, Math.min(rect.width, rect.height) / 2 - half - 2);

    const kin = computeJoystickKinematics({
      pointerDx: clientX - cx,
      pointerDy: clientY - cy,
      maxTravel,
      deadZone,
    });

    setKnob({ dx: kin.knobDx, dy: kin.knobDy });
    const detail = emitMove(kinState(kin));
    if (detail) emitAuxiliary(detail);
  };

  const resetStick = () => {
    dragging.current = false;
    const kin = kinState({
      knobDx: 0,
      knobDy: 0,
      nx: 0,
      ny: 0,
      mag: 0,
      angleDeg: null,
    });
    setKnob({ dx: 0, dy: 0 });
    const detail = emitMove(kin);
    if (!detail) return;

    if (doCardinal && lastCardinal.current !== "none") {
      const prev = lastCardinal.current;
      lastCardinal.current = "none";
      dispatchComposed(detail.controller, EVENTS.gcJoystick.cardinal.none, {
        ...detail,
        previousCardinal: prev,
      });
    }

    if (doSectors && lastSectorId.current !== null) {
      const prev = lastSectorId.current;
      lastSectorId.current = null;
      dispatchComposed(detail.controller, EVENTS.gcJoystick.sector, {
        ...detail,
        sectorId: null,
        previousSectorId: prev,
      });
    }

    if (doClock && lastClockHour.current !== null) {
      const prev = lastClockHour.current;
      lastClockHour.current = null;
      dispatchComposed(detail.controller, EVENTS.gcJoystick.clock, {
        ...detail,
        hour: null,
        previousHour: prev,
        label: null,
        previousLabel: prev === null ? null : joystickClockLabel(prev),
      });
    }
  };

  const onKnobPointerDown = (e: ReactPointerEvent<HTMLButtonElement>) => {
    e.preventDefault();
    dragging.current = true;
    e.currentTarget.setPointerCapture(e.pointerId);
    const controller = host();
    if (controller) {
      onPointerDown?.({ controller });
      dispatchComposed(controller, EVENTS.gcJoystick.pointerDown, { controller });
    }
    updateStick(e.clientX, e.clientY);
  };

  const onKnobPointerMove = (e: ReactPointerEvent<HTMLButtonElement>) => {
    if (!dragging.current) return;
    e.preventDefault();
    updateStick(e.clientX, e.clientY);
  };

  const onKnobPointerUp = (e: ReactPointerEvent<HTMLButtonElement>) => {
    if (!dragging.current) return;
    e.preventDefault();
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      /* ignore */
    }
    resetStick();
  };

  const onLostCapture = () => {
    if (dragging.current) resetStick();
  };

  const tf = `translate(calc(-50% + ${knob.dx}px), calc(-50% + ${knob.dy}px))`;

  return (
    <>
      <style>{css}</style>
      <div
        ref={rootRef}
        className={inShadow ? "gcjoystick" : `${HOST_CLASS} gcjoystick`}
        part="base"
        data-emit-cardinal={doCardinal ? "" : undefined}
      >
        <div ref={ringRef} className="gcjoystick__ring" part="ring" />
        <button
          type="button"
          className="gcjoystick__knob"
          part="knob"
          aria-label="Joystick"
          style={{ transform: tf }}
          onPointerDown={onKnobPointerDown}
          onPointerMove={onKnobPointerMove}
          onPointerUp={onKnobPointerUp}
          onPointerCancel={onKnobPointerUp}
          onLostPointerCapture={onLostCapture}
        />
      </div>
    </>
  );
}

export interface GcJoystickElement extends HTMLElement {
  deadZone: number;
  emitCardinal: boolean;
  emitClock: boolean;
  emitSectors: boolean;
  sectorsJson: string | null;
  sectors: JoystickSector[];
  readonly updateComplete: Promise<void>;
}

export const GcJoystickElement = defineReactElement<GcJoystickProps, GcJoystickElement>(
  GcJoystick,
  {
    props: {
      deadZone: "number",
      emitCardinal: "boolean",
      emitClock: "boolean",
      emitSectors: "boolean",
      sectorsJson: "string",
    },
    objectProps: ["sectors"],
    emptyBooleanAttributes: ["emit-cardinal", "emit-clock", "emit-sectors"],
  },
);

const sectorsDescriptor = Object.getOwnPropertyDescriptor(GcJoystickElement.prototype, "sectors");
const propsSymbol = Symbol.for("r2wc.props");

Object.defineProperty(GcJoystickElement.prototype, "sectors", {
  enumerable: true,
  configurable: true,
  get(this: HTMLElement & { [key: symbol]: Record<string, unknown> }) {
    const stored = this[propsSymbol] as { sectors?: JoystickSector[]; sectorsJson?: string | null };
    return resolveSectors(stored?.sectorsJson, stored?.sectors);
  },
  set(this: HTMLElement, value: JoystickSector[]) {
    sectorsDescriptor?.set?.call(this, value);
  },
});

defineOnce(TAG, GcJoystickElement);
