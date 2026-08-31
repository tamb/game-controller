import { describe, expect, it, vi } from "vitest";
import { EVENTS } from "./events";
import {
  DEFAULT_GAME_CONTROLLER_KEYMAP,
  installGameControllerKeyboard,
  isEditableKeyboardTarget,
} from "./keyboard";
import { DEFAULT_REPEAT_DELAY_MS } from "./lib/immediate-press";

function keyEvent(type: "keydown" | "keyup", code: string, extra: KeyboardEventInit = {}) {
  return new KeyboardEvent(type, { code, bubbles: true, cancelable: true, ...extra });
}

describe("isEditableKeyboardTarget", () => {
  it("skips input, textarea, and contenteditable", () => {
    const input = document.createElement("input");
    const area = document.createElement("textarea");
    const div = document.createElement("div");
    div.contentEditable = "true";
    expect(isEditableKeyboardTarget(input)).toBe(true);
    expect(isEditableKeyboardTarget(area)).toBe(true);
    expect(isEditableKeyboardTarget(div)).toBe(true);
    expect(isEditableKeyboardTarget(document.createElement("button"))).toBe(false);
  });
});

describe("installGameControllerKeyboard", () => {
  it("maps arrows to d-pad press and release", () => {
    const host = document.createElement("div");
    document.body.append(host);
    const press = vi.fn();
    const release = vi.fn();
    host.addEventListener(EVENTS.gcDpad.up, press);
    host.addEventListener(EVENTS.gcDpadReleased.up, release);
    const stop = installGameControllerKeyboard(host);

    window.dispatchEvent(keyEvent("keydown", "ArrowUp"));
    expect(press).toHaveBeenCalledTimes(1);
    expect((press.mock.calls[0][0] as CustomEvent).detail.repeat).toBe(false);

    window.dispatchEvent(keyEvent("keyup", "ArrowUp"));
    expect(release).toHaveBeenCalledTimes(1);
    stop();
    host.remove();
  });

  it("ignores OS key repeat and uses delay/interval", () => {
    vi.useFakeTimers();
    const host = document.createElement("div");
    document.body.append(host);
    const press = vi.fn();
    host.addEventListener(EVENTS.gcDpad.left, press);
    const stop = installGameControllerKeyboard(host);

    window.dispatchEvent(keyEvent("keydown", "ArrowLeft"));
    window.dispatchEvent(keyEvent("keydown", "ArrowLeft", { repeat: true }));
    expect(press).toHaveBeenCalledTimes(1);

    vi.advanceTimersByTime(DEFAULT_REPEAT_DELAY_MS);
    expect(press.mock.calls.some((c) => (c[0] as CustomEvent).detail.repeat === true)).toBe(true);

    stop();
    vi.useRealTimers();
    host.remove();
  });

  it("does not fire when typing in an input", () => {
    const host = document.createElement("div");
    const input = document.createElement("input");
    document.body.append(host, input);
    const press = vi.fn();
    host.addEventListener(EVENTS.gcDpad.up, press);
    const stop = installGameControllerKeyboard(host);

    input.dispatchEvent(keyEvent("keydown", "ArrowUp"));
    expect(press).not.toHaveBeenCalled();
    stop();
    host.remove();
    input.remove();
  });

  it("maps K to face A", () => {
    const host = document.createElement("div");
    document.body.append(host);
    const press = vi.fn();
    host.addEventListener(EVENTS.gcFace.a, press);
    const stop = installGameControllerKeyboard(host);
    window.dispatchEvent(keyEvent("keydown", "KeyK"));
    expect(press).toHaveBeenCalledTimes(1);
    stop();
    host.remove();
  });

  it("emits joystick cardinals when leftControl is joystick", () => {
    const host = document.createElement("div");
    document.body.append(host);
    const move = vi.fn();
    const cardinal = vi.fn();
    host.addEventListener(EVENTS.gcJoystick.move, move);
    host.addEventListener(EVENTS.gcJoystick.cardinal.up, cardinal);
    const stop = installGameControllerKeyboard(host, { leftControl: "joystick" });

    window.dispatchEvent(keyEvent("keydown", "KeyW"));
    expect(move).toHaveBeenCalled();
    expect(cardinal).toHaveBeenCalled();

    window.dispatchEvent(keyEvent("keyup", "KeyW"));
    stop();
    host.remove();
  });

  it("documents the default WASD / KJIU map", () => {
    expect(DEFAULT_GAME_CONTROLLER_KEYMAP.KeyW).toEqual({ kind: "dpad", direction: "up" });
    expect(DEFAULT_GAME_CONTROLLER_KEYMAP.KeyK).toEqual({ kind: "face", button: "a" });
    expect(DEFAULT_GAME_CONTROLLER_KEYMAP.Enter).toEqual({ kind: "ancillary", id: "start" });
  });
});
