/**
 * Feature detection for browser APIs used by the controller shell.
 * Safe to call in any environment (SSR / tests) when a document/navigator is passed in.
 */

/** True when the Vibration API is available (`navigator.vibrate`). */
export function isHapticsSupported(
  nav: Pick<Navigator, "vibrate"> | null | undefined = typeof navigator !== "undefined"
    ? navigator
    : undefined,
): boolean {
  return typeof nav?.vibrate === "function";
}

type FullscreenDocument = Pick<Document, "fullscreenEnabled"> & {
  webkitFullscreenEnabled?: boolean;
};

type FullscreenElement = Pick<Element, "requestFullscreen"> & {
  webkitRequestFullscreen?: () => Promise<void> | void;
};

/**
 * True when the Fullscreen API can be used on an element
 * (`document.fullscreenEnabled` / `requestFullscreen`, including webkit aliases).
 */
export function isFullscreenSupported(
  doc: FullscreenDocument | null | undefined = typeof document !== "undefined"
    ? document
    : undefined,
  el: FullscreenElement | null | undefined = typeof document !== "undefined"
    ? document.documentElement
    : undefined,
): boolean {
  if (!doc) return false;
  const enabled = doc.fullscreenEnabled ?? doc.webkitFullscreenEnabled;
  if (typeof enabled === "boolean") return enabled;
  return (
    typeof el?.requestFullscreen === "function" || typeof el?.webkitRequestFullscreen === "function"
  );
}

export type DemoCapabilityStatus = {
  fullscreen: boolean;
  haptics: boolean;
};

/** Snapshot of fullscreen + haptics support for the GitHub Pages demo stage. */
export function getDemoCapabilityStatus(
  doc: FullscreenDocument | null | undefined = typeof document !== "undefined"
    ? document
    : undefined,
  nav: Pick<Navigator, "vibrate"> | null | undefined = typeof navigator !== "undefined"
    ? navigator
    : undefined,
  el: FullscreenElement | null | undefined = typeof document !== "undefined"
    ? document.documentElement
    : undefined,
): DemoCapabilityStatus {
  return {
    fullscreen: isFullscreenSupported(doc, el),
    haptics: isHapticsSupported(nav),
  };
}
