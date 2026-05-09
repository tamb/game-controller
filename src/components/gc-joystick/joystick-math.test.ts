import { describe, expect, it } from "vitest";
import {
  buildJoystickMoveSnapshot,
  clampJoystickKnobDelta,
  computeJoystickKinematics,
  DEFAULT_JOYSTICK_SECTORS,
  joystickAngleFromUpClockwise,
  joystickAngleInSector,
  joystickCardinalFromAngle,
  joystickClockHourFromAngle,
  joystickClockLabel,
  joystickSectorAtAngle,
  normalizeJoystickDegrees,
  parseJoystickSectorsJson,
} from "./joystick-math";

describe("normalizeJoystickDegrees", () => {
  it("maps to [0, 360)", () => {
    expect(normalizeJoystickDegrees(0)).toBe(0);
    expect(normalizeJoystickDegrees(360)).toBe(0);
    expect(normalizeJoystickDegrees(-90)).toBe(270);
    expect(normalizeJoystickDegrees(720)).toBe(0);
    expect(normalizeJoystickDegrees(-361)).toBe(359);
  });
});

describe("joystickAngleFromUpClockwise", () => {
  it("matches screen coords (up = negative dy)", () => {
    expect(joystickAngleFromUpClockwise(0, -1)).toBe(0);
    expect(joystickAngleFromUpClockwise(1, 0)).toBe(90);
    expect(joystickAngleFromUpClockwise(0, 1)).toBe(180);
    expect(joystickAngleFromUpClockwise(-1, 0)).toBe(270);
  });
});

describe("joystickAngleInSector", () => {
  it("handles ranges that wrap past 0°", () => {
    expect(joystickAngleInSector(350, 337.5, 22.5)).toBe(true);
    expect(joystickAngleInSector(10, 337.5, 22.5)).toBe(true);
    expect(joystickAngleInSector(180, 337.5, 22.5)).toBe(false);
  });

  it("handles ordinary intervals", () => {
    expect(joystickAngleInSector(90, 67.5, 112.5)).toBe(true);
    expect(joystickAngleInSector(50, 67.5, 112.5)).toBe(false);
  });
});

describe("joystickSectorAtAngle", () => {
  it("resolves default wedges", () => {
    expect(joystickSectorAtAngle(DEFAULT_JOYSTICK_SECTORS, 0)).toBe("n");
    expect(joystickSectorAtAngle(DEFAULT_JOYSTICK_SECTORS, 90)).toBe("e");
    expect(joystickSectorAtAngle(DEFAULT_JOYSTICK_SECTORS, 180)).toBe("s");
    expect(joystickSectorAtAngle(DEFAULT_JOYSTICK_SECTORS, 270)).toBe("w");
    expect(joystickSectorAtAngle(DEFAULT_JOYSTICK_SECTORS, 45)).toBe("ne");
  });
});

describe("joystickCardinalFromAngle", () => {
  it("uses 90° quadrants centered on axes", () => {
    expect(joystickCardinalFromAngle(0)).toBe("up");
    expect(joystickCardinalFromAngle(44)).toBe("up");
    expect(joystickCardinalFromAngle(45)).toBe("right");
    expect(joystickCardinalFromAngle(135)).toBe("down");
    expect(joystickCardinalFromAngle(225)).toBe("left");
    expect(joystickCardinalFromAngle(314)).toBe("left");
    expect(joystickCardinalFromAngle(315)).toBe("up");
  });
});

describe("joystickClockHourFromAngle", () => {
  it("puts 12 at top with 30° per hour", () => {
    expect(joystickClockHourFromAngle(0)).toBe(12);
    expect(joystickClockHourFromAngle(90)).toBe(3);
    expect(joystickClockHourFromAngle(180)).toBe(6);
    expect(joystickClockHourFromAngle(270)).toBe(9);
  });
});

describe("joystickClockLabel", () => {
  it("formats hour labels", () => {
    expect(joystickClockLabel(6)).toBe("6-oclock");
  });
});

