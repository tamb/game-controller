import { useRef } from "react";
import type { GameControllerActionKey } from "../../events";
import { EVENTS } from "../../events";
import { resolveComponentCss } from "../../lib/component-css";
import { dispatchComposed } from "../../lib/dispatch-event";
import { immediatePressProps } from "../../lib/immediate-press";
import { defineReactElement } from "../../lib/r2wc-element";
import { getCustomElementHost, isShadowContainer } from "../../lib/shadow-host";
import { useFeedbackAttribute } from "../../lib/use-feedback-attribute";
import { useDoubleTapZoomGuard } from "../../prevent-double-tap-zoom";
import {
  type GameControllerActionsCount,
  gameControllerFaceButtonLabels,
  gcFaceButtonsInnerClass,
  resolveGameControllerActions,
} from "../game-controller/game-controller-layout";
import styles from "./gc-face-buttons.css?raw";

const HOST_CLASS = "gcface-host";

export type GcFacePressDetail = {
  controller: HTMLElement;
  button: GameControllerActionKey;
  repeat: boolean;
};

export type GcFaceReleaseDetail = {
  controller: HTMLElement;
  button: GameControllerActionKey;
};

export type GcFaceButtonsProps = {
  actions?: GameControllerActionsCount;
  container?: HTMLElement;
  feedback?: boolean | string;
  onButton?: (detail: GcFacePressDetail) => void;
  onButtonReleased?: (detail: GcFaceReleaseDetail) => void;
};

export function GcFaceButtons({
  actions = 2,
  container,
  feedback,
  onButton,
  onButtonReleased,
}: GcFaceButtonsProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const inShadow = isShadowContainer(container);
  useDoubleTapZoomGuard(container, rootRef);
  useFeedbackAttribute(container, rootRef, feedback);
  const css = resolveComponentCss(styles, HOST_CLASS, inShadow);
  const count = resolveGameControllerActions(actions);
  const labels = gameControllerFaceButtonLabels(count);
  const cls = gcFaceButtonsInnerClass(count);

  const emitFace = (button: GameControllerActionKey, isRepeat: boolean) => {
    const controller = getCustomElementHost(container, rootRef.current);
    if (!controller) return;
    const detail: GcFacePressDetail = { controller, button, repeat: isRepeat };
    onButton?.(detail);
    dispatchComposed(controller, EVENTS.gcFace[button], detail);
  };

  const emitReleased = (button: GameControllerActionKey) => {
    const controller = getCustomElementHost(container, rootRef.current);
    if (!controller) return;
    const detail: GcFaceReleaseDetail = { controller, button };
    onButtonReleased?.(detail);
    dispatchComposed(controller, EVENTS.gcFaceReleased[button], detail);
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
            {...immediatePressProps({
              onPress: ({ repeat }) => emitFace(key, repeat),
              onRelease: () => emitReleased(key),
            })}
          >
            {key.toUpperCase()}
          </button>
        ))}
      </div>
    </>
  );
}

export interface GcFaceButtonsElement extends HTMLElement {
  actions: GameControllerActionsCount;
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
