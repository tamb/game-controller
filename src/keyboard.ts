import type { GameControllerLeftControl } from "./components/game-controller/game-controller-layout";
import type { GcAncillaryId } from "./components/gc-ancillary-buttons/gc-ancillary-buttons";
import type { GcDpadDirection } from "./components/gc-dpad/gc-dpad";
import {
  buildJoystickMoveSnapshot,
  DEFAULT_JOYSTICK_SECTORS,
  type GcJoystickCardinal,
  joystickAngleFromUpClockwise,
} from "./components/gc-joystick/joystick-math";
import type { GameControllerActionKey } from "./events";
import { EVENTS } from "./events";
import { parseVibrateAttribute } from "./haptics";
import { dispatchComposed } from "./lib/dispatch-event";
import { DEFAULT_REPEAT_DELAY_MS, DEFAULT_REPEAT_INTERVAL_MS } from "./lib/immediate-press";

export type GameControllerKeyAction =
  | { kind: "dpad"; direction: GcDpadDirection }
  | { kind: "face"; button: GameControllerActionKey }
  | { kind: "ancillary"; id: Exclude<GcAncillaryId, "fullscreen"> };

export type GameControllerKeyboardMap = Record<string, GameControllerKeyAction>;

/** Default map: arrows + WASD, K/J/I/U for A/B/X/Y, Enter/Shift for start/select. */
export const DEFAULT_GAME_CONTROLLER_KEYMAP: GameControllerKeyboardMap = {
  ArrowUp: { kind: "dpad", direction: "up" },
  ArrowRight: { kind: "dpad", direction: "right" },
  ArrowDown: { kind: "dpad", direction: "down" },
  ArrowLeft: { kind: "dpad", direction: "left" },
  KeyW: { kind: "dpad", direction: "up" },
  KeyD: { kind: "dpad", direction: "right" },
  KeyS: { kind: "dpad", direction: "down" },
  KeyA: { kind: "dpad", direction: "left" },
  KeyK: { kind: "face", button: "a" },
  KeyJ: { kind: "face", button: "b" },
  KeyI: { kind: "face", button: "x" },
  KeyU: { kind: "face", button: "y" },
  Enter: { kind: "ancillary", id: "start" },
  ShiftLeft: { kind: "ancillary", id: "select" },
  ShiftRight: { kind: "ancillary", id: "select" },
};

const DPAD_VECTOR: Record<GcDpadDirection, { x: number; y: number }> = {
  up: { x: 0, y: -1 },
  right: { x: 1, y: 0 },
  down: { x: 0, y: 1 },
  left: { x: -1, y: 0 },
};

export type GameControllerKeyboardOptions = {
  map?: GameControllerKeyboardMap;
  /** When `"joystick"`, WASD/arrows emit stick cardinals and a digital offset instead of d-pad. */
  leftControl?: GameControllerLeftControl;
  repeatDelay?: number;
  repeatInterval?: number;
};

export function isEditableKeyboardTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  if (target.isContentEditable) return true;
  const tag = target.tagName;
  return tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT";
}

export function parseKeyboardAttribute(value: string | null): boolean {
  return parseVibrateAttribute(value);
}

export function coerceKeyboard(value: unknown): boolean {
  if (value === false) return false;
  if (value === true || value === undefined || value === null) return true;
  if (typeof value === "string") return parseKeyboardAttribute(value);
  return Boolean(value);
}

function coerceMs(value: number | undefined, fallback: number): number {
  if (typeof value !== "number" || !Number.isFinite(value) || value < 0) return fallback;
  return value;
}

function emitDpadPress(controller: HTMLElement, direction: GcDpadDirection, repeat: boolean): void {
  dispatchComposed(controller, EVENTS.gcDpad[direction], {
    controller,
    direction,
    repeat,
  });
}

function emitDpadRelease(controller: HTMLElement, direction: GcDpadDirection): void {
  dispatchComposed(controller, EVENTS.gcDpadReleased[direction], { controller, direction });
}

function emitFacePress(controller: HTMLElement, button: GameControllerActionKey): void {
  dispatchComposed(controller, EVENTS.gcFace[button], { controller, button, repeat: false });
}

function emitFaceRelease(controller: HTMLElement, button: GameControllerActionKey): void {
  dispatchComposed(controller, EVENTS.gcFaceReleased[button], { controller, button });
}

function emitAncillaryPress(
  controller: HTMLElement,
  id: Exclude<GcAncillaryId, "fullscreen">,
): void {
  dispatchComposed(controller, EVENTS.gcAncillary[id], { controller, id, repeat: false });
}

function emitAncillaryRelease(
  controller: HTMLElement,
  id: Exclude<GcAncillaryId, "fullscreen">,
): void {
  dispatchComposed(controller, EVENTS.gcAncillaryReleased[id], { controller, id });
}

