import type { Meta, StoryObj } from "@storybook/web-components-vite";
import { EVENTS } from "../../events";
import "../../index";
import { createEl } from "../../storybook/create-el";
import "../story-event-log/story-event-log";
import type { SbEventLogElement } from "../story-event-log/story-event-log";
import { SB_GC_JOYSTICK_EVENTS } from "../story-event-log/story-event-log";
import type { GcJoystickElement } from "./gc-joystick";

const meta = {
  title: "GC / Joystick",
  component: "gc-joystick",
  parameters: {
    docs: {
      description: {
        component:
          "React `GcJoystick` / `<gc-joystick>`. Drag the knob. Move events use **`EVENTS.gcJoystick.move`** (shown here as `gcjoystick:move`). Enable **`emit-cardinal`**, **`emit-sectors`**, and **`emit-clock`** for edge-triggered helpers.",
      },
    },
  },
} satisfies Meta;

export default meta;

export const MoveOnly: StoryObj = {
  name: "Move only (default)",
  render: () => {
    const log = createEl<SbEventLogElement>("sb-event-log", {
      heading: EVENTS.gcJoystick.move,
      eventNames: [EVENTS.gcJoystick.move],
    });
    log.append(document.createElement("gc-joystick"));
    return log;
  },
};

export const AllOptionalChannels: StoryObj = {
  name: "Cardinal + sectors + clock",
  render: () => {
    const log = createEl<SbEventLogElement>("sb-event-log", {
      heading: "All gcjoystick channels",
      eventNames: SB_GC_JOYSTICK_EVENTS,
    });
    const stick = document.createElement("gc-joystick");
    stick.setAttribute("emit-cardinal", "");
    stick.setAttribute("emit-sectors", "");
    stick.setAttribute("emit-clock", "");
    log.append(stick);
    return log;
  },
};

const CUSTOM_SECTORS_JSON = JSON.stringify([
  { id: "forward", startDeg: 300, endDeg: 60 },
  { id: "backward", startDeg: 120, endDeg: 240 },
]);

export const CustomSectorsJson: StoryObj = {
  name: "Custom sectors-json",
  render: () => {
    const log = createEl<SbEventLogElement>("sb-event-log", {
      heading: "gcjoystick:* (custom sectors)",
      eventNames: SB_GC_JOYSTICK_EVENTS,
    });
    log.append(
      createEl<GcJoystickElement>("gc-joystick", {
        emitSectors: true,
        sectorsJson: CUSTOM_SECTORS_JSON,
      }),
    );
    return log;
  },
};
