import { describe, expect, it } from "vitest";
import {
  gameControllerFaceButtonLabels,
  gameControllerViewportOrientation,
  gcFaceButtonsInnerClass,
  resolveGameControllerLeftControl,
} from "./game-controller-layout";

describe("gameControllerFaceButtonLabels", () => {
  it("returns a/b for two-button layout", () => {
    expect(gameControllerFaceButtonLabels(2)).toEqual(["a", "b"]);
  });

  it("returns y/x/b/a for four-button layout", () => {
    expect(gameControllerFaceButtonLabels(4)).toEqual(["y", "x", "b", "a"]);
  });

  it("treats non-2 values as four-button layout", () => {
    expect(gameControllerFaceButtonLabels(3)).toEqual(["y", "x", "b", "a"]);
  });
});

describe("gcFaceButtonsInnerClass", () => {
  it("uses --two for actions === 2", () => {
    expect(gcFaceButtonsInnerClass(2)).toBe("gcface__actions gcface__actions--two");
  });

  it("uses --four otherwise", () => {
    expect(gcFaceButtonsInnerClass(4)).toBe("gcface__actions gcface__actions--four");
  });
});

describe("gameControllerViewportOrientation", () => {
  it("treats wider viewports as landscape", () => {
    expect(gameControllerViewportOrientation(800, 400)).toBe("landscape");
    expect(gameControllerViewportOrientation(1, 0)).toBe("landscape");
  });

  it("treats taller or square viewports as portrait", () => {
    expect(gameControllerViewportOrientation(400, 800)).toBe("portrait");
    expect(gameControllerViewportOrientation(500, 500)).toBe("portrait");
  });
});

describe("resolveGameControllerLeftControl", () => {
  it("accepts joystick", () => {
    expect(resolveGameControllerLeftControl("joystick")).toBe("joystick");
  });

  it("falls back to dpad for anything else", () => {
    expect(resolveGameControllerLeftControl("dpad")).toBe("dpad");
    expect(resolveGameControllerLeftControl("trackball")).toBe("dpad");
    expect(resolveGameControllerLeftControl(undefined)).toBe("dpad");
    expect(resolveGameControllerLeftControl(null)).toBe("dpad");
  });
});
