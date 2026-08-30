import { useRef } from "react";
import { EVENTS } from "../../events";
import { resolveComponentCss } from "../../lib/component-css";
import { dispatchComposed } from "../../lib/dispatch-event";
import { immediatePressProps } from "../../lib/immediate-press";
import { defineOnce, defineReactElement } from "../../lib/r2wc-element";
import { getCustomElementHost, isShadowContainer } from "../../lib/shadow-host";
import { useDoubleTapZoomGuard } from "../../prevent-double-tap-zoom";
import styles from "./gc-dpad.css?raw";

const HOST_CLASS = "gcdpad-host";

export type GcDpadDirection = "up" | "down" | "left" | "right";

export type GcDpadPressDetail = {
  controller: HTMLElement;
  direction: GcDpadDirection;
};

export type GcDpadProps = {
  container?: HTMLElement;
  onDirection?: (detail: GcDpadPressDetail) => void;
};

const DIRECTIONS: readonly GcDpadDirection[] = ["up", "left", "right", "down"];

export function GcDpad({ container, onDirection }: GcDpadProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const inShadow = isShadowContainer(container);
  useDoubleTapZoomGuard(container, rootRef);
  const css = resolveComponentCss(styles, HOST_CLASS, inShadow);

  const emitDirection = (direction: GcDpadDirection) => {
    const controller = getCustomElementHost(container, rootRef.current);
    if (!controller) return;
    const detail: GcDpadPressDetail = { controller, direction };
    onDirection?.(detail);
    dispatchComposed(controller, EVENTS.gcDpad[direction], detail);
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
            {...immediatePressProps(() => emitDirection(direction))}
          />
        ))}
      </div>
    </>
  );
}

export interface GcDpadElement extends HTMLElement {
  readonly updateComplete: Promise<void>;
}

export const GcDpadElement = defineReactElement<GcDpadProps, GcDpadElement>(GcDpad);

defineOnce("gc-dpad", GcDpadElement);
