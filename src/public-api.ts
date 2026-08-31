export type { DemoCapabilityStatus } from "./capabilities";
export {
  getDemoCapabilityStatus,
  isFullscreenSupported,
  isHapticsSupported,
} from "./capabilities";
export type {
  GameControllerActionsCount,
  GameControllerControlSize,
  GameControllerHookName,
  GameControllerHooks,
  GameControllerLeftControl,
  GameControllerProps,
  GameControllerScale,
} from "./components/game-controller/game-controller";
export {
  GAME_CONTROLLER_SLOTS,
  GameController,
  GameControllerActions,
  GameControllerAncillaries,
  GameControllerElement,
  GameControllerLeftControlSlot,
  GameControllerStage,
} from "./components/game-controller/game-controller";
export type {
  GcAncillaryButtonsProps,
  GcAncillaryId,
  GcAncillaryPressDetail,
} from "./components/gc-ancillary-buttons/gc-ancillary-buttons";
export {
  GcAncillaryButtons,
  GcAncillaryButtonsElement,
} from "./components/gc-ancillary-buttons/gc-ancillary-buttons";
export type { GcDpadDirection, GcDpadPressDetail, GcDpadProps } from "./components/gc-dpad/gc-dpad";
export { GcDpad, GcDpadElement } from "./components/gc-dpad/gc-dpad";
export type {
  GcFaceButtonsProps,
  GcFacePressDetail,
} from "./components/gc-face-buttons/gc-face-buttons";
export { GcFaceButtons, GcFaceButtonsElement } from "./components/gc-face-buttons/gc-face-buttons";
export type {
  GcJoystickCardinal,
  GcJoystickMoveDetail,
  GcJoystickProps,
  JoystickSector,
} from "./components/gc-joystick/gc-joystick";
export {
  DEFAULT_JOYSTICK_SECTORS,
  GcJoystick,
  GcJoystickElement,
} from "./components/gc-joystick/gc-joystick";
export type { GameControllerActionKey } from "./events";
export {
  EVENTS,
  gcJoystickClockHourEvent,
  SB_GAME_CONTROLLER_EVENTS,
  SB_GC_ANCILLARY_EVENTS,
  SB_GC_DPAD_EVENTS,
  SB_GC_FACE_EVENTS,
  SB_GC_JOYSTICK_EVENTS,
} from "./events";
export type {
  GameControllerKeyAction,
  GameControllerKeyboardMap,
  GameControllerKeyboardOptions,
} from "./keyboard";
export {
  DEFAULT_GAME_CONTROLLER_KEYMAP,
  installGameControllerKeyboard,
  isEditableKeyboardTarget,
} from "./keyboard";
export {
  DEFAULT_REPEAT_DELAY_MS,
  DEFAULT_REPEAT_INTERVAL_MS,
  IMMEDIATE_PRESS_CLICK_WINDOW_MS,
} from "./lib/immediate-press";
export {
  DOUBLE_TAP_ZOOM_WINDOW_MS,
  installDoubleTapZoomGuard,
  shouldPreventDoubleTapZoom,
} from "./prevent-double-tap-zoom";
export type {
  MeasureUsableScreenOptions,
  UsableScreenChromeSource,
  UsableScreenInsets,
  UsableScreenSize,
  UsableScreenViewport,
} from "./usable-screen";
export {
  applyUsableScreenScale,
  clearUsableScreenScale,
  computeUsableScreen,
  GC_USABLE_SCREEN_VARS,
  measureUsableScreen,
  parseUsableScreenChromeSource,
  readVisualViewportSize,
  resolveGameControllerScale,
  subscribeUsableScreenScale,
} from "./usable-screen";

import type { GameControllerElement } from "./components/game-controller/game-controller";
import { GameControllerElement as GameControllerCtor } from "./components/game-controller/game-controller";
import type { GcAncillaryButtonsElement } from "./components/gc-ancillary-buttons/gc-ancillary-buttons";
import type { GcDpadElement } from "./components/gc-dpad/gc-dpad";
import type { GcFaceButtonsElement } from "./components/gc-face-buttons/gc-face-buttons";
import type { GcJoystickElement } from "./components/gc-joystick/gc-joystick";

declare global {
  interface HTMLElementTagNameMap {
    "gc-ancillary-buttons": GcAncillaryButtonsElement;
    "gc-dpad": GcDpadElement;
    "gc-face-buttons": GcFaceButtonsElement;
    "gc-joystick": GcJoystickElement;
    "game-controller": GameControllerElement;
  }
}

export default GameControllerCtor;
