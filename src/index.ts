import "./components/gc-ancillary-buttons/gc-ancillary-buttons";
import "./components/gc-dpad/gc-dpad";
import "./components/gc-face-buttons/gc-face-buttons";
import "./components/gc-joystick/gc-joystick";

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

import { GameControllerElement } from "./components/game-controller/game-controller";
import type { GcAncillaryButtonsElement } from "./components/gc-ancillary-buttons/gc-ancillary-buttons";
import type { GcDpadElement } from "./components/gc-dpad/gc-dpad";
import type { GcFaceButtonsElement } from "./components/gc-face-buttons/gc-face-buttons";
import type { GcJoystickElement } from "./components/gc-joystick/gc-joystick";

export type {
  GameControllerHooks,
  GameControllerLeftControl,
} from "./components/game-controller/game-controller";
export type {
  GcAncillaryId,
  GcAncillaryPressDetail,
} from "./components/gc-ancillary-buttons/gc-ancillary-buttons";
export { GcAncillaryButtonsElement } from "./components/gc-ancillary-buttons/gc-ancillary-buttons";
export type { GcDpadDirection, GcDpadPressDetail } from "./components/gc-dpad/gc-dpad";
export { GcDpadElement } from "./components/gc-dpad/gc-dpad";
export type { GcFacePressDetail } from "./components/gc-face-buttons/gc-face-buttons";
export { GcFaceButtonsElement } from "./components/gc-face-buttons/gc-face-buttons";
export type {
  GcJoystickCardinal,
  GcJoystickMoveDetail,
  JoystickSector,
} from "./components/gc-joystick/gc-joystick";
export {
  DEFAULT_JOYSTICK_SECTORS,
  GcJoystickElement,
} from "./components/gc-joystick/gc-joystick";
export { GameControllerElement };

declare global {
  interface HTMLElementTagNameMap {
    "gc-ancillary-buttons": GcAncillaryButtonsElement;
    "gc-dpad": GcDpadElement;
    "gc-face-buttons": GcFaceButtonsElement;
    "gc-joystick": GcJoystickElement;
    "game-controller": GameControllerElement;
  }
}

const TAG = "game-controller";

if (!customElements.get(TAG)) {
  customElements.define(TAG, GameControllerElement);
}

export default GameControllerElement;
