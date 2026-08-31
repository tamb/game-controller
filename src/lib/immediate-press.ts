import type { MouseEvent, PointerEvent } from "react";

const PRESS_STAMP = "gcPressAt";
const PRESSED_ATTR = "gcPressed";

type RepeatTimers = {
  delay: ReturnType<typeof setTimeout> | undefined;
  interval: ReturnType<typeof setInterval> | undefined;
};

const repeatTimers = new WeakMap<HTMLElement, RepeatTimers>();

function clearPressed(el: HTMLElement): void {
  delete el.dataset[PRESSED_ATTR];
}

function setPressed(el: HTMLElement): void {
  el.dataset[PRESSED_ATTR] = "";
}

function clearRepeatTimers(el: HTMLElement): void {
  const timers = repeatTimers.get(el);
  if (!timers) return;
  if (timers.delay !== undefined) clearTimeout(timers.delay);
  if (timers.interval !== undefined) clearInterval(timers.interval);
  repeatTimers.delete(el);
}

/** Ignore follow-up `click` after a pointer press for this long. */
export const IMMEDIATE_PRESS_CLICK_WINDOW_MS = 2000;

/** Wait this long after the initial d-pad press before the first extra fire. */
export const DEFAULT_REPEAT_DELAY_MS = 400;

/** Cadence of extra d-pad fires after the initial delay. */
export const DEFAULT_REPEAT_INTERVAL_MS = 80;

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

export type ImmediatePressInfo = {
  repeat: boolean;
};

export type ImmediatePressOptions = {
  onPress: (info: ImmediatePressInfo) => void;
  onRelease?: () => void;
  /** Hold-to-repeat (d-pad). Default off. */
  repeat?: boolean;
  repeatDelay?: number;
  repeatInterval?: number;
};

function coerceMs(value: number | undefined, fallback: number): number {
  if (typeof value !== "number" || !Number.isFinite(value) || value < 0) return fallback;
  return value;
}

function startRepeat(el: HTMLElement, options: ImmediatePressOptions): void {
  if (!options.repeat) return;
  clearRepeatTimers(el);
  const delay = coerceMs(options.repeatDelay, DEFAULT_REPEAT_DELAY_MS);
  const interval = coerceMs(options.repeatInterval, DEFAULT_REPEAT_INTERVAL_MS);
  const timers: RepeatTimers = { delay: undefined, interval: undefined };
  timers.delay = setTimeout(() => {
    if (!el.isConnected) {
      clearRepeatTimers(el);
      return;
    }
    options.onPress({ repeat: true });
    timers.interval = setInterval(() => {
      if (!el.isConnected) {
        clearRepeatTimers(el);
        return;
      }
      options.onPress({ repeat: true });
    }, interval);
  }, delay);
  repeatTimers.set(el, timers);
}

/**
 * Fire on `pointerdown` (so a cancelled second `touchend` cannot swallow a tap)
 * and still accept keyboard / `element.click()` via `click`.
 * Optional hold-to-repeat for d-pad (delay then interval).
 */
export function immediatePressProps(options: ImmediatePressOptions): {
  onPointerDown: (event: PointerEvent<HTMLElement>) => void;
  onPointerUp: (event: PointerEvent<HTMLElement>) => void;
  onPointerCancel: (event: PointerEvent<HTMLElement>) => void;
  onClick: (event: MouseEvent<HTMLElement>) => void;
} {
  const { onPress, onRelease } = options;

  const release = (el: HTMLElement) => {
    clearRepeatTimers(el);
    clearPressed(el);
    onRelease?.();
  };

  return {
    onPointerDown: (event) => {
      if (event.pointerType === "mouse" && event.button !== 0) return;
      const el = event.currentTarget;
      el.dataset[PRESS_STAMP] = String(event.timeStamp);
      setPressed(el);
      onPress({ repeat: false });
      startRepeat(el, options);
    },
    onPointerUp: (event) => {
      if (event.currentTarget.dataset[PRESSED_ATTR] === undefined) return;
      release(event.currentTarget);
    },
    onPointerCancel: (event) => {
      if (event.currentTarget.dataset[PRESSED_ATTR] === undefined) return;
      release(event.currentTarget);
    },
    onClick: (event) => {
      const el = event.currentTarget;
      const stamped = Number(el.dataset[PRESS_STAMP]);
      if (shouldIgnoreClickAfterPointerPress(event.timeStamp, stamped)) {
        delete el.dataset[PRESS_STAMP];
        clearPressed(el);
        return;
      }
      onPress({ repeat: false });
      onRelease?.();
    },
  };
}
