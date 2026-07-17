import "../src/index";
import type { GameControllerElement } from "../src/components/game-controller/game-controller";
import {
  SB_GAME_CONTROLLER_EVENTS,
  type SbEventLogElement,
} from "../src/components/story-event-log/story-event-log";

const log = document.querySelector("sb-event-log") as SbEventLogElement;
if (log) {
  log.eventNames = SB_GAME_CONTROLLER_EVENTS;
}

const controller = document.querySelector("#controller") as GameControllerElement | null;
const leftControl = document.querySelector("#left-control") as HTMLSelectElement | null;
const vibrate = document.querySelector("#vibrate") as HTMLInputElement | null;

leftControl?.addEventListener("change", () => {
  if (!controller) return;
  controller.leftControl = leftControl.value === "joystick" ? "joystick" : "dpad";
});

vibrate?.addEventListener("change", () => {
  if (!controller) return;
  controller.vibrate = vibrate.checked;
});
