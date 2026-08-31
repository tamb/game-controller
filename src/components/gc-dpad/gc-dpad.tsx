import { useRef } from "react";
import { EVENTS } from "../../events";
import { parseVibrateAttribute } from "../../haptics";
import { resolveComponentCss } from "../../lib/component-css";
import { dispatchComposed } from "../../lib/dispatch-event";
import {
  DEFAULT_REPEAT_DELAY_MS,
  DEFAULT_REPEAT_INTERVAL_MS,
  immediatePressProps,
} from "../../lib/immediate-press";
import { defineReactElement } from "../../lib/r2wc-element";
import { getCustomElementHost, isShadowContainer } from "../../lib/shadow-host";
import { useFeedbackAttribute } from "../../lib/use-feedback-attribute";
import { useDoubleTapZoomGuard } from "../../prevent-double-tap-zoom";
import styles from "./gc-dpad.css?raw";

const HOST_CLASS = "gcdpad-host";

export type GcDpadDirection = "up" | "down" | "left" | "right";

export type GcDpadPressDetail = {
  controller: HTMLElement;
  direction: GcDpadDirection;
  repeat: boolean;
};

export type GcDpadReleaseDetail = {
  controller: HTMLElement;
  direction: GcDpadDirection;
};

export type GcDpadProps = {
  container?: HTMLElement;
  feedback?: boolean | string;
  /** Hold-to-repeat. Default on. Off: `repeat="false"`. */
  repeat?: boolean | string;
  repeatDelay?: number | string;
  repeatInterval?: number | string;
  onDirection?: (detail: GcDpadPressDetail) => void;
  onDirectionReleased?: (detail: GcDpadReleaseDetail) => void;
};

const DIRECTIONS: readonly GcDpadDirection[] = ["up", "left", "right", "down"];

function coerceRepeat(value: unknown): boolean {
  if (value === false) return false;
  if (value === true || value === undefined || value === null) return true;
  if (typeof value === "string") return parseVibrateAttribute(value);
  return Boolean(value);
}

function coerceMs(value: unknown, fallback: number): number {
  if (typeof value === "number" && Number.isFinite(value) && value >= 0) return value;
  if (typeof value === "string" && value.trim() !== "") {
    const n = Number(value);
    if (Number.isFinite(n) && n >= 0) return n;
  }
  return fallback;
}

export function GcDpad({
  container,
  feedback,
  repeat: repeatProp,
  repeatDelay: delayProp,
  repeatInterval: intervalProp,
  onDirection,
  onDirectionReleased,
}: GcDpadProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const inShadow = isShadowContainer(container);
  useDoubleTapZoomGuard(container, rootRef);
  useFeedbackAttribute(container, rootRef, feedback);
  const css = resolveComponentCss(styles, HOST_CLASS, inShadow);
  const repeat = coerceRepeat(repeatProp);
  const repeatDelay = coerceMs(delayProp, DEFAULT_REPEAT_DELAY_MS);
  const repeatInterval = coerceMs(intervalProp, DEFAULT_REPEAT_INTERVAL_MS);

  const emitDirection = (direction: GcDpadDirection, isRepeat: boolean) => {
    const controller = getCustomElementHost(container, rootRef.current);
    if (!controller) return;
    const detail: GcDpadPressDetail = { controller, direction, repeat: isRepeat };
    onDirection?.(detail);
    dispatchComposed(controller, EVENTS.gcDpad[direction], detail);
  };

  const emitReleased = (direction: GcDpadDirection) => {
    const controller = getCustomElementHost(container, rootRef.current);
    if (!controller) return;
    const detail: GcDpadReleaseDetail = { controller, direction };
    onDirectionReleased?.(detail);
    dispatchComposed(controller, EVENTS.gcDpadReleased[direction], detail);
  };

  return (
    <>
      <style>{css}</style>
      <div ref={rootRef} className={inShadow ? "gcdpad" : `${HOST_CLASS} gcdpad`} part="base">
        {DIRECTIONS.map((direction) => (
          <button
            key={direction}
            type="button"
            className={`gcdpad__btn gcdpad__btn--${direction}`}
            aria-label={direction[0].toUpperCase() + direction.slice(1)}
            part={`btn-${direction}`}
            {...immediatePressProps({
              onPress: ({ repeat: isRepeat }) => emitDirection(direction, isRepeat),
              onRelease: () => emitReleased(direction),
              repeat,
              repeatDelay,
              repeatInterval,
            })}
          />
        ))}
      </div>
    </>
  );
}

export interface GcDpadElement extends HTMLElement {
  feedback: boolean;
  repeat: boolean;
  repeatDelay: number;
  repeatInterval: number;
  readonly updateComplete: Promise<void>;
}

export const GcDpadElement = defineReactElement<GcDpadProps, GcDpadElement>(GcDpad, {
  props: {
    feedback: "boolean",
    repeat: "boolean",
    repeatDelay: "number",
    repeatInterval: "number",
  },
  emptyBooleanAttributes: ["repeat"],
});
