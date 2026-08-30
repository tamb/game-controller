import { describe, expect, it } from "vitest";
import {
  GC_CONTROL_SIZE_AUTO,
  GC_CONTROL_SIZE_LANDSCAPE_PX,
  GC_CONTROL_SIZE_PX,
  gameControllerFaceButtonLabels,
  gameControllerViewportOrientation,
  gcFaceButtonsInnerClass,
  resolveGameControllerAutoControlSize,
  resolveGameControllerControlSize,
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

describe("resolveGameControllerControlSize", () => {
  it("accepts small, normal, and large", () => {
    expect(resolveGameControllerControlSize("small")).toBe("small");
    expect(resolveGameControllerControlSize("NORMAL")).toBe("normal");
    expect(resolveGameControllerControlSize(" large ")).toBe("large");
  });

  it("falls back to auto for anything else", () => {
    expect(resolveGameControllerControlSize("auto")).toBe("auto");
    expect(resolveGameControllerControlSize("medium")).toBe("auto");
    expect(resolveGameControllerControlSize("")).toBe("auto");
    expect(resolveGameControllerControlSize(undefined)).toBe("auto");
    expect(resolveGameControllerControlSize(null)).toBe("auto");
  });

  it("keeps named cluster widths in the original 165px ratio", () => {
    expect(GC_CONTROL_SIZE_PX.normal).toBe(165);
    expect(GC_CONTROL_SIZE_PX.small).toBe(120);
    expect(GC_CONTROL_SIZE_PX.large).toBe(198);
  });

  it("steps landscape buckets down from the portrait widths", () => {
    expect(GC_CONTROL_SIZE_LANDSCAPE_PX.small).toBe(100);
    expect(GC_CONTROL_SIZE_LANDSCAPE_PX.normal).toBe(140);
    expect(GC_CONTROL_SIZE_LANDSCAPE_PX.large).toBe(168);
    expect(GC_CONTROL_SIZE_LANDSCAPE_PX.normal).toBeLessThan(GC_CONTROL_SIZE_PX.normal);
  });
});

describe("resolveGameControllerAutoControlSize", () => {
  it("uses small when either axis is a phone short side", () => {
    expect(resolveGameControllerAutoControlSize(320, 568)).toBe("small");
    expect(resolveGameControllerAutoControlSize(568, 320)).toBe("small");
    expect(resolveGameControllerAutoControlSize(GC_CONTROL_SIZE_AUTO.smallMax, 800)).toBe("small");
  });

  it("uses large only when both axes are roomy", () => {
    expect(resolveGameControllerAutoControlSize(1280, 800)).toBe("large");
    expect(resolveGameControllerAutoControlSize(800, 1280)).toBe("large");
    expect(resolveGameControllerAutoControlSize(844, 390)).toBe("normal");
    expect(resolveGameControllerAutoControlSize(390, 844)).toBe("normal");
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
