import { type CSSProperties, type ReactNode, useEffect, useRef } from "react";
import type { GameControllerActionKey } from "../../events";
import { EVENTS } from "../../events";
import { parseVibrateAttribute, pulseHaptics } from "../../haptics";
import { resolveComponentCss } from "../../lib/component-css";
import { dispatchComposed } from "../../lib/dispatch-event";
import { defineOnce, defineReactElement } from "../../lib/r2wc-element";
import { getCustomElementHost, isShadowContainer } from "../../lib/shadow-host";
import { unlockScreenOrientation } from "../../orientation";
import { GcAncillaryButtons } from "../gc-ancillary-buttons/gc-ancillary-buttons";
import { GcDpad } from "../gc-dpad/gc-dpad";
import { GcFaceButtons } from "../gc-face-buttons/gc-face-buttons";
import { GcJoystick } from "../gc-joystick/gc-joystick";
import styleText from "./game-controller.css?raw";
import {
  type GameControllerLeftControl,
  resolveGameControllerLeftControl,
} from "./game-controller-layout";

export type { GameControllerLeftControl };

const HOST_CLASS = "game-controller";
const TAG = "game-controller";

export type GameControllerHooks = Record<string, (controller: HTMLElement) => void>;

export type GameControllerProps = {
  actions?: number;
  vibrate?: boolean | string;
  leftControl?: string;
  hooks?: GameControllerHooks;
  children?: ReactNode;
  container?: HTMLElement;
  className?: string;
  style?: CSSProperties;
};

function coerceVibrate(value: unknown): boolean {
  if (value === false) return false;
  if (value === true || value === undefined || value === null) return true;
  if (typeof value === "string") return parseVibrateAttribute(value);
  return Boolean(value);
}

export function GameController({
  actions = 2,
  vibrate: vibrateProp,
  leftControl,
  hooks = {},
  children,
  container,
  className,
  style,
}: GameControllerProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const inShadow = isShadowContainer(container);
  const css = resolveComponentCss(styleText, HOST_CLASS, inShadow);
  const vibrate = coerceVibrate(vibrateProp);
  const leftStickMode = resolveGameControllerLeftControl(leftControl);

  const hostEl = () => getCustomElementHost(container, rootRef.current);

  const emit = (name: string, data: Record<string, unknown> = {}) => {
    const controller = hostEl();
    if (!controller) return;
    dispatchComposed(controller, name, { ...data, controller });
  };

  const pulse = (durationMs?: number) => {
    pulseHaptics(vibrate, durationMs);
  };

  const handleNamed = (refName: string, eventName: string) => {
    pulse();
    const controller = hostEl();
    if (controller) hooks[refName]?.(controller);
    emit(eventName);
  };

  const toggleFullscreen = async () => {
    const controller = hostEl();
    if (!controller) return;
    try {
      if (document.fullscreenElement === controller) {
        await document.exitFullscreen();
      } else {
        await controller.requestFullscreen();
        await unlockScreenOrientation();
      }
    } catch {
      /* unsupported or denied */
    }
  };

  const handleAncillary = (id: string) => {
    if (id === "fullscreen") {
      handleNamed("fullscreen", EVENTS.gameController.ancillary.fullscreen);
      void toggleFullscreen();
      return;
    }
    if (id === "select") {
      handleNamed("select", EVENTS.gameController.ancillary.select);
      return;
    }
    handleNamed("start", EVENTS.gameController.ancillary.start);
  };

  const handleAction = (buttonKey: GameControllerActionKey) => {
    handleNamed(buttonKey, EVENTS.gameController.action[buttonKey]);
  };

  const handleDpad = (direction: "up" | "down" | "left" | "right") => {
    handleNamed(direction, EVENTS.gameController.dpad[direction]);
  };

  const rootClass = [inShadow ? undefined : HOST_CLASS, className].filter(Boolean).join(" ");

  const body = (
    <div className="gamecontroller__shell">
      <div className="gamecontroller__container">
        <div className="gamecontroller__center">
          <div className="gamecontroller__stage">
            <slot name="stage">{children}</slot>
          </div>
          <div className="gamecontroller__ancillaries">
            <GcAncillaryButtons onPress={(detail) => handleAncillary(detail.id)} />
          </div>
        </div>
        <div className="gamecontroller__main-controls">
          <div className="gamecontroller__d-pad-container">
            {leftStickMode === "joystick" ? (
              <GcJoystick emitCardinal onPointerDown={() => pulse()} />
            ) : (
              <GcDpad onDirection={(detail) => handleDpad(detail.direction)} />
            )}
          </div>
          <div className="gamecontroller__actions">
            <GcFaceButtons actions={actions} onButton={(detail) => handleAction(detail.button)} />
          </div>
        </div>
      </div>
    </div>
  );

  useEffect(() => {
    const controller = getCustomElementHost(container, rootRef.current);
    if (!controller || leftStickMode !== "joystick") return;

    const onCardinal = () => pulseHaptics(vibrate);
    const types = Object.values(EVENTS.gcJoystick.cardinal);
    for (const type of types) {
      controller.addEventListener(type, onCardinal);
    }
    return () => {
      for (const type of types) {
        controller.removeEventListener(type, onCardinal);
      }
    };
  }, [container, leftStickMode, vibrate]);

  return (
    <>
      <style>{css}</style>
      {rootClass ? (
        <div ref={rootRef} className={rootClass} style={style}>
          {body}
        </div>
      ) : (
        <div ref={rootRef} style={{ display: "contents" }}>
          {body}
        </div>
      )}
    </>
  );
}

export interface GameControllerElement extends HTMLElement {
  actions: number;
  vibrate: boolean;
  leftControl: GameControllerLeftControl;
  hooks: GameControllerHooks;
  readonly updateComplete: Promise<void>;
}

export const GameControllerElement = defineReactElement<GameControllerProps, GameControllerElement>(
  GameController,
  {
    props: {
      actions: "number",
      vibrate: "boolean",
      leftControl: "string",
    },
    objectProps: ["hooks"],
  },
);

defineOnce(TAG, GameControllerElement);
