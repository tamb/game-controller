import "../src/index";
import {
  SB_GAME_CONTROLLER_EVENTS,
  type SbEventLogElement,
} from "../src/components/story-event-log/story-event-log";

const log = document.querySelector("sb-event-log") as SbEventLogElement;
if (log) {
  log.eventNames = SB_GAME_CONTROLLER_EVENTS;
}
