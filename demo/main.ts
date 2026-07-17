import "../src/index";
import type {
  GameControllerElement,
  GameControllerLeftControl,
} from "../src/components/game-controller/game-controller";
import {
  applyDemoLayout,
  type DemoLayoutState,
  type DemoPresetId,
  demoLayoutFromPreset,
  matchDemoPreset,
} from "./demo-layout";

const controller = document.querySelector("#controller") as GameControllerElement | null;
const presetEl = document.querySelector("#preset") as HTMLSelectElement | null;
const leftControlEl = document.querySelector("#left-control") as HTMLSelectElement | null;
const actionsEl = document.querySelector("#actions") as HTMLSelectElement | null;
const vibrateEl = document.querySelector("#vibrate") as HTMLInputElement | null;

function readUiState(): DemoLayoutState {
  return {
    leftControl: leftControlEl?.value === "joystick" ? "joystick" : "dpad",
    actions: actionsEl?.value === "4" ? 4 : 2,
    vibrate: vibrateEl?.checked ?? true,
  };
}

function writeUiState(state: DemoLayoutState, preset?: DemoPresetId | "custom") {
  if (leftControlEl) leftControlEl.value = state.leftControl;
  if (actionsEl) actionsEl.value = String(state.actions);
  if (vibrateEl) vibrateEl.checked = state.vibrate;
  if (presetEl && preset) presetEl.value = preset;
}

function syncControllerFromUi() {
  if (!controller) return;
  const state = readUiState();
  applyDemoLayout(controller, state);
  const matched = matchDemoPreset(state);
  if (presetEl && matched) presetEl.value = matched;
}

function applyPreset(id: DemoPresetId) {
  if (!controller) return;
  const next = demoLayoutFromPreset(id, vibrateEl?.checked ?? true);
  writeUiState(next, id);
  applyDemoLayout(controller, next);
}

presetEl?.addEventListener("change", () => {
  const value = presetEl.value as DemoPresetId;
  if (value === "classic" || value === "action" || value === "analog" || value === "stick-ab") {
    applyPreset(value);
  }
});

leftControlEl?.addEventListener("change", syncControllerFromUi);
actionsEl?.addEventListener("change", syncControllerFromUi);
vibrateEl?.addEventListener("change", syncControllerFromUi);

// Keep selects aligned with the initial markup / host attributes.
if (controller) {
  const initial: DemoLayoutState = {
    leftControl: (controller.leftControl === "joystick"
      ? "joystick"
      : "dpad") as GameControllerLeftControl,
    actions: controller.actions === 4 ? 4 : 2,
    vibrate: controller.vibrate,
  };
  writeUiState(initial, matchDemoPreset(initial) ?? "classic");
  applyDemoLayout(controller, initial);
}
