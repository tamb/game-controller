import type { MouseEvent, PointerEvent } from "react";

const PRESS_STAMP = "gcPressAt";
const PRESSED_ATTR = "gcPressed";

function clearPressed(el: HTMLElement): void {
  delete el.dataset[PRESSED_ATTR];
}

function setPressed(el: HTMLElement): void {
  el.dataset[PRESSED_ATTR] = "";
}

/** Ignore follow-up `click` after a pointer press for this long. */
export const IMMEDIATE_PRESS_CLICK_WINDOW_MS = 2000;

export function shouldIgnoreClickAfterPointerPress(
  clickTimeStamp: number,
  pointerTimeStamp: number | undefined,
  windowMs = IMMEDIATE_PRESS_CLICK_WINDOW_MS,
): boolean {
  return (
    pointerTimeStamp !== undefined &&
    Number.isFinite(pointerTimeStamp) &&
    clickTimeStamp - pointerTimeStamp >= 0 &&
    clickTimeStamp - pointerTimeStamp < windowMs
  );
}

/**
 * Fire on `pointerdown` (so a cancelled second `touchend` cannot swallow a tap)
 * and still accept keyboard / `element.click()` via `click`.
 */
export function immediatePressProps(emit: () => void): {
  onPointerDown: (event: PointerEvent<HTMLElement>) => void;
  onPointerUp: (event: PointerEvent<HTMLElement>) => void;
  onPointerCancel: (event: PointerEvent<HTMLElement>) => void;
  onClick: (event: MouseEvent<HTMLElement>) => void;
} {
  return {
    onPointerDown: (event) => {
      if (event.pointerType === "mouse" && event.button !== 0) return;
      event.currentTarget.dataset[PRESS_STAMP] = String(event.timeStamp);
      setPressed(event.currentTarget);
      emit();
    },
    onPointerUp: (event) => {
      clearPressed(event.currentTarget);
    },
    onPointerCancel: (event) => {
      clearPressed(event.currentTarget);
    },
    onClick: (event) => {
      const stamped = Number(event.currentTarget.dataset[PRESS_STAMP]);
      if (shouldIgnoreClickAfterPointerPress(event.timeStamp, stamped)) {
        delete event.currentTarget.dataset[PRESS_STAMP];
        clearPressed(event.currentTarget);
        return;
      }
      emit();
    },
  };
}
