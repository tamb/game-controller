import { describe, expect, it, vi } from "vitest";
import { immediatePressProps, shouldIgnoreClickAfterPointerPress } from "./immediate-press";

describe("shouldIgnoreClickAfterPointerPress", () => {
  it("ignores a click that follows a pointer press", () => {
    expect(shouldIgnoreClickAfterPointerPress(150, 100)).toBe(true);
  });

  it("keeps a programmatic or keyboard click", () => {
    expect(shouldIgnoreClickAfterPointerPress(100, undefined)).toBe(false);
  });

  it("keeps a click after the press window", () => {
    expect(shouldIgnoreClickAfterPointerPress(3000, 100)).toBe(false);
  });
});

describe("immediatePressProps", () => {
  it("emits on pointerdown and ignores the paired click", () => {
    const emit = vi.fn();
    const props = immediatePressProps(emit);
    const target = document.createElement("button");

    props.onPointerDown({
      pointerType: "touch",
      button: 0,
      timeStamp: 10,
      currentTarget: target,
    } as never);
    expect(emit).toHaveBeenCalledTimes(1);

    props.onClick({
      timeStamp: 12,
      currentTarget: target,
    } as never);
    expect(emit).toHaveBeenCalledTimes(1);
  });

  it("emits on click when there was no pointer press", () => {
    const emit = vi.fn();
    const props = immediatePressProps(emit);
    const target = document.createElement("button");

    props.onClick({
      timeStamp: 12,
      currentTarget: target,
    } as never);
    expect(emit).toHaveBeenCalledTimes(1);
  });

  it("ignores non-primary mouse buttons", () => {
    const emit = vi.fn();
    const props = immediatePressProps(emit);
    const target = document.createElement("button");

    props.onPointerDown({
      pointerType: "mouse",
      button: 2,
      timeStamp: 10,
      currentTarget: target,
    } as never);
    expect(emit).not.toHaveBeenCalled();
  });
});
