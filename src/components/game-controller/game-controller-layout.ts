import type { GameControllerActionKey } from "../../events";

const ACTION_LABELS_4 = ["y", "x", "b", "a"] as const satisfies readonly GameControllerActionKey[];
const ACTION_LABELS_2 = ["a", "b"] as const satisfies readonly GameControllerActionKey[];

/** `"dpad"` (default) or `"joystick"` — left-hand control for `<game-controller>`. */
export type GameControllerLeftControl = "dpad" | "joystick";

/**
 * Control-cluster size group. `"auto"` (default) follows the **short axis**:
 * small when `min(width, height) ≤ 360`, large when both axes are `≥ 600`,
 * otherwise normal. Landscape remaps the same names to smaller pixels.
 */
export type GameControllerControlSize = "auto" | "small" | "normal" | "large";

/** Named size after `"auto"` is resolved. */
export type GameControllerResolvedControlSize = Exclude<GameControllerControlSize, "auto">;

/** Short-axis breakpoints for `size="auto"`. Keep in sync with `game-controller.css`. */
export const GC_CONTROL_SIZE_AUTO = {
  smallMax: 360,
  largeMin: 600,
} as const;

/** Portrait pixel widths for `--gc-control-size-*` (D-pad / stick / face cluster). */
export const GC_CONTROL_SIZE_PX = {
  small: 120,
  normal: 165,
  large: 198,
} as const;

/**
 * Landscape buckets are stepped down so side hands leave room for the stage.
 * Keep in sync with `@media (orientation: landscape)` in `game-controller.css`.
 */
export const GC_CONTROL_SIZE_LANDSCAPE_PX = {
  small: 100,
  normal: 140,
  large: 168,
} as const;

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
 * Resolves `size` / `size` attribute. Empty or unknown values are `"auto"`
 * (same rule as omitting the attribute).
 */
export function resolveGameControllerControlSize(
  value: string | null | undefined,
): GameControllerControlSize {
  if (value == null) return "auto";
  const normalized = String(value).trim().toLowerCase();
  if (normalized === "small" || normalized === "normal" || normalized === "large") {
    return normalized;
  }
  return "auto";
}

/**
 * `size="auto"` bucket from viewport size. Matches the shell CSS:
 * small if either axis ≤ 360, large only when both axes ≥ 600.
 */
export function resolveGameControllerAutoControlSize(
  width: number,
  height: number,
): GameControllerResolvedControlSize {
  if (width <= GC_CONTROL_SIZE_AUTO.smallMax || height <= GC_CONTROL_SIZE_AUTO.smallMax) {
    return "small";
  }
  if (width >= GC_CONTROL_SIZE_AUTO.largeMin && height >= GC_CONTROL_SIZE_AUTO.largeMin) {
    return "large";
  }
  return "normal";
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
