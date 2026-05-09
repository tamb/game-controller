import { beforeEach, describe, expect, it, vi } from "vitest";
import { EVENTS } from "../../events";
import "../../index";
import type { GcDpadElement } from "../gc-dpad/gc-dpad";
import type { GameControllerElement } from "./game-controller";

async function mount(actions = 2) {
  document.body.replaceChildren();
  const el = document.createElement("game-controller") as GameControllerElement;
  el.actions = actions;
  document.body.appendChild(el);
  await el.updateComplete;
  return el;
}

function collectButtons(root: ShadowRoot | null | undefined, acc: HTMLButtonElement[]) {
  if (!root) return;
  for (const node of root.querySelectorAll("*")) {
    if (node instanceof HTMLButtonElement) acc.push(node);
    if (node.shadowRoot) collectButtons(node.shadowRoot, acc);
  }
}

function buttonByText(host: HTMLElement, label: string): HTMLButtonElement {
  const acc: HTMLButtonElement[] = [];
  collectButtons(host.shadowRoot, acc);
  const btn = acc.find((b) => b.textContent?.trim() === label);
  if (!btn) throw new Error(`Button not found: ${label}`);
  return btn;
}

describe("GameControllerElement", () => {
  beforeEach(() => {
    document.body.replaceChildren();
    vi.restoreAllMocks();
    Reflect.deleteProperty(navigator as unknown as object, "vibrate");
  });

  it("defines the game-controller tag", () => {
    expect(customElements.get("game-controller")).toBeDefined();
  });

  it("renders slotted stage content in the stage slot", async () => {
    document.body.replaceChildren();
    const el = document.createElement("game-controller") as GameControllerElement;
    const marker = document.createElement("div");
    marker.slot = "stage";
    marker.textContent = "stage-content";
    el.appendChild(marker);
    document.body.appendChild(el);
    await el.updateComplete;
    const slot = el.shadowRoot?.querySelector('slot[name="stage"]') as HTMLSlotElement | undefined;
    expect(slot?.assignedElements()[0]).toBe(marker);
  });

  it("renders shadow DOM controls", async () => {
    const el = await mount();
    expect(el.shadowRoot?.querySelector(".gamecontroller__stage")).toBeTruthy();
    expect(buttonByText(el, "select")).toBeTruthy();
    expect(buttonByText(el, "start")).toBeTruthy();
  });

  it("bubbles nested gcdpad presses as gcdpad:* to document", async () => {
    const el = await mount();
    const spy = vi.fn();
    document.addEventListener(EVENTS.gcDpad.up, spy);

    const dpad = el.shadowRoot?.querySelector("gc-dpad") as GcDpadElement;
    const upBtn = dpad.shadowRoot?.querySelector(".gcdpad__btn--up") as HTMLButtonElement;
    upBtn.click();

    expect(spy).toHaveBeenCalledTimes(1);
    document.removeEventListener(EVENTS.gcDpad.up, spy);
  });

  it("renders gc-joystick instead of gc-dpad when leftControl is joystick", async () => {
    const el = await mount();
    el.leftControl = "joystick";
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector("gc-joystick")).toBeTruthy();
    expect(el.shadowRoot?.querySelector("gc-dpad")).toBeNull();
  });

  it("falls back to d-pad for unknown left-control attribute values", async () => {
    const el = await mount();
    el.setAttribute("left-control", "trackball");
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector("gc-dpad")).toBeTruthy();
    expect(el.shadowRoot?.querySelector("gc-joystick")).toBeNull();
  });

  it("forwards nested gcdpad presses as gamecontroller:dpad:*", async () => {
    const el = await mount();
    const spy = vi.fn();
    document.addEventListener(EVENTS.gameController.dpad.up, spy);

    const dpad = el.shadowRoot?.querySelector("gc-dpad") as GcDpadElement;
    const upBtn = dpad.shadowRoot?.querySelector(".gcdpad__btn--up") as HTMLButtonElement;
    upBtn.click();

    expect(spy).toHaveBeenCalledTimes(1);
    document.removeEventListener(EVENTS.gameController.dpad.up, spy);
  });

  it("dispatches composed ancillary events with controller in detail", async () => {
    const el = await mount();
    const spy = vi.fn();
    document.addEventListener(EVENTS.gameController.ancillary.select, spy);

    buttonByText(el, "select").click();

    expect(spy).toHaveBeenCalledTimes(1);
    const evt = spy.mock.calls[0][0] as CustomEvent<{ controller: HTMLElement }>;
    expect(evt.detail.controller).toBe(el);
    expect(evt.bubbles).toBe(true);
    expect(evt.composed).toBe(true);
    document.removeEventListener(EVENTS.gameController.ancillary.select, spy);
  });

  it("invokes hooks before emitting", async () => {
    const el = await mount();
    const hook = vi.fn();
    el.hooks = { select: hook };
    await el.updateComplete;

    const spy = vi.fn();
    el.addEventListener(EVENTS.gameController.ancillary.select, spy);

    buttonByText(el, "select").click();

    expect(hook).toHaveBeenCalledWith(el);
    expect(spy).toHaveBeenCalled();
    expect(hook.mock.invocationCallOrder[0]).toBeLessThan(spy.mock.invocationCallOrder[0]);
  });

  it("fires action:a in two-button layout", async () => {
    const el = await mount(2);
    const spy = vi.fn();
    document.addEventListener(EVENTS.gameController.action.a, spy);

    buttonByText(el, "A").click();

    expect(spy).toHaveBeenCalledTimes(1);
    document.removeEventListener(EVENTS.gameController.action.a, spy);
  });

  it("bubbles nested gcancillary:* to document", async () => {
    const el = await mount();
    const spy = vi.fn();
    document.addEventListener(EVENTS.gcAncillary.start, spy);

    buttonByText(el, "start").click();

    expect(spy).toHaveBeenCalledTimes(1);
    document.removeEventListener(EVENTS.gcAncillary.start, spy);
  });

  it("bubbles nested gcface:* to document", async () => {
    const el = await mount(2);
    const spy = vi.fn();
    document.addEventListener(EVENTS.gcFace.b, spy);

    buttonByText(el, "B").click();

    expect(spy).toHaveBeenCalledTimes(1);
    document.removeEventListener(EVENTS.gcFace.b, spy);
  });

  it("calls requestFullscreen when fullscreen ancillary fires", async () => {
    const el = await mount();
    const reqFs = vi.fn(() => Promise.resolve());
    el.requestFullscreen = reqFs as typeof el.requestFullscreen;

    buttonByText(el, "fullscreen").click();

    expect(reqFs).toHaveBeenCalledTimes(1);
  });

  it("fires action:y in four-button layout", async () => {
    const el = await mount(4);
    const spy = vi.fn();
    document.addEventListener(EVENTS.gameController.action.y, spy);

    buttonByText(el, "Y").click();

    expect(spy).toHaveBeenCalledTimes(1);
    document.removeEventListener(EVENTS.gameController.action.y, spy);
  });

  it("calls navigator.vibrate when vibrate is true", async () => {
    const vibrate = vi.fn(() => true as boolean);
    Object.defineProperty(navigator, "vibrate", {
      configurable: true,
      writable: true,
      value: vibrate,
    });

    const el = await mount();
    el.vibrate = true;
    await el.updateComplete;

    buttonByText(el, "A").click();

    expect(vibrate).toHaveBeenCalledWith(10);
  });

  it("skips navigator.vibrate when vibrate is false", async () => {
    const vibrate = vi.fn(() => true as boolean);
    Object.defineProperty(navigator, "vibrate", {
      configurable: true,
      writable: true,
      value: vibrate,
    });

    const el = await mount();
    el.vibrate = false;
    await el.updateComplete;

    buttonByText(el, "A").click();

    expect(vibrate).not.toHaveBeenCalled();
  });
});
