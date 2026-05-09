import type { GameControllerActionKey } from "../../events";

const ACTION_LABELS_4 = ["y", "x", "b", "a"] as const satisfies readonly GameControllerActionKey[];
const ACTION_LABELS_2 = ["a", "b"] as const satisfies readonly GameControllerActionKey[];

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
