import { describe, expect, it } from "vitest";
import {
  EVENTS,
  gcJoystickClockHourEvent,
  SB_GAME_CONTROLLER_EVENTS,
  SB_GC_DPAD_EVENTS,
  SB_GC_JOYSTICK_EVENTS,
} from "./events";

describe("gcJoystickClockHourEvent", () => {
  it("builds gcjoystick:clock:{n}", () => {
    expect(gcJoystickClockHourEvent(1)).toBe("gcjoystick:clock:1");
    expect(gcJoystickClockHourEvent(12)).toBe("gcjoystick:clock:12");
  });
});

describe("Storybook event name lists", () => {
  it("dedupes SB_GAME_CONTROLLER_EVENTS", () => {
    expect(new Set(SB_GAME_CONTROLLER_EVENTS).size).toBe(SB_GAME_CONTROLLER_EVENTS.length);
  });

  it("includes every game-shell plus gcdpad name", () => {
    const set = new Set(SB_GAME_CONTROLLER_EVENTS);
    for (const v of Object.values(EVENTS.gameController.ancillary)) expect(set.has(v)).toBe(true);
    for (const v of Object.values(EVENTS.gameController.dpad)) expect(set.has(v)).toBe(true);
    for (const v of Object.values(EVENTS.gameController.action)) expect(set.has(v)).toBe(true);
    for (const v of Object.values(EVENTS.gcDpad)) expect(set.has(v)).toBe(true);
    for (const v of Object.values(EVENTS.gcAncillary)) expect(set.has(v)).toBe(true);
    for (const v of Object.values(EVENTS.gcFace)) expect(set.has(v)).toBe(true);
  });

  it("matches gcdpad-only list length", () => {
    expect(SB_GC_DPAD_EVENTS.length).toBe(Object.keys(EVENTS.gcDpad).length);
    expect(new Set(SB_GC_DPAD_EVENTS).size).toBe(SB_GC_DPAD_EVENTS.length);
  });

  it("joystick list dedupes and covers helpers + clock hours + cardinals", () => {
    expect(new Set(SB_GC_JOYSTICK_EVENTS).size).toBe(SB_GC_JOYSTICK_EVENTS.length);
    expect(SB_GC_JOYSTICK_EVENTS).toContain(EVENTS.gcJoystick.move);
    expect(SB_GC_JOYSTICK_EVENTS).toContain(EVENTS.gcJoystick.sector);
    expect(SB_GC_JOYSTICK_EVENTS).toContain(EVENTS.gcJoystick.clock);
    for (let h = 1; h <= 12; h++) {
      expect(SB_GC_JOYSTICK_EVENTS).toContain(gcJoystickClockHourEvent(h));
    }
    for (const v of Object.values(EVENTS.gcJoystick.cardinal)) {
      expect(SB_GC_JOYSTICK_EVENTS).toContain(v);
    }
  });
});