function emitJoystickDigital(
  controller: HTMLElement,
  held: Set<GcDpadDirection>,
  previousCardinal: GcJoystickCardinal,
  firePointerDown: boolean,
): GcJoystickCardinal {
  let x = 0;
  let y = 0;
  for (const dir of held) {
    x += DPAD_VECTOR[dir].x;
    y += DPAD_VECTOR[dir].y;
  }
  const mag = Math.min(1, Math.hypot(x, y));
  if (mag === 0) {
    const kin = {
      knobDx: 0,
      knobDy: 0,
      nx: 0,
      ny: 0,
      mag: 0,
      angleDeg: null as number | null,
    };
    const snapshot = buildJoystickMoveSnapshot(kin, DEFAULT_JOYSTICK_SECTORS);
    const detail = { controller, ...snapshot, previousCardinal };
    dispatchComposed(controller, EVENTS.gcJoystick.move, detail);
    if (previousCardinal !== "none") {
      dispatchComposed(controller, EVENTS.gcJoystick.cardinal.none, {
        ...detail,
        previousCardinal,
      });
    }
    return "none";
  }
  const nx = x / mag;
  const ny = y / mag;
  const kin = {
    knobDx: 0,
    knobDy: 0,
    nx,
    ny,
    mag,
    angleDeg: joystickAngleFromUpClockwise(nx, ny),
  };
  const snapshot = buildJoystickMoveSnapshot(kin, DEFAULT_JOYSTICK_SECTORS);
  if (firePointerDown) {
    dispatchComposed(controller, EVENTS.gcJoystick.pointerDown, { controller });
  }
  const detail = { controller, ...snapshot, previousCardinal };
  dispatchComposed(controller, EVENTS.gcJoystick.move, detail);
  if (snapshot.cardinal !== previousCardinal) {
    dispatchComposed(controller, EVENTS.gcJoystick.cardinal[snapshot.cardinal], {
      ...detail,
      previousCardinal,
    });
  }
  return snapshot.cardinal;
}

/**
 * Maps keyboard keys onto the same composed events as pointer controls.
 * Listens on `window` so the host does not need focus. Ignores OS `event.repeat`
 * and uses the same d-pad delay/interval as pointer hold.
 */
export function installGameControllerKeyboard(
  target: HTMLElement,
  options: GameControllerKeyboardOptions = {},
): () => void {
  const map = options.map ?? DEFAULT_GAME_CONTROLLER_KEYMAP;
  const delay = coerceMs(options.repeatDelay, DEFAULT_REPEAT_DELAY_MS);
  const interval = coerceMs(options.repeatInterval, DEFAULT_REPEAT_INTERVAL_MS);
  const leftControl = (): GameControllerLeftControl => options.leftControl ?? "dpad";

  const heldCodes = new Set<string>();
  const heldDpad = new Set<GcDpadDirection>();
  const timers = new Map<
    string,
    { delay: ReturnType<typeof setTimeout>; interval?: ReturnType<typeof setInterval> }
  >();
  let joystickCardinal: GcJoystickCardinal = "none";

  const clearKeyTimers = (code: string) => {
    const t = timers.get(code);
    if (!t) return;
    clearTimeout(t.delay);
    if (t.interval !== undefined) clearInterval(t.interval);
    timers.delete(code);
  };

  const startDpadRepeat = (code: string, direction: GcDpadDirection) => {
    clearKeyTimers(code);
    const delayId = setTimeout(() => {
      emitDpadPress(target, direction, true);
      const intervalId = setInterval(() => {
        emitDpadPress(target, direction, true);
      }, interval);
      timers.set(code, { delay: delayId, interval: intervalId });
    }, delay);
    timers.set(code, { delay: delayId });
  };

  const onKeyDown = (event: KeyboardEvent) => {
    if (event.repeat) return;
    if (isEditableKeyboardTarget(event.target)) return;
    const action = map[event.code];
    if (!action) return;
    if (heldCodes.has(event.code)) return;
    heldCodes.add(event.code);
    event.preventDefault();

    if (action.kind === "dpad") {
      if (leftControl() === "joystick") {
        const first = heldDpad.size === 0;
        heldDpad.add(action.direction);
        joystickCardinal = emitJoystickDigital(target, heldDpad, joystickCardinal, first);
        return;
      }
      emitDpadPress(target, action.direction, false);
      startDpadRepeat(event.code, action.direction);
      return;
    }
    if (action.kind === "face") {
      emitFacePress(target, action.button);
      return;
    }
    emitAncillaryPress(target, action.id);
  };

  const onKeyUp = (event: KeyboardEvent) => {
    const action = map[event.code];
    if (!action) return;
    if (!heldCodes.has(event.code)) return;
    heldCodes.delete(event.code);
    clearKeyTimers(event.code);
    if (isEditableKeyboardTarget(event.target)) return;

    if (action.kind === "dpad") {
      if (leftControl() === "joystick") {
        heldDpad.delete(action.direction);
        for (const code of heldCodes) {
          const held = map[code];
          if (held?.kind === "dpad") heldDpad.add(held.direction);
        }
        joystickCardinal = emitJoystickDigital(target, heldDpad, joystickCardinal, false);
        return;
      }
      emitDpadRelease(target, action.direction);
      return;
    }
    if (action.kind === "face") {
      emitFaceRelease(target, action.button);
      return;
    }
    emitAncillaryRelease(target, action.id);
  };

  window.addEventListener("keydown", onKeyDown);
  window.addEventListener("keyup", onKeyUp);

  return () => {
    window.removeEventListener("keydown", onKeyDown);
    window.removeEventListener("keyup", onKeyUp);
    for (const code of [...timers.keys()]) clearKeyTimers(code);
    heldCodes.clear();
    heldDpad.clear();
  };
}
