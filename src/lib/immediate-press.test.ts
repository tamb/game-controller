import { describe, expect, it, vi } from "vitest";
import {
  DEFAULT_REPEAT_DELAY_MS,
  immediatePressProps,
  shouldIgnoreClickAfterPointerPress,
} from "./immediate-press";

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
    const onPress = vi.fn();
    const props = immediatePressProps({ onPress });
    const target = document.createElement("button");

    props.onPointerDown({
      pointerType: "touch",
      button: 0,
      timeStamp: 10,
      currentTarget: target,
    } as never);
    expect(onPress).toHaveBeenCalledTimes(1);
    expect(onPress).toHaveBeenCalledWith({ repeat: false });

    props.onClick({
      timeStamp: 12,
      currentTarget: target,
    } as never);
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it("emits press and release on click when there was no pointer press", () => {
    const onPress = vi.fn();
    const onRelease = vi.fn();
    const props = immediatePressProps({ onPress, onRelease });
    const target = document.createElement("button");

    props.onClick({
      timeStamp: 12,
      currentTarget: target,
    } as never);
    expect(onPress).toHaveBeenCalledTimes(1);
    expect(onRelease).toHaveBeenCalledTimes(1);
  });

  it("emits release on pointerup after a press", () => {
    const onPress = vi.fn();
    const onRelease = vi.fn();
    const props = immediatePressProps({ onPress, onRelease });
    const target = document.createElement("button");

    props.onPointerDown({
      pointerType: "touch",
      button: 0,
      timeStamp: 10,
      currentTarget: target,
    } as never);
    props.onPointerUp({
      currentTarget: target,
    } as never);
    expect(onRelease).toHaveBeenCalledTimes(1);
  });

  it("ignores non-primary mouse buttons", () => {
    const onPress = vi.fn();
    const props = immediatePressProps({ onPress });
    const target = document.createElement("button");

    props.onPointerDown({
      pointerType: "mouse",
      button: 2,
      timeStamp: 10,
      currentTarget: target,
    } as never);
    expect(onPress).not.toHaveBeenCalled();
  });

  it("marks pressed on pointerdown and clears on pointerup", () => {
    const onPress = vi.fn();
    const props = immediatePressProps({ onPress });
    const target = document.createElement("button");

    props.onPointerDown({
      pointerType: "touch",
      button: 0,
      timeStamp: 10,
      currentTarget: target,
    } as never);
    expect(target.dataset.gcPressed).toBe("");

    props.onPointerUp({
      currentTarget: target,
    } as never);
    expect(target.dataset.gcPressed).toBeUndefined();
  });

  it("repeats after the default delay while held", () => {
    vi.useFakeTimers();
    const onPress = vi.fn();
    const props = immediatePressProps({ onPress, repeat: true });
    const target = document.createElement("button");
    document.body.append(target);

    props.onPointerDown({
      pointerType: "touch",
      button: 0,
      timeStamp: 10,
      currentTarget: target,
    } as never);
    expect(onPress).toHaveBeenCalledTimes(1);

    vi.advanceTimersByTime(DEFAULT_REPEAT_DELAY_MS);
    expect(onPress).toHaveBeenCalledTimes(2);
    expect(onPress).toHaveBeenLastCalledWith({ repeat: true });

    vi.advanceTimersByTime(80);
    expect(onPress).toHaveBeenCalledTimes(3);

    props.onPointerUp({ currentTarget: target } as never);
    vi.advanceTimersByTime(400);
    expect(onPress).toHaveBeenCalledTimes(3);
    vi.useRealTimers();
    target.remove();
  });
});
