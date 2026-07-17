import type { GameControllerActionKey } from "../../events";

const ACTION_LABELS_4 = ["y", "x", "b", "a"] as const satisfies readonly GameControllerActionKey[];
const ACTION_LABELS_2 = ["a", "b"] as const satisfies readonly GameControllerActionKey[];

/** `"dpad"` (default) or `"joystick"` — left-hand control for `<game-controller>`. */
export type GameControllerLeftControl = "dpad" | "joystick";

/** Face-button keys for `actions === 2` vs four-button layout (same rule as `<game-controller>`). */
export function gameControllerFaceButtonLabels(
  actions: number,
): readonly GameControllerActionKey[] {
  return actions === 2 ? ACTION_LABELS_2 : ACTION_LABELS_4;
}

/** Inner wrapper classes for `<gc-face-buttons>` shadow layout (`--two` | `--four`). */
export function gcFaceButtonsInnerClass(actions: number): string {
  return actions === 2
    ? "gcface__actions gcface__actions--two"
    : "gcface__actions gcface__actions--four";
}

/**
 * Viewport orientation used by the shell CSS (`@media (orientation: landscape)`).
 * Matches the CSS media feature: width > height → landscape.
 */
export type GameControllerViewportOrientation = "portrait" | "landscape";

export function gameControllerViewportOrientation(
  width: number,
  height: number,
): GameControllerViewportOrientation {
  return width > height ? "landscape" : "portrait";
}

/**
 * Resolves `left-control` / `leftControl` to a known left-hand control.
 * Unknown values fall back to d-pad (same rule as `<game-controller>`).
 */
export function resolveGameControllerLeftControl(
  value: string | null | undefined,
): GameControllerLeftControl {
  return value === "joystick" ? "joystick" : "dpad";
}

/**
 * Landscape control band order (flex `order` after `display: contents` on the main-controls strip).
 * Stick | center (stage + ancillary) | face buttons.
 */
export const LANDSCAPE_CONTROL_ORDER = {
  stick: 1,
  center: 2,
  actions: 3,
} as const;
