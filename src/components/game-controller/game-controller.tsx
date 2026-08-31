import { type CSSProperties, type ReactNode, useLayoutEffect, useRef } from "react";
import type { GameControllerActionKey } from "../../events";
import { EVENTS } from "../../events";
import { coerceFeedback, syncFeedbackAttribute } from "../../feedback";
import { parseVibrateAttribute, pulseHaptics } from "../../haptics";
import { coerceKeyboard, installGameControllerKeyboard } from "../../keyboard";
import { resolveComponentCss } from "../../lib/component-css";
import { dispatchComposed } from "../../lib/dispatch-event";
import { DEFAULT_REPEAT_DELAY_MS, DEFAULT_REPEAT_INTERVAL_MS } from "../../lib/immediate-press";
import { defineReactElement } from "../../lib/r2wc-element";
import { getCustomElementHost, isShadowContainer } from "../../lib/shadow-host";
import { unlockScreenOrientation } from "../../orientation";
import { useDoubleTapZoomGuard } from "../../prevent-double-tap-zoom";
import {
  type GameControllerScale,
  parseUsableScreenChromeSource,
  resolveGameControllerScale,
  subscribeUsableScreenScale,
  type UsableScreenChromeSource,
} from "../../usable-screen";
import { GcAncillaryButtons } from "../gc-ancillary-buttons/gc-ancillary-buttons";
import type { GcDpadDirection } from "../gc-dpad/gc-dpad";
import { GcDpad } from "../gc-dpad/gc-dpad";
import { GcFaceButtons } from "../gc-face-buttons/gc-face-buttons";
import { GcJoystick } from "../gc-joystick/gc-joystick";
import styleText from "./game-controller.css?raw";
import {
  type GameControllerActionsCount,
  type GameControllerControlSize,
  type GameControllerLeftControl,
  resolveGameControllerActions,
  resolveGameControllerControlSize,
  resolveGameControllerLeftControl,
} from "./game-controller-layout";
import {
  GAME_CONTROLLER_SLOTS,
  GameControllerActions,
  GameControllerAncillaries,
  GameControllerStage,
  hasAssignedSlot,
  GameControllerLeftControl as LeftControlSlot,
  partitionGameControllerSlots,
} from "./game-controller-slots";

export type {
  GameControllerActionsCount,
  GameControllerControlSize,
  GameControllerLeftControl,
  GameControllerScale,
};
export {
  GAME_CONTROLLER_SLOTS,
  GameControllerActions,
  GameControllerAncillaries,
  GameControllerStage,
  LeftControlSlot as GameControllerLeftControlSlot,
};

const HOST_CLASS = "game-controller";

export type GameControllerHookName =
  | GcDpadDirection
  | GameControllerActionKey
  | "select"
  | "start"
  | "fullscreen";

export type GameControllerHooks = Partial<
  Record<GameControllerHookName, (controller: HTMLElement) => void>
>;