describe("clampJoystickKnobDelta", () => {
  it("leaves vectors inside radius unchanged", () => {
    expect(clampJoystickKnobDelta(3, 4, 10)).toEqual({ dx: 3, dy: 4 });
  });

  it("projects onto maxTravel circle", () => {
    const { dx, dy } = clampJoystickKnobDelta(30, 40, 25);
    expect(Math.hypot(dx, dy)).toBeCloseTo(25);
    expect(dx / 30).toBeCloseTo(dy / 40);
  });
});

describe("computeJoystickKinematics", () => {
  const base = { maxTravel: 100, deadZone: 0.12 };

  it("zeros inside dead zone", () => {
    const k = computeJoystickKinematics({ pointerDx: 5, pointerDy: 0, ...base });
    expect(k.mag).toBe(0);
    expect(k.angleDeg).toBeNull();
    expect(k.knobDx).toBe(0);
  });

  it("normalizes beyond dead zone", () => {
    const k = computeJoystickKinematics({ pointerDx: 50, pointerDy: 0, ...base });
    expect(k.nx).toBeCloseTo(0.5);
    expect(k.mag).toBeCloseTo(0.5);
    expect(k.angleDeg).toBe(90);
  });

  it("respects circular clamp before normalization", () => {
    const k = computeJoystickKinematics({ pointerDx: 200, pointerDy: 0, ...base });
    expect(k.knobDx).toBe(100);
    expect(k.nx).toBeCloseTo(1);
    expect(k.mag).toBeCloseTo(1);
  });

  it("handles maxTravel 0", () => {
    const k = computeJoystickKinematics({
      pointerDx: 10,
      pointerDy: 10,
      maxTravel: 0,
      deadZone: 0.05,
    });
    expect(k.nx).toBe(0);
    expect(k.ny).toBe(0);
    expect(k.mag).toBe(0);
  });
});

describe("buildJoystickMoveSnapshot", () => {
  it("marks dead zone as none cardinal", () => {
    const kin = computeJoystickKinematics({
      pointerDx: 0,
      pointerDy: 0,
      maxTravel: 100,
      deadZone: 0.2,
    });
    const snap = buildJoystickMoveSnapshot(kin, DEFAULT_JOYSTICK_SECTORS);
    expect(snap.cardinal).toBe("none");
    expect(snap.sectorId).toBeNull();
    expect(snap.clockHour).toBeNull();
    expect(snap.angleRad).toBeNull();
  });

  it("matches integration expectations for east drag", () => {
    const kin = computeJoystickKinematics({
      pointerDx: 55,
      pointerDy: 0,
      maxTravel: 100,
      deadZone: 0.05,
    });
    const snap = buildJoystickMoveSnapshot(kin, DEFAULT_JOYSTICK_SECTORS);
    expect(snap.cardinal).toBe("right");
    expect(snap.sectorId).toBe("e");
    expect(snap.clockHour).toBe(3);
    expect(snap.magnitude).toBeGreaterThan(0.2);
  });
});

describe("parseJoystickSectorsJson", () => {
  it("returns null for empty or invalid input", () => {
    expect(parseJoystickSectorsJson(null)).toBeNull();
    expect(parseJoystickSectorsJson("")).toBeNull();
    expect(parseJoystickSectorsJson("{}")).toBeNull();
    expect(parseJoystickSectorsJson("[]")).toBeNull();
    expect(parseJoystickSectorsJson("not json")).toBeNull();
  });

  it("parses valid JSON arrays", () => {
    const json = JSON.stringify([
      { id: "a", startDeg: 0, endDeg: 180 },
      { id: "b", startDeg: 180, endDeg: 360 },
    ]);
    const sectors = parseJoystickSectorsJson(json);
    expect(sectors).toHaveLength(2);
    expect(sectors?.[0]?.id).toBe("a");
  });
});
