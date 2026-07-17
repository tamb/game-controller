import type {
  GameControllerElement,
  GameControllerLeftControl,
} from "../src/components/game-controller/game-controller";

export type DemoPresetId = "classic" | "action" | "analog" | "stick-ab";

export type DemoLayoutState = {
  leftControl: GameControllerLeftControl;
  actions: 2 | 4;
  vibrate: boolean;
};

/** Named layout presets shown on the demo stage screen. */
export function demoLayoutFromPreset(preset: DemoPresetId, vibrate: boolean): DemoLayoutState {
  switch (preset) {
    case "action":
      return { leftControl: "dpad", actions: 4, vibrate };
    case "analog":
      return { leftControl: "joystick", actions: 4, vibrate };
    case "stick-ab":
      return { leftControl: "joystick", actions: 2, vibrate };
    default:
      return { leftControl: "dpad", actions: 2, vibrate };
  }
}

/** Returns the matching preset id when the state lines up with a named layout. */
export function matchDemoPreset(
  state: Pick<DemoLayoutState, "leftControl" | "actions">,
): DemoPresetId | null {
  if (state.leftControl === "dpad" && state.actions === 2) return "classic";
  if (state.leftControl === "dpad" && state.actions === 4) return "action";
  if (state.leftControl === "joystick" && state.actions === 4) return "analog";
  if (state.leftControl === "joystick" && state.actions === 2) return "stick-ab";
  return null;
}

export function applyDemoLayout(controller: GameControllerElement, state: DemoLayoutState): void {
  controller.leftControl = state.leftControl;
  controller.actions = state.actions;
  controller.vibrate = state.vibrate;
}
