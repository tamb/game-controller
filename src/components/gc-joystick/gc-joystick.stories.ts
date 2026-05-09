import type { Meta, StoryObj } from "@storybook/web-components-vite";
import { html } from "lit";
import { EVENTS } from "../../events";
import "../../index";
import "../story-event-log/story-event-log";
import { SB_GC_JOYSTICK_EVENTS } from "../story-event-log/story-event-log";

const meta = {
  title: "GC / Joystick",
  component: "gc-joystick",
  parameters: {
    docs: {
      description: {
        component:
          "Drag the knob. Move events use **`EVENTS.gcJoystick.move`** (shown here as `gcjoystick:move`). Enable **`emit-cardinal`**, **`emit-sectors`**, and **`emit-clock`** for edge-triggered helpers.",
      },
    },
  },
} satisfies Meta;

export default meta;

export const MoveOnly: StoryObj = {
  name: "Move only (default)",
  render: () =>
    html`<sb-event-log heading="${EVENTS.gcJoystick.move}" .eventNames=${[EVENTS.gcJoystick.move]}>
      <gc-joystick></gc-joystick>
    </sb-event-log>`,
};

export const AllOptionalChannels: StoryObj = {
  name: "Cardinal + sectors + clock",
  render: () =>
    html`<sb-event-log heading="All gcjoystick channels" .eventNames=${SB_GC_JOYSTICK_EVENTS}>
      <gc-joystick emit-cardinal emit-sectors emit-clock></gc-joystick>
    </sb-event-log>`,
};

const CUSTOM_SECTORS_JSON = JSON.stringify([
  { id: "forward", startDeg: 300, endDeg: 60 },
  { id: "backward", startDeg: 120, endDeg: 240 },
]);

export const CustomSectorsJson: StoryObj = {
  name: "Custom sectors-json",
  render: () =>
    html`<sb-event-log heading="gcjoystick:* (custom sectors)" .eventNames=${SB_GC_JOYSTICK_EVENTS}>
      <gc-joystick emit-sectors .sectorsJson=${CUSTOM_SECTORS_JSON}></gc-joystick>
    </sb-event-log>`,
};
