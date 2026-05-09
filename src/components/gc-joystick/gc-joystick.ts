import { css, html, LitElement, unsafeCSS } from "lit";
import { EVENTS, gcJoystickClockHourEvent } from "../../events";
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

export type GcJoystickMoveDetail = JoystickMoveSnapshotFields & {
  controller: GcJoystickElement;
};

const TAG = "gc-joystick";

export class GcJoystickElement extends LitElement {
  static styles = css`
    ${unsafeCSS(styles)}
  `;

  static properties = {
    deadZone: { type: Number },
    emitCardinal: { type: Boolean, attribute: "emit-cardinal" },
    emitClock: { type: Boolean, attribute: "emit-clock" },
    emitSectors: { type: Boolean, attribute: "emit-sectors" },
    /** JSON array of `{ id, startDeg, endDeg }` — optional override from markup. */
    sectorsJson: { type: String, attribute: "sectors-json" },
  };

  /** Magnitude below this (0…1) is treated as centered. */
  deadZone = 0.12;

  emitCardinal = false;

  emitClock = false;

  emitSectors = false;

  sectorsJson: string | null = null;

  /** Sector definitions (not reactive — assign from JS or parse via `sectors-json`). */
  sectors: JoystickSector[] = [...DEFAULT_JOYSTICK_SECTORS];

  private dragging = false;

  private nx = 0;

  private ny = 0;

  private mag = 0;

  private angleDeg: number | null = null;

  private knobDx = 0;

  private knobDy = 0;

  private lastCardinal: GcJoystickCardinal = "none";

  private lastSectorId: string | null = null;

  private lastClockHour: number | null = null;

  override updated(changed: Map<PropertyKey, unknown>) {
    super.updated(changed);
    if (changed.has("sectorsJson") && this.sectorsJson) {
      const next = parseJoystickSectorsJson(this.sectorsJson);
      if (next) this.sectors = next;
    }
  }

  private emit(name: string, detail: Record<string, unknown>) {
    this.dispatchEvent(
      new CustomEvent(name, {
        detail,
        bubbles: true,
        composed: true,
      }),
    );
  }

  private kinState(): JoystickKinematics {
    return {
      knobDx: this.knobDx,
      knobDy: this.knobDy,
      nx: this.nx,
      ny: this.ny,
      mag: this.mag,
      angleDeg: this.angleDeg,
    };
  }

  private buildDetail(): GcJoystickMoveDetail {
    return {
      controller: this,
      ...buildJoystickMoveSnapshot(this.kinState(), this.sectors),
    };
  }

  private emitMoveAlways() {
    const detail = this.buildDetail();
    this.emit(EVENTS.gcJoystick.move, { ...detail });
    return detail;
  }

  private emitAuxiliary(detail: GcJoystickMoveDetail) {
    if (this.emitCardinal && detail.cardinal !== this.lastCardinal) {
      const prev = this.lastCardinal;
      this.lastCardinal = detail.cardinal;
      this.emit(EVENTS.gcJoystick.cardinal[detail.cardinal], {
        ...detail,
        previousCardinal: prev,
      });
    }

    if (this.emitSectors) {
      const sid = detail.sectorId;
      if (sid !== this.lastSectorId) {
        const prev = this.lastSectorId;
        this.lastSectorId = sid;
        this.emit(EVENTS.gcJoystick.sector, {
          ...detail,
          previousSectorId: prev,
        });
      }
    }

    if (this.emitClock) {
      const h = detail.clockHour;
      if (h !== this.lastClockHour) {
        const prev = this.lastClockHour;
        this.lastClockHour = h;
        if (h !== null) {
          this.emit(gcJoystickClockHourEvent(h), {
            ...detail,
            hour: h,
            previousHour: prev,
          });
        }
        this.emit(EVENTS.gcJoystick.clock, {
          ...detail,
          hour: h,
          previousHour: prev,
          label: detail.clockLabel,
          previousLabel: prev === null ? null : joystickClockLabel(prev),
        });
      }
    }
  }

