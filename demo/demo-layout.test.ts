import { describe, expect, it } from "vitest";
import { applyDemoLayout, demoLayoutFromPreset, matchDemoPreset } from "./demo-layout";

describe("demoLayoutFromPreset", () => {
  it("maps classic / action / analog / stick-ab layouts", () => {
    expect(demoLayoutFromPreset("classic", true)).toEqual({
      leftControl: "dpad",
      actions: 2,
      vibrate: true,
    });
    expect(demoLayoutFromPreset("action", false)).toEqual({
      leftControl: "dpad",
      actions: 4,
      vibrate: false,
    });
    expect(demoLayoutFromPreset("analog", true)).toEqual({
      leftControl: "joystick",
      actions: 4,
      vibrate: true,
    });
    expect(demoLayoutFromPreset("stick-ab", true)).toEqual({
      leftControl: "joystick",
      actions: 2,
      vibrate: true,
    });
  });
});

describe("matchDemoPreset", () => {
  it("recognizes each named combination", () => {
    expect(matchDemoPreset({ leftControl: "dpad", actions: 2 })).toBe("classic");
    expect(matchDemoPreset({ leftControl: "dpad", actions: 4 })).toBe("action");
    expect(matchDemoPreset({ leftControl: "joystick", actions: 4 })).toBe("analog");
    expect(matchDemoPreset({ leftControl: "joystick", actions: 2 })).toBe("stick-ab");
  });
});

describe("applyDemoLayout", () => {
  it("writes leftControl, actions, and vibrate onto the controller", () => {
    const controller = {
      leftControl: "dpad",
      actions: 2,
      vibrate: true,
    };
    applyDemoLayout(controller as never, {
      leftControl: "joystick",
      actions: 4,
      vibrate: false,
    });
    expect(controller).toEqual({
      leftControl: "joystick",
      actions: 4,
      vibrate: false,
    });
  });
});
