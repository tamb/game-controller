import { type CSSProperties, type ReactNode, useLayoutEffect, useRef } from "react";
import type { GameControllerActionKey } from "../../events";
import { EVENTS } from "../../events";
import { parseVibrateAttribute, pulseHaptics } from "../../haptics";
import { resolveComponentCss } from "../../lib/component-css";
import { dispatchComposed } from "../../lib/dispatch-event";
import { defineOnce, defineReactElement } from "../../lib/r2wc-element";
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
  type GameControllerControlSize,
  type GameControllerLeftControl,
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

export type { GameControllerControlSize, GameControllerLeftControl, GameControllerScale };
export {
  GAME_CONTROLLER_SLOTS,
  GameControllerActions,
  GameControllerAncillaries,
  GameControllerStage,
  LeftControlSlot as GameControllerLeftControlSlot,
};

const HOST_CLASS = "game-controller";
const TAG = "game-controller";

export type GameControllerHooks = Record<string, (controller: HTMLElement) => void>;

export type GameControllerProps = {
  actions?: number;
  vibrate?: boolean | string;
  leftControl?: string;
  /** `"usable"` (default) fits the remaining visual viewport after header/footer chrome. */
  scale?: string;
  /** `"auto"` (default) picks small / normal / large from the short viewport axis. */
  size?: string;
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
  leftControl,
  scale,
  size: sizeProp,
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
  const leftStickMode = resolveGameControllerLeftControl(leftControl);
  const controlSize = resolveGameControllerControlSize(sizeProp);
  const slots = partitionGameControllerSlots(children);

  useLayoutEffect(() => {
    const controller = getCustomElementHost(container, rootRef.current) ?? rootRef.current;
    if (!controller) return;

    const named = (refName: string, eventName: string) => {
      pulseHaptics(vibrate);
      hooksRef.current[refName]?.(controller);
      dispatchComposed(controller, eventName, { controller });
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

    const onDpad = (direction: GcDpadDirection) => () => {
      named(direction, EVENTS.gameController.dpad[direction]);
    };
    const onFace = (button: GameControllerActionKey) => () => {
      named(button, EVENTS.gameController.action[button]);
    };
    const onAncillaryFullscreen = () => {
      named("fullscreen", EVENTS.gameController.ancillary.fullscreen);
      void toggleFullscreen();
    };
    const onSelect = () => named("select", EVENTS.gameController.ancillary.select);
    const onStart = () => named("start", EVENTS.gameController.ancillary.start);
    const onPulse = () => pulseHaptics(vibrate);

    const bindings: Array<[string, EventListener]> = [
      [EVENTS.gcDpad.up, onDpad("up")],
      [EVENTS.gcDpad.down, onDpad("down")],
      [EVENTS.gcDpad.left, onDpad("left")],
      [EVENTS.gcDpad.right, onDpad("right")],
      [EVENTS.gcFace.a, onFace("a")],
      [EVENTS.gcFace.b, onFace("b")],
      [EVENTS.gcFace.x, onFace("x")],
      [EVENTS.gcFace.y, onFace("y")],
      [EVENTS.gcAncillary.fullscreen, onAncillaryFullscreen],
      [EVENTS.gcAncillary.select, onSelect],
      [EVENTS.gcAncillary.start, onStart],
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
    if (resolveGameControllerScale(scale) !== "usable") return;
    return subscribeUsableScreenScale(host, {
      header: parseUsableScreenChromeSource(chromeHeader),
      footer: parseUsableScreenChromeSource(chromeFooter),
    });
  }, [container, scale, chromeHeader, chromeFooter]);

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
              fallback={<GcAncillaryButtons />}
            />
          </div>
        </div>
        <div className="gamecontroller__main-controls">
          <div className="gamecontroller__d-pad-container">
            <NamedRegion
              name={GAME_CONTROLLER_SLOTS.leftControl}
              inShadow={inShadow}
              assigned={slots.leftControl}
              fallback={leftStickMode === "joystick" ? <GcJoystick emitCardinal /> : <GcDpad />}
            />
          </div>
          <div className="gamecontroller__actions">
            <NamedRegion
              name={GAME_CONTROLLER_SLOTS.actions}
              inShadow={inShadow}
              assigned={slots.actions}
              fallback={<GcFaceButtons actions={actions} />}
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
  actions: number;
  vibrate: boolean;
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
      leftControl: "string",
      scale: "string",
      size: "string",
      chromeHeader: "string",
      chromeFooter: "string",
    },
    objectProps: ["hooks"],
  },
);

defineOnce(TAG, GameControllerElement);