  private knobHalfPx(): number {
    const raw = getComputedStyle(this).getPropertyValue("--gc-joystick-knob-size").trim();
    const sz = Number.parseFloat(raw || "28") || 28;
    return sz / 2;
  }

  private updateStick(clientX: number, clientY: number) {
    const ring = this.renderRoot.querySelector(".gcjoystick__ring") as HTMLElement | null;
    if (!ring) return;

    const rect = ring.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const half = this.knobHalfPx();
    const maxTravel = Math.max(8, Math.min(rect.width, rect.height) / 2 - half - 2);

    const kin = computeJoystickKinematics({
      pointerDx: clientX - cx,
      pointerDy: clientY - cy,
      maxTravel,
      deadZone: this.deadZone,
    });

    this.knobDx = kin.knobDx;
    this.knobDy = kin.knobDy;
    this.nx = kin.nx;
    this.ny = kin.ny;
    this.mag = kin.mag;
    this.angleDeg = kin.angleDeg;

    const detail = this.emitMoveAlways();
    this.emitAuxiliary(detail);
    this.requestUpdate();
  }

  private resetStick() {
    this.dragging = false;
    this.nx = 0;
    this.ny = 0;
    this.mag = 0;
    this.angleDeg = null;
    this.knobDx = 0;
    this.knobDy = 0;

    const detail = this.emitMoveAlways();

    if (this.emitCardinal && this.lastCardinal !== "none") {
      const prev = this.lastCardinal;
      this.lastCardinal = "none";
      this.emit(EVENTS.gcJoystick.cardinal.none, {
        ...detail,
        previousCardinal: prev,
      });
    }

    if (this.emitSectors && this.lastSectorId !== null) {
      const prev = this.lastSectorId;
      this.lastSectorId = null;
      this.emit(EVENTS.gcJoystick.sector, {
        ...detail,
        sectorId: null,
        previousSectorId: prev,
      });
    }

    if (this.emitClock && this.lastClockHour !== null) {
      const prev = this.lastClockHour;
      this.lastClockHour = null;
      this.emit(EVENTS.gcJoystick.clock, {
        ...detail,
        hour: null,
        previousHour: prev,
        label: null,
        previousLabel: prev === null ? null : joystickClockLabel(prev),
      });
    }

    this.requestUpdate();
  }

  private readonly onPointerDown = (e: PointerEvent) => {
    e.preventDefault();
    this.dragging = true;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    this.emit(EVENTS.gcJoystick.pointerDown, { controller: this });
    this.updateStick(e.clientX, e.clientY);
  };

  private readonly onPointerMove = (e: PointerEvent) => {
    if (!this.dragging) return;
    e.preventDefault();
    this.updateStick(e.clientX, e.clientY);
  };

  private readonly onPointerUp = (e: PointerEvent) => {
    if (!this.dragging) return;
    e.preventDefault();
    try {
      (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      /* ignore */
    }
    this.resetStick();
  };

  private readonly onLostCapture = () => {
    if (this.dragging) this.resetStick();
  };

  render() {
    const tf = `translate(calc(-50% + ${this.knobDx}px), calc(-50% + ${this.knobDy}px))`;
    return html`
      <div class="gcjoystick" part="base">
        <div class="gcjoystick__ring" part="ring"></div>
        <button
          type="button"
          class="gcjoystick__knob"
          part="knob"
          aria-label="Joystick"
          style="transform: ${tf}"
          @pointerdown=${this.onPointerDown}
          @pointermove=${this.onPointerMove}
          @pointerup=${this.onPointerUp}
          @pointercancel=${this.onPointerUp}
          @lostpointercapture=${this.onLostCapture}
        ></button>
      </div>
    `;
  }
}

if (!customElements.get(TAG)) {
  customElements.define(TAG, GcJoystickElement);
}
