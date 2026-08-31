import { GameControllerElement } from "./components/game-controller/game-controller";
import { GcAncillaryButtonsElement } from "./components/gc-ancillary-buttons/gc-ancillary-buttons";
import { GcDpadElement } from "./components/gc-dpad/gc-dpad";
import { GcFaceButtonsElement } from "./components/gc-face-buttons/gc-face-buttons";
import { GcJoystickElement } from "./components/gc-joystick/gc-joystick";
import { defineOnce } from "./lib/r2wc-element";

/** Registers the five public custom elements. Safe to call more than once. */
export function registerGameControllerElements(): void {
  if (typeof customElements === "undefined") return;
  defineOnce("game-controller", GameControllerElement);
  defineOnce("gc-ancillary-buttons", GcAncillaryButtonsElement);
  defineOnce("gc-dpad", GcDpadElement);
  defineOnce("gc-face-buttons", GcFaceButtonsElement);
  defineOnce("gc-joystick", GcJoystickElement);
}

registerGameControllerElements();
