/** Edge-triggered sector definition (degrees clockwise from up; 0° = up / 12 o’clock). */
export type JoystickSector = {
  id: string;
  startDeg: number;
  endDeg: number;
};

/** Default 8-way compass sectors (45° each). */
export const DEFAULT_JOYSTICK_SECTORS: readonly JoystickSector[] = [
  { id: "n", startDeg: 337.5, endDeg: 22.5 },
  { id: "ne", startDeg: 22.5, endDeg: 67.5 },
  { id: "e", startDeg: 67.5, endDeg: 112.5 },
  { id: "se", startDeg: 112.5, endDeg: 157.5 },
  { id: "s", startDeg: 157.5, endDeg: 202.5 },
  { id: "sw", startDeg: 202.5, endDeg: 247.5 },
  { id: "w", startDeg: 247.5, endDeg: 292.5 },
  { id: "nw", startDeg: 292.5, endDeg: 337.5 },
] as const;

export type GcJoystickCardinal = "up" | "down" | "left" | "right" | "none";

/** Snapshot fields shared by `GcJoystickMoveDetail` (no element reference). */
export type JoystickMoveSnapshotFields = {
  x: number;
  y: number;
  magnitude: number;
  angleDeg: number | null;
  angleRad: number | null;
  sectorId: string | null;
  cardinal: GcJoystickCardinal;
  clockHour: number | null;
  clockLabel: string | null;
};

export function normalizeJoystickDegrees(d: number): number {
  let x = d % 360;
  if (x < 0) x += 360;
  return x;
}

/** Degrees clockwise from up (0° = up, 90° = right). */
export function joystickAngleFromUpClockwise(dx: number, dy: number): number {
  return normalizeJoystickDegrees((Math.atan2(dx, -dy) * 180) / Math.PI);
}

export function joystickAngleInSector(angle: number, startDeg: number, endDeg: number): boolean {
  const a = normalizeJoystickDegrees(angle);
  const s = normalizeJoystickDegrees(startDeg);
  const e = normalizeJoystickDegrees(endDeg);
  if (s <= e) return a >= s && a <= e;
  return a >= s || a <= e;
}

export function joystickSectorAtAngle(
  sectors: readonly JoystickSector[],
  angleDeg: number,
): string | null {
  for (const s of sectors) {
    if (joystickAngleInSector(angleDeg, s.startDeg, s.endDeg)) return s.id;
  }
  return null;
}

/** Cardinal bucket for a non-dead-zone angle (never `"none"`). */
export function joystickCardinalFromAngle(angleDeg: number): Exclude<GcJoystickCardinal, "none"> {
  const a = normalizeJoystickDegrees(angleDeg);
  if (a >= 315 || a < 45) return "up";
  if (a < 135) return "right";
  if (a < 225) return "down";
  return "left";
}

/** Maps angle to clock hour (12 at top), hour ∈ 1…12. */
export function joystickClockHourFromAngle(angleDeg: number): number {
  const a = normalizeJoystickDegrees(angleDeg + 15);
  const idx = Math.floor(a / 30);
  return idx === 0 ? 12 : idx;
}

export function joystickClockLabel(hour: number): string {
  return `${hour}-oclock`;
}

/** Clamp pointer delta so the knob stays within `maxTravel` of center. */
export function clampJoystickKnobDelta(
  dx: number,
  dy: number,
  maxTravel: number,
): { dx: number; dy: number } {
  const dist = Math.hypot(dx, dy);
  if (dist > maxTravel && dist > 0) {
    return { dx: (dx / dist) * maxTravel, dy: (dy / dist) * maxTravel };
  }
  return { dx, dy };
}

export type JoystickKinematicsInput = {
  pointerDx: number;
  pointerDy: number;
  maxTravel: number;
  deadZone: number;
};

export type JoystickKinematics = {
  knobDx: number;
  knobDy: number;
  nx: number;
  ny: number;
  mag: number;
  angleDeg: number | null;
};

/**
 * Maps ring-relative pointer offset to normalized stick position and angle.
 * Matches `GcJoystickElement` pointer handling.
 */
export function computeJoystickKinematics(input: JoystickKinematicsInput): JoystickKinematics {
  const { pointerDx, pointerDy, maxTravel, deadZone } = input;
  const { dx, dy } = clampJoystickKnobDelta(pointerDx, pointerDy, maxTravel);

  const nx = maxTravel > 0 ? dx / maxTravel : 0;
  const ny = maxTravel > 0 ? dy / maxTravel : 0;
  const mag = Math.min(1, Math.hypot(nx, ny));

  if (mag < deadZone) {
    return {
      knobDx: 0,
      knobDy: 0,
      nx: 0,
      ny: 0,
      mag: 0,
      angleDeg: null,
    };
  }

  return {
    knobDx: dx,
    knobDy: dy,
    nx,
    ny,
    mag,
    angleDeg: joystickAngleFromUpClockwise(dx, dy),
  };
}

export function buildJoystickMoveSnapshot(
  kin: JoystickKinematics,
  sectors: readonly JoystickSector[],
): JoystickMoveSnapshotFields {
  const angle = kin.angleDeg;
  const sectorId = angle === null ? null : joystickSectorAtAngle(sectors, angle);
  const cardinal: GcJoystickCardinal = angle === null ? "none" : joystickCardinalFromAngle(angle);
  const clockHour = angle === null ? null : joystickClockHourFromAngle(angle);
  const clockLabel = clockHour === null ? null : joystickClockLabel(clockHour);

  return {
    x: kin.nx,
    y: kin.ny,
    magnitude: kin.mag,
    angleDeg: angle,
    angleRad: angle === null ? null : (angle * Math.PI) / 180,
    sectorId,
    cardinal,
    clockHour,
    clockLabel,
  };
}

/** Same rules as `GcJoystickElement` when parsing `sectors-json`. */
export function parseJoystickSectorsJson(json: string | null): JoystickSector[] | null {
  if (!json) return null;
  try {
    const parsed = JSON.parse(json) as unknown;
    if (!Array.isArray(parsed) || parsed.length === 0) return null;
    return parsed as JoystickSector[];
  } catch {
    return null;
  }
}
