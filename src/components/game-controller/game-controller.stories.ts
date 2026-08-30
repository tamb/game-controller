import type { Meta, StoryObj } from "@storybook/web-components-vite";
import "../../index";
import { createEl } from "../../storybook/create-el";
import type { GameControllerElement } from "./game-controller";
import "../story-event-log/story-event-log";
import type { SbEventLogElement } from "../story-event-log/story-event-log";
import { SB_GAME_CONTROLLER_EVENTS } from "../story-event-log/story-event-log";

/** Example palette: set on `<game-controller>` so `:host` tokens pick them up. */
const INDIGO_RETRO_THEME: Readonly<Record<string, string>> = {
  "--gc-shell-bg": "#241b35",
  "--gc-shell-border-width": "3px",
  "--gc-shell-border-style": "solid",
  "--gc-shell-border-color": "#130d1e",
  "--gc-main-controls-bg": "rgba(255, 255, 255, 0.05)",
  "--gc-stage-bg": "#4f7d6a",
  "--gc-stage-border-width": "3px",
  "--gc-stage-border-color": "#0d1f18",
  "--gc-color-text": "#f4ede2",
  "--gc-action-btn-bg": "#c94c6b",
  "--gc-action-btn-color": "#fff8f0",
  "--gc-action-btn-border-width": "2px",
  "--gc-action-btn-border-color": "#3a1420",
  "--gc-action-btn-1-bg": "#e8b045",
  "--gc-action-btn-2-bg": "#5da0e6",
  "--gc-action-btn-3-bg": "#d94f6f",
  "--gc-action-btn-4-bg": "#7bcb8f",
  "--gc-dpad-btn-bg": "#2a2238",
  "--gc-dpad-btn-border-color": "#100818",
  "--gc-ancillary-btn-bg": "#3d2f55",
  "--gc-ancillary-btn-color": "#f0e8ff",
  "--gc-ancillary-btn-border-color": "#1a1226",
  "--gc-focus-ring-color": "#7ec8ff",
};

type StoryArgs = {
  actions: number;
  vibrate: boolean;
  leftControl: "dpad" | "joystick";
};

function stageEventLog(): SbEventLogElement {
  const log = createEl<SbEventLogElement>("sb-event-log", {
    heading: "Emitted events",
    eventNames: SB_GAME_CONTROLLER_EVENTS,
  });
  log.setAttribute("embed-stage", "");
  log.slot = "stage";
  return log;
}

function controller(args: StoryArgs, extras?: { theme?: Readonly<Record<string, string>> }) {
  const el = createEl<GameControllerElement>("game-controller", {
    actions: args.actions,
    vibrate: args.vibrate,
    leftControl: args.leftControl,
  });
  if (extras?.theme) {
    for (const [name, value] of Object.entries(extras.theme)) {
      el.style.setProperty(name, value);
    }
  }
  el.append(stageEventLog());
  return el;
}

const meta = {
  title: "Game controller",
  component: "game-controller",
  parameters: {
    docs: {
      description: {
        component:
          "React `<GameController>` also exported as the `<game-controller>` custom element (via `@r2wc/core`). **Portrait / landscape** follow the viewport: **`@media (orientation: landscape)`** uses flex **`order`** so controls read left-to-right: stick | stage + ancillary | face buttons. Resize the **browser window** or rotate a device to change orientation—the Storybook canvas iframe follows the viewport. Fullscreen also unlocks screen orientation so landscape is allowed. Stories embed a scrollable **event log** in the stage (includes **`gcjoystick:*`** when using the left stick). In **Cycle actions**, press **Space** or **C** while the demo is focused to toggle between 2 and 4 face buttons.",
      },
    },
  },
  args: {
    actions: 2,
    vibrate: true,
    leftControl: "dpad" as const,
  },
  argTypes: {
    actions: {
      control: "select",
      options: [2, 4],
      description: "Face button layout",
    },
    vibrate: {
      control: "boolean",
      description:
        'Haptics: call `navigator.vibrate` on taps, d-pad, ancillaries, joystick grab, and joystick cardinal changes when supported (mobile). Off: `vibrate="false"` or `.vibrate = false`.',
    },
    leftControl: {
      control: "select",
      options: ["dpad", "joystick"],
      description: "Left-hand control (`left-control`)",
    },
  },
  render: (args: StoryArgs) => controller(args),
} satisfies Meta<StoryArgs>;

export default meta;

type Story = StoryObj<StoryArgs>;

export const TwoButtons: Story = {
  name: "Two buttons",
  args: { actions: 2, vibrate: true },
};

export const FourButtons: Story = {
  name: "Four buttons",
  args: { actions: 4, vibrate: true },
};

export const NoVibrate: Story = {
  name: "No vibration",
  args: { actions: 2, vibrate: false, leftControl: "dpad" },
};

export const JoystickLeft: Story = {
  name: "Joystick (left stick)",
  args: { actions: 4, vibrate: true, leftControl: "joystick" },
};

export const CustomGcTheme: Story = {
  name: "Custom colors (--gc-*)",
  args: { actions: 4, vibrate: true },
  render: (args) => controller(args, { theme: INDIGO_RETRO_THEME }),
  parameters: {
    docs: {
      description: {
        story:
          "Sets `--gc-*` tokens on the host. Copy `INDIGO_RETRO_THEME` from `src/components/game-controller/game-controller.stories.ts` or set the same variables in your own CSS.",
      },
    },
  },
};

const CYCLE_TAG = "sb-game-controller-cycle-host";

class CycleDemoHost extends HTMLElement {
  #actions = 2;
  #gc: GameControllerElement | null = null;

  connectedCallback(): void {
    this.tabIndex = 0;
    this.addEventListener("keydown", this.onKeyDown);
    const gc = createEl<GameControllerElement>("game-controller", { actions: this.#actions });
    gc.append(stageEventLog());
    this.replaceChildren(gc);
    this.#gc = gc;
  }

  disconnectedCallback(): void {
    this.removeEventListener("keydown", this.onKeyDown);
    this.#gc = null;
  }

  private readonly onKeyDown = (e: KeyboardEvent) => {
    if (e.code === "Space" || e.code === "KeyC") {
      e.preventDefault();
      this.#actions = this.#actions === 2 ? 4 : 2;
      if (this.#gc) this.#gc.actions = this.#actions;
    }
  };
}

if (!customElements.get(CYCLE_TAG)) {
  customElements.define(CYCLE_TAG, CycleDemoHost);
}

export const CycleActionsOnStageClick: StoryObj = {
  name: "Cycle actions (Space / C)",
  parameters: {
    docs: {
      description: {
        story:
          "Focus the preview (click once), then press **Space** or **C** to alternate `actions` between 2 and 4. Events appear in the embedded stage log.",
      },
    },
  },
  render: () => document.createElement(CYCLE_TAG),
};

export const FillViewport: Story = {
  name: "Fill viewport (no event log)",
  args: { actions: 2, vibrate: true },
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        story:
          "Full canvas height (`100dvh`) with safe-area padding. Use **fullscreen** on the controller for OS fullscreen (`:host(:fullscreen)`).",
      },
    },
  },
  render: (args) =>
    createEl<GameControllerElement>("game-controller", {
      actions: args.actions,
      vibrate: args.vibrate,
      leftControl: args.leftControl,
    }),
};
