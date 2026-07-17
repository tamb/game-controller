import { describe, expect, it, vi } from "vitest";
import { GC_HAPTIC_PULSE_MS, parseVibrateAttribute, pulseHaptics } from "./haptics";

describe("parseVibrateAttribute", () => {
  it("defaults to on when attribute is omitted", () => {
    expect(parseVibrateAttribute(null)).toBe(true);
  });

  it("treats false / 0 / off as disabled", () => {
    expect(parseVibrateAttribute("false")).toBe(false);
    expect(parseVibrateAttribute("FALSE")).toBe(false);
    expect(parseVibrateAttribute("0")).toBe(false);
    expect(parseVibrateAttribute("off")).toBe(false);
    expect(parseVibrateAttribute("  Off  ")).toBe(false);
  });

  it("treats other values as enabled", () => {
    expect(parseVibrateAttribute("")).toBe(true);
    expect(parseVibrateAttribute("true")).toBe(true);
    expect(parseVibrateAttribute("1")).toBe(true);
  });
});

describe("pulseHaptics", () => {
  it("calls navigator.vibrate with the default pulse when enabled", () => {
    const vibrate = vi.fn(() => true);
    Object.defineProperty(navigator, "vibrate", {
      configurable: true,
      writable: true,
      value: vibrate,
    });

    pulseHaptics(true);

    expect(vibrate).toHaveBeenCalledWith(GC_HAPTIC_PULSE_MS);
  });

  it("skips vibrate when disabled", () => {
    const vibrate = vi.fn(() => true);
    Object.defineProperty(navigator, "vibrate", {
      configurable: true,
      writable: true,
      value: vibrate,
    });

    pulseHaptics(false);

    expect(vibrate).not.toHaveBeenCalled();
  });

  it("no-ops when navigator.vibrate is missing", () => {
    Reflect.deleteProperty(navigator as unknown as object, "vibrate");
    expect(() => pulseHaptics(true)).not.toThrow();
  });
});
