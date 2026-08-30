import { describe, expect, it, vi } from "vitest";
import {
  DOUBLE_TAP_ZOOM_WINDOW_MS,
  installDoubleTapZoomGuard,
  shouldPreventDoubleTapZoom,
} from "./prevent-double-tap-zoom";

describe("shouldPreventDoubleTapZoom", () => {
  it("allows the first tap", () => {
    expect(shouldPreventDoubleTapZoom(1000, 0)).toBe(false);
  });

  it("blocks a second tap inside the zoom window", () => {
    expect(shouldPreventDoubleTapZoom(1000, 1000 - DOUBLE_TAP_ZOOM_WINDOW_MS)).toBe(true);
    expect(shouldPreventDoubleTapZoom(1000, 800)).toBe(true);
  });

  it("allows a later tap after the zoom window", () => {
    expect(shouldPreventDoubleTapZoom(1000, 1000 - DOUBLE_TAP_ZOOM_WINDOW_MS - 1)).toBe(false);
  });
});

describe("installDoubleTapZoomGuard", () => {
  it("prevents the second touchend inside the zoom window", () => {
    const target = document.createElement("div");
    let now = 1_000;
    const stop = installDoubleTapZoomGuard(target, { now: () => now });

    const first = new Event("touchend", { bubbles: true, cancelable: true });
    target.dispatchEvent(first);
    expect(first.defaultPrevented).toBe(false);

    now = 1_000 + 120;
    const second = new Event("touchend", { bubbles: true, cancelable: true });
    target.dispatchEvent(second);
    expect(second.defaultPrevented).toBe(true);

    stop();
  });

  it("does not prevent a later third tap", () => {
    const target = document.createElement("div");
    let now = 1_000;
    const stop = installDoubleTapZoomGuard(target, { now: () => now });

    target.dispatchEvent(new Event("touchend", { bubbles: true, cancelable: true }));
    now = 1_000 + 120;
    target.dispatchEvent(new Event("touchend", { bubbles: true, cancelable: true }));
    now = 1_000 + 120 + DOUBLE_TAP_ZOOM_WINDOW_MS + 1;
    const third = new Event("touchend", { bubbles: true, cancelable: true });
    target.dispatchEvent(third);
    expect(third.defaultPrevented).toBe(false);

    stop();
  });

  it("prevents dblclick", () => {
    const target = document.createElement("div");
    const stop = installDoubleTapZoomGuard(target);
    const dblclick = new MouseEvent("dblclick", { bubbles: true, cancelable: true });
    target.dispatchEvent(dblclick);
    expect(dblclick.defaultPrevented).toBe(true);
    stop();
  });

  it("removes listeners on dispose", () => {
    const target = document.createElement("div");
    const preventDefault = vi.spyOn(Event.prototype, "preventDefault");
    const stop = installDoubleTapZoomGuard(target);
    stop();

    const dblclick = new MouseEvent("dblclick", { bubbles: true, cancelable: true });
    target.dispatchEvent(dblclick);
    expect(preventDefault).not.toHaveBeenCalled();
    preventDefault.mockRestore();
  });
});