export type GameControllerProps = {
  actions?: GameControllerActionsCount;
  vibrate?: boolean | string;
  /** Visual press feedback on buttons, d-pad, and stick (default on). Off: `feedback="false"`. */
  feedback?: boolean | string;
  leftControl?: GameControllerLeftControl;
  /** `"usable"` (default) fits the remaining visual viewport after header/footer chrome. */
  scale?: GameControllerScale;
  /** `"auto"` (default) picks small / normal / large from the short viewport axis. */
  size?: GameControllerControlSize;
  /** Keyboard mapper (default on). Off: `keyboard="false"`. */
  keyboard?: boolean | string;
  /** D-pad hold-to-repeat (default on). Off: `repeat="false"`. */
  repeat?: boolean | string;
  /** Ms before the first extra d-pad fire (default 400). */
  repeatDelay?: number | string;
  /** Ms between extra d-pad fires (default 80). */
  repeatInterval?: number | string;
  /** Header menu: selector, `48` / `48px`, or an element outside the controller. */
  chromeHeader?: UsableScreenChromeSource;
  /** Footer menu: selector, pixel size, or element. */
  chromeFooter?: UsableScreenChromeSource;
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

function eventRepeat(event: Event): boolean {
  return Boolean((event as CustomEvent<{ repeat?: boolean }>).detail?.repeat);
}

function NamedRegion({
  name,
  inShadow,
  assigned,
  fallback,
}: {
  name: string;
  inShadow: boolean;
  assigned: ReactNode[];
  fallback: ReactNode;
}) {
  if (inShadow) {
    return <slot name={name}>{fallback}</slot>;
  }
  return <>{hasAssignedSlot(assigned) ? assigned : fallback}</>;
}

function GameControllerView({
  actions = 2,
  vibrate: vibrateProp,
  feedback: feedbackProp,
  leftControl,
  scale,
  size: sizeProp,
  keyboard: keyboardProp,
  repeat: repeatProp,
  repeatDelay: delayProp,
  repeatInterval: intervalProp,
  chromeHeader,
  chromeFooter,
  hooks = {},
  children,
  container,
  className,
  style,
}: GameControllerProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const hooksRef = useRef(hooks);
  hooksRef.current = hooks;

  const inShadow = isShadowContainer(container);
  useDoubleTapZoomGuard(container, rootRef);
  const css = resolveComponentCss(styleText, HOST_CLASS, inShadow);
  const vibrate = coerceVibrate(vibrateProp);
  const feedback = coerceFeedback(feedbackProp);
  const keyboard = coerceKeyboard(keyboardProp);
  const dpadRepeat = coerceRepeat(repeatProp);
  const repeatDelay = coerceMs(delayProp, DEFAULT_REPEAT_DELAY_MS);
  const repeatInterval = coerceMs(intervalProp, DEFAULT_REPEAT_INTERVAL_MS);
  const leftStickMode = resolveGameControllerLeftControl(leftControl);
  const controlSize = resolveGameControllerControlSize(sizeProp);
  const faceCount = resolveGameControllerActions(actions);
  const slots = partitionGameControllerSlots(children);

  useLayoutEffect(() => {
    const controller = getCustomElementHost(container, rootRef.current) ?? rootRef.current;
    if (!controller) return;

    const named = (refName: GameControllerHookName, eventName: string, repeat = false) => {
      if (!repeat) pulseHaptics(vibrate);
      hooksRef.current[refName]?.(controller);
      dispatchComposed(controller, eventName, { controller, repeat });
    };

    const toggleFullscreen = async () => {
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

    const onDpad = (direction: GcDpadDirection) => (event: Event) => {
      named(direction, EVENTS.gameController.dpad[direction], eventRepeat(event));
    };
    const onDpadReleased = (direction: GcDpadDirection) => () => {
      dispatchComposed(controller, EVENTS.gameController.dpadReleased[direction], {
        controller,
        direction,
      });
    };
    const onFace = (button: GameControllerActionKey) => (event: Event) => {
      named(button, EVENTS.gameController.action[button], eventRepeat(event));
    };
    const onFaceReleased = (button: GameControllerActionKey) => () => {
      dispatchComposed(controller, EVENTS.gameController.actionReleased[button], {
        controller,
        button,
      });
    };
    const onAncillaryFullscreen = (event: Event) => {
      named("fullscreen", EVENTS.gameController.ancillary.fullscreen, eventRepeat(event));
      void toggleFullscreen();
    };
    const onAncillaryFullscreenReleased = () => {
      dispatchComposed(controller, EVENTS.gameController.ancillaryReleased.fullscreen, {
        controller,
        id: "fullscreen",
      });
    };
    const onSelect = (event: Event) => {
      named("select", EVENTS.gameController.ancillary.select, eventRepeat(event));
    };
    const onSelectReleased = () => {
      dispatchComposed(controller, EVENTS.gameController.ancillaryReleased.select, {
        controller,
        id: "select",
      });
    };
    const onStart = (event: Event) => {
      named("start", EVENTS.gameController.ancillary.start, eventRepeat(event));
    };
    const onStartReleased = () => {
      dispatchComposed(controller, EVENTS.gameController.ancillaryReleased.start, {
        controller,
        id: "start",
      });
    };
    const onPulse = () => pulseHaptics(vibrate);

    const bindings: Array<[string, EventListener]> = [
      [EVENTS.gcDpad.up, onDpad("up")],
      [EVENTS.gcDpad.down, onDpad("down")],
      [EVENTS.gcDpad.left, onDpad("left")],
      [EVENTS.gcDpad.right, onDpad("right")],
      [EVENTS.gcDpadReleased.up, onDpadReleased("up")],
      [EVENTS.gcDpadReleased.down, onDpadReleased("down")],
      [EVENTS.gcDpadReleased.left, onDpadReleased("left")],
      [EVENTS.gcDpadReleased.right, onDpadReleased("right")],
      [EVENTS.gcFace.a, onFace("a")],
      [EVENTS.gcFace.b, onFace("b")],
      [EVENTS.gcFace.x, onFace("x")],
      [EVENTS.gcFace.y, onFace("y")],
      [EVENTS.gcFaceReleased.a, onFaceReleased("a")],
      [EVENTS.gcFaceReleased.b, onFaceReleased("b")],
      [EVENTS.gcFaceReleased.x, onFaceReleased("x")],
      [EVENTS.gcFaceReleased.y, onFaceReleased("y")],
      [EVENTS.gcAncillary.fullscreen, onAncillaryFullscreen],
      [EVENTS.gcAncillary.select, onSelect],
      [EVENTS.gcAncillary.start, onStart],
      [EVENTS.gcAncillaryReleased.fullscreen, onAncillaryFullscreenReleased],
      [EVENTS.gcAncillaryReleased.select, onSelectReleased],
      [EVENTS.gcAncillaryReleased.start, onStartReleased],
      [EVENTS.gcJoystick.pointerDown, onPulse],
      ...Object.values(EVENTS.gcJoystick.cardinal).map((type): [string, EventListener] => [
        type,
        onPulse,
      ]),
    ];

    for (const [type, listener] of bindings) {
      controller.addEventListener(type, listener);
    }
    return () => {
      for (const [type, listener] of bindings) {
        controller.removeEventListener(type, listener);
      }
    };
  }, [container, vibrate]);

  useLayoutEffect(() => {
    const host = getCustomElementHost(container, rootRef.current) ?? rootRef.current;
    if (!host) return;
    if (!keyboard) return;
    return installGameControllerKeyboard(host, {
      leftControl: leftStickMode,
      repeatDelay,
      repeatInterval,
    });
  }, [container, keyboard, leftStickMode, repeatDelay, repeatInterval]);

  useLayoutEffect(() => {
    const host = getCustomElementHost(container, rootRef.current) ?? rootRef.current;
    if (!host) return;
    if (resolveGameControllerScale(scale) !== "usable") return;
    return subscribeUsableScreenScale(host, {
      header: parseUsableScreenChromeSource(chromeHeader),
      footer: parseUsableScreenChromeSource(chromeFooter),
    });
  }, [container, scale, chromeHeader, chromeFooter]);

  useLayoutEffect(() => {
    const host = getCustomElementHost(container, rootRef.current) ?? rootRef.current;
    if (!host) return;
    syncFeedbackAttribute(host, feedback);
  }, [container, feedback]);

  useLayoutEffect(() => {
    const host = getCustomElementHost(container, rootRef.current) ?? rootRef.current;
    if (!host) return;
    if (controlSize === "auto") {
      host.removeAttribute("data-gc-size");
      return;
    }
    host.setAttribute("data-gc-size", controlSize);
  }, [container, controlSize]);

  const rootClass = [inShadow ? undefined : HOST_CLASS, className].filter(Boolean).join(" ");
  const sizeAttr = controlSize === "auto" ? undefined : controlSize;

  const body = (
    <div className="gamecontroller__shell">
      <div className="gamecontroller__container">
        <div className="gamecontroller__center">
          <div className="gamecontroller__stage">
            <NamedRegion
              name={GAME_CONTROLLER_SLOTS.stage}
              inShadow={inShadow}
              assigned={slots.stage}
              fallback={null}
            />
          </div>
          <div className="gamecontroller__ancillaries">
            <NamedRegion
              name={GAME_CONTROLLER_SLOTS.ancillaries}
              inShadow={inShadow}
              assigned={slots.ancillaries}
              fallback={<GcAncillaryButtons feedback={feedbackProp} />}
            />
          </div>
        </div>
        <div className="gamecontroller__main-controls">
          <div className="gamecontroller__d-pad-container">
            <NamedRegion
              name={GAME_CONTROLLER_SLOTS.leftControl}
              inShadow={inShadow}
              assigned={slots.leftControl}
              fallback={
                leftStickMode === "joystick" ? (
                  <GcJoystick emitCardinal feedback={feedbackProp} />
                ) : (
                  <GcDpad
                    feedback={feedbackProp}
                    repeat={dpadRepeat}
                    repeatDelay={repeatDelay}
                    repeatInterval={repeatInterval}
                  />
                )
              }
            />
          </div>
          <div className="gamecontroller__actions">
            <NamedRegion
              name={GAME_CONTROLLER_SLOTS.actions}
              inShadow={inShadow}
              assigned={slots.actions}
              fallback={<GcFaceButtons actions={faceCount} feedback={feedbackProp} />}
            />
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <style>{css}</style>
      {rootClass ? (
        <div ref={rootRef} className={rootClass} style={style} data-gc-size={sizeAttr}>
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

export const GameController = Object.assign(GameControllerView, {
  Stage: GameControllerStage,
  Ancillaries: GameControllerAncillaries,
  LeftControl: LeftControlSlot,
  Actions: GameControllerActions,
});
GameControllerView.displayName = "GameController";

export interface GameControllerElement extends HTMLElement {
  actions: GameControllerActionsCount;
  vibrate: boolean;
  feedback: boolean;
  keyboard: boolean;
  repeat: boolean;
  repeatDelay: number;
  repeatInterval: number;
  leftControl: GameControllerLeftControl;
  scale: GameControllerScale;
  size: GameControllerControlSize;
  chromeHeader: string;
  chromeFooter: string;
  hooks: GameControllerHooks;
  readonly updateComplete: Promise<void>;
}

export const GameControllerElement = defineReactElement<GameControllerProps, GameControllerElement>(
  GameController,
  {
    props: {
      actions: "number",
      vibrate: "boolean",
      feedback: "boolean",
      keyboard: "boolean",
      repeat: "boolean",
      repeatDelay: "number",
      repeatInterval: "number",
      leftControl: "string",
      scale: "string",
      size: "string",
      chromeHeader: "string",
      chromeFooter: "string",
    },
    objectProps: ["hooks"],
    emptyBooleanAttributes: ["keyboard", "repeat"],
  },
);
