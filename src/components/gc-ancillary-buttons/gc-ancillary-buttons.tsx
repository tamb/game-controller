import { useRef } from "react";
import { EVENTS } from "../../events";
import { resolveComponentCss } from "../../lib/component-css";
import { dispatchComposed } from "../../lib/dispatch-event";
import { defineOnce, defineReactElement } from "../../lib/r2wc-element";
import { getCustomElementHost, isShadowContainer } from "../../lib/shadow-host";
import styles from "./gc-ancillary-buttons.css?raw";

const HOST_CLASS = "gcancillary-host";

export type GcAncillaryId = keyof typeof EVENTS.gcAncillary;

export type GcAncillaryPressDetail = {
  controller: HTMLElement;
  id: GcAncillaryId;
};

export type GcAncillaryButtonsProps = {
  container?: HTMLElement;
  onPress?: (detail: GcAncillaryPressDetail) => void;
};

const BUTTONS: readonly { id: GcAncillaryId; part: string }[] = [
  { id: "fullscreen", part: "btn-fullscreen" },
  { id: "select", part: "btn-select" },
  { id: "start", part: "btn-start" },
];

export function GcAncillaryButtons({ container, onPress }: GcAncillaryButtonsProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const inShadow = isShadowContainer(container);
  const css = resolveComponentCss(styles, HOST_CLASS, inShadow);

  const emitPress = (id: GcAncillaryId) => {
    const controller = getCustomElementHost(container, rootRef.current);
    if (!controller) return;
    const detail: GcAncillaryPressDetail = { controller, id };
    onPress?.(detail);
    dispatchComposed(controller, EVENTS.gcAncillary[id], detail);
  };

  return (
    <>
      <style>{css}</style>
      <div
        ref={rootRef}
        className={inShadow ? "gcancillary" : `${HOST_CLASS} gcancillary`}
        part="row"
      >
        {BUTTONS.map(({ id, part }) => (
          <button
            key={id}
            type="button"
            className="gcancillary__btn"
            part={part}
            id={id === "fullscreen" ? "fullscreen" : undefined}
            onClick={() => emitPress(id)}
          >
            {id}
          </button>
        ))}
      </div>
    </>
  );
}

export interface GcAncillaryButtonsElement extends HTMLElement {
  readonly updateComplete: Promise<void>;
}

export const GcAncillaryButtonsElement = defineReactElement<
  GcAncillaryButtonsProps,
  GcAncillaryButtonsElement
>(GcAncillaryButtons);

defineOnce("gc-ancillary-buttons", GcAncillaryButtonsElement);
