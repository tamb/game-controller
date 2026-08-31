import { useRef } from "react";
import type { GameControllerActionKey } from "../../events";
import { EVENTS } from "../../events";
import { resolveComponentCss } from "../../lib/component-css";
import { dispatchComposed } from "../../lib/dispatch-event";
import { immediatePressProps } from "../../lib/immediate-press";
import { defineOnce, defineReactElement } from "../../lib/r2wc-element";
import { getCustomElementHost, isShadowContainer } from "../../lib/shadow-host";
import { useFeedbackAttribute } from "../../lib/use-feedback-attribute";
import { useDoubleTapZoomGuard } from "../../prevent-double-tap-zoom";
import {
  gameControllerFaceButtonLabels,
  gcFaceButtonsInnerClass,
} from "../game-controller/game-controller-layout";
import styles from "./gc-face-buttons.css?raw";

const HOST_CLASS = "gcface-host";

export type GcFacePressDetail = {
  controller: HTMLElement;
  button: GameControllerActionKey;
};

export type GcFaceButtonsProps = {
  actions?: number;
  container?: HTMLElement;
  feedback?: boolean | string;
  onButton?: (detail: GcFacePressDetail) => void;
};

export function GcFaceButtons({ actions = 2, container, feedback, onButton }: GcFaceButtonsProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const inShadow = isShadowContainer(container);
  useDoubleTapZoomGuard(container, rootRef);
  useFeedbackAttribute(container, rootRef, feedback);
  const css = resolveComponentCss(styles, HOST_CLASS, inShadow);
  const labels = gameControllerFaceButtonLabels(actions);
  const cls = gcFaceButtonsInnerClass(actions);

  const emitFace = (button: GameControllerActionKey) => {
    const controller = getCustomElementHost(container, rootRef.current);
    if (!controller) return;
    const detail: GcFacePressDetail = { controller, button };
    onButton?.(detail);
    dispatchComposed(controller, EVENTS.gcFace[button], detail);
  };

  return (
    <>
      <style>{css}</style>
      <div ref={rootRef} className={inShadow ? cls : `${HOST_CLASS} ${cls}`} part="actions">
        {labels.map((key, i) => (
          <button
            key={key}
            type="button"
            className={`gcface__btn gcface__btn--${i + 1}`}
            part={`btn-${key}`}
            {...immediatePressProps(() => emitFace(key))}
          >
            {key.toUpperCase()}
          </button>
        ))}
      </div>
    </>
  );
}

export interface GcFaceButtonsElement extends HTMLElement {
  actions: number;
  feedback: boolean;
  readonly updateComplete: Promise<void>;
}

export const GcFaceButtonsElement = defineReactElement<GcFaceButtonsProps, GcFaceButtonsElement>(
  GcFaceButtons,
  {
    props: {
      actions: "number",
      feedback: "boolean",
    },
  },
);

defineOnce("gc-face-buttons", GcFaceButtonsElement);
