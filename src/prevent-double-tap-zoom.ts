import { type RefObject, useLayoutEffect } from "react";
import { getCustomElementHost } from "./lib/shadow-host";

/** iOS still treats two taps about this far apart as a zoom gesture. */
export const DOUBLE_TAP_ZOOM_WINDOW_MS = 350;

export function shouldPreventDoubleTapZoom(
  now: number,
  lastTouchEnd: number,
  windowMs = DOUBLE_TAP_ZOOM_WINDOW_MS,
): boolean {
  return lastTouchEnd > 0 && now - lastTouchEnd <= windowMs;
}

export type DoubleTapZoomGuardOptions = {
  now?: () => number;
  windowMs?: number;
};

/**
 * Blocks the browser double-tap / double-click zoom gesture.
 *
 * `touch-action: manipulation` is ignored for hits inside WebKit shadow trees,
 * so the demo and controller also cancel the second `touchend` and `dblclick`.
 */
export function installDoubleTapZoomGuard(
  target: EventTarget,
  options: DoubleTapZoomGuardOptions = {},
): () => void {
  let lastTouchEnd = 0;
  const windowMs = options.windowMs ?? DOUBLE_TAP_ZOOM_WINDOW_MS;
  const now = options.now ?? Date.now;

  const onTouchEnd = (event: Event) => {
    const timestamp = now();
    if (shouldPreventDoubleTapZoom(timestamp, lastTouchEnd, windowMs)) {
      event.preventDefault();
    }
    lastTouchEnd = timestamp;
  };

  const onDblClick = (event: Event) => {
    event.preventDefault();
  };

  const listener = { capture: true, passive: false } as const;
  target.addEventListener("touchend", onTouchEnd, listener);
  target.addEventListener("dblclick", onDblClick, { capture: true });

  return () => {
    target.removeEventListener("touchend", onTouchEnd, { capture: true });
    target.removeEventListener("dblclick", onDblClick, { capture: true });
  };
}

/** Attach the zoom guard to a custom-element host (or the React root). */
export function useDoubleTapZoomGuard(
  container: HTMLElement | undefined,
  rootRef: RefObject<HTMLElement | null>,
): void {
  useLayoutEffect(() => {
    const host = getCustomElementHost(container, rootRef.current) ?? rootRef.current;
    if (!host) return;
    return installDoubleTapZoomGuard(host);
  }, [container, rootRef.current]);
}
