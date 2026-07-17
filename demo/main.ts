import "../src/index";
import { getDemoCapabilityStatus } from "../src/capabilities";
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
const supportFullscreenEl = document.querySelector("#support-fullscreen");
const supportHapticsEl = document.querySelector("#support-haptics");
const supportNoteEl = document.querySelector("#support-note");
const vibrateToggle = vibrateEl?.closest(".stage-toggle");

function setSupportValue(el: Element | null, supported: boolean) {
  if (!el) return;
  el.textContent = supported ? "Supported" : "Not available";
  el.setAttribute("data-supported", supported ? "true" : "false");
}

function renderCapabilityStatus() {
  const status = getDemoCapabilityStatus();
  setSupportValue(supportFullscreenEl, status.fullscreen);
  setSupportValue(supportHapticsEl, status.haptics);

  if (vibrateEl) {
    vibrateEl.disabled = !status.haptics;
    if (!status.haptics) vibrateEl.checked = false;
  }
  vibrateToggle?.toggleAttribute("data-unsupported", !status.haptics);

  if (supportNoteEl instanceof HTMLElement) {
    const notes: string[] = [];
    if (!status.fullscreen) {
      notes.push("Fullscreen API is unavailable in this browser (common on iOS Safari).");
    }
    if (!status.haptics) {
      notes.push("Vibration API is unavailable here (typical on desktop).");
    }
    if (notes.length === 0) {
      supportNoteEl.hidden = true;
      supportNoteEl.textContent = "";
    } else {
      supportNoteEl.hidden = false;
      supportNoteEl.textContent = notes.join(" ");
    }
  }

  if (controller && !status.haptics) {
    controller.vibrate = false;
  }
}

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

renderCapabilityStatus();

// Keep selects aligned with the initial markup / host attributes.
if (controller) {
  const caps = getDemoCapabilityStatus();
  const initial: DemoLayoutState = {
    leftControl: (controller.leftControl === "joystick"
      ? "joystick"
      : "dpad") as GameControllerLeftControl,
    actions: controller.actions === 4 ? 4 : 2,
    vibrate: caps.haptics ? controller.vibrate : false,
  };
  writeUiState(initial, matchDemoPreset(initial) ?? "classic");
  applyDemoLayout(controller, initial);
}
