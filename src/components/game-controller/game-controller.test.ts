import { beforeEach, describe, expect, it, vi } from "vitest";
import { EVENTS } from "../../events";
import "../../index";
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

  it("writes usable-screen CSS vars for scale=usable after header/footer chrome", async () => {
    const header = document.createElement("header");
    header.dataset.gcChrome = "header";
    const el = document.createElement("game-controller") as GameControllerElement;
    el.scale = "usable";
    const footer = document.createElement("footer");
    footer.dataset.gcChrome = "footer";
    document.body.append(header, el, footer);

    const stub = (node: Element, top: number, height: number) => {
      Object.defineProperty(node, "getBoundingClientRect", {
        configurable: true,
        value: () => ({
          top,
          left: 0,
          width: 360,
          height,
          right: 360,
          bottom: top + height,
          x: 0,
          y: top,
          toJSON() {
            return this;
          },
        }),
      });
    };
    stub(header, 0, 50);
    stub(el, 50, 700);
    stub(footer, 750, 50);

    await el.updateComplete;
    window.dispatchEvent(new Event("resize"));
    await el.updateComplete;

    expect(el.style.getPropertyValue("--gc-usable-height")).toMatch(/px$/);
    expect(el.style.getPropertyValue("--gc-chrome-top")).toMatch(/px$/);
    expect(el.scale).toBe("usable");
  });

  it("does not write usable-screen vars when scale is none", async () => {
    const el = document.createElement("game-controller") as GameControllerElement;
    el.scale = "none";
    document.body.appendChild(el);
    await el.updateComplete;
    expect(el.style.getPropertyValue("--gc-usable-height")).toBe("");
    expect(el.scale).toBe("none");
  });

  it("locks data-gc-size when size is small and clears it for auto", async () => {
    const el = document.createElement("game-controller") as GameControllerElement;
    document.body.appendChild(el);
    await el.updateComplete;
    expect(el.getAttribute("data-gc-size")).toBeNull();

    el.size = "small";
    await el.updateComplete;
    expect(el.getAttribute("data-gc-size")).toBe("small");

    el.size = "auto";
    await el.updateComplete;
    expect(el.getAttribute("data-gc-size")).toBeNull();
  });

  it("projects custom named slots and keeps defaults when empty", async () => {
    const el = document.createElement("game-controller") as GameControllerElement;
    const stick = document.createElement("gc-joystick");
    stick.slot = "left-control";
    const faces = document.createElement("div");
    faces.slot = "actions";
    faces.textContent = "custom-faces";
    el.append(stick, faces);
    document.body.appendChild(el);
    await el.updateComplete;

    const left = el.shadowRoot?.querySelector('slot[name="left-control"]') as
      | HTMLSlotElement
      | undefined;
    const actions = el.shadowRoot?.querySelector('slot[name="actions"]') as
      | HTMLSlotElement
      | undefined;
    const ancillaries = el.shadowRoot?.querySelector('slot[name="ancillaries"]') as
      | HTMLSlotElement
      | undefined;
    expect(left?.assignedElements()[0]).toBe(stick);
    expect(actions?.assignedElements()[0]).toBe(faces);
    expect(ancillaries?.assignedElements()).toEqual([]);
    expect(el.shadowRoot?.querySelector(".gcancillary")).toBeTruthy();
  });

  it("forwards gamecontroller:dpad:* from a slotted gc-dpad", async () => {
    const el = document.createElement("game-controller") as GameControllerElement;
    const dpad = document.createElement("gc-dpad");
    dpad.slot = "left-control";
    el.append(dpad);
    document.body.appendChild(el);
    await el.updateComplete;
    await dpad.updateComplete;

    const spy = vi.fn();
    document.addEventListener(EVENTS.gameController.dpad.up, spy);
    const upBtn = dpad.shadowRoot?.querySelector(".gcdpad__btn--up") as HTMLButtonElement;
    upBtn.click();
    expect(spy).toHaveBeenCalledTimes(1);
    document.removeEventListener(EVENTS.gameController.dpad.up, spy);
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

    const upBtn = el.shadowRoot?.querySelector(".gcdpad__btn--up") as HTMLButtonElement;
    upBtn.click();

    expect(spy).toHaveBeenCalledTimes(1);
    document.removeEventListener(EVENTS.gcDpad.up, spy);
  });

  it("renders gc-joystick instead of gc-dpad when leftControl is joystick", async () => {
    const el = await mount();
    el.leftControl = "joystick";
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".gcjoystick")).toBeTruthy();
    expect(el.shadowRoot?.querySelector(".gcdpad")).toBeNull();
  });

  it("falls back to d-pad for unknown left-control attribute values", async () => {
    const el = await mount();
    el.setAttribute("left-control", "trackball");
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".gcdpad")).toBeTruthy();
    expect(el.shadowRoot?.querySelector(".gcjoystick")).toBeNull();
  });

  it("forwards nested gcdpad presses as gamecontroller:dpad:*", async () => {
    const el = await mount();
    const spy = vi.fn();
    document.addEventListener(EVENTS.gameController.dpad.up, spy);

    const upBtn = el.shadowRoot?.querySelector(".gcdpad__btn--up") as HTMLButtonElement;
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

  it("parses vibrate=false attribute as haptics off", async () => {
    const el = document.createElement("game-controller") as GameControllerElement;
    el.setAttribute("vibrate", "false");
    document.body.appendChild(el);
    await el.updateComplete;
    expect(el.vibrate).toBe(false);
  });

  it("parses vibrate=0 and vibrate=off as haptics off", async () => {
    const zero = document.createElement("game-controller") as GameControllerElement;
    zero.setAttribute("vibrate", "0");
    document.body.appendChild(zero);
    await zero.updateComplete;
    expect(zero.vibrate).toBe(false);

    const off = document.createElement("game-controller") as GameControllerElement;
    off.setAttribute("vibrate", "off");
    document.body.appendChild(off);
    await off.updateComplete;
    expect(off.vibrate).toBe(false);
  });

  it("syncs data-gc-feedback when feedback is disabled", async () => {
    const el = document.createElement("game-controller") as GameControllerElement;
    document.body.appendChild(el);
    await el.updateComplete;
    expect(el.hasAttribute("data-gc-feedback")).toBe(false);

    el.feedback = false;
    await el.updateComplete;
    expect(el.getAttribute("data-gc-feedback")).toBe("off");
  });

  it("parses feedback=0 and feedback=off attributes as visual feedback off", async () => {
    const zero = document.createElement("game-controller") as GameControllerElement;
    zero.setAttribute("feedback", "0");
    document.body.appendChild(zero);
    await zero.updateComplete;
    expect(zero.feedback).toBe(false);
    expect(zero.getAttribute("data-gc-feedback")).toBe("off");

    const off = document.createElement("game-controller") as GameControllerElement;
    off.setAttribute("feedback", "off");
    document.body.appendChild(off);
    await off.updateComplete;
    expect(off.feedback).toBe(false);
  });

  it("marks d-pad buttons pressed on pointerdown", async () => {
    const el = await mount();
    const upBtn = el.shadowRoot?.querySelector(".gcdpad__btn--up") as HTMLButtonElement;
    upBtn.dispatchEvent(
      new PointerEvent("pointerdown", { bubbles: true, pointerType: "touch", button: 0 }),
    );
    expect(upBtn.dataset.gcPressed).toBe("");
  });

  it("calls navigator.vibrate on d-pad presses when vibrate is true", async () => {
    const vibrate = vi.fn(() => true as boolean);
    Object.defineProperty(navigator, "vibrate", {
      configurable: true,
      writable: true,
      value: vibrate,
    });

    const el = await mount();
    const upBtn = el.shadowRoot?.querySelector(".gcdpad__btn--up") as HTMLButtonElement;
    upBtn.click();

    expect(vibrate).toHaveBeenCalledWith(10);
  });

  it("calls navigator.vibrate on select ancillary when vibrate is true", async () => {
    const vibrate = vi.fn(() => true as boolean);
    Object.defineProperty(navigator, "vibrate", {
      configurable: true,
      writable: true,
      value: vibrate,
    });

    const el = await mount();
    buttonByText(el, "select").click();

    expect(vibrate).toHaveBeenCalledWith(10);
  });

  it("enables emit-cardinal on the shell joystick", async () => {
    const el = await mount();
    el.leftControl = "joystick";
    await el.updateComplete;
    const joystick = el.shadowRoot?.querySelector(".gcjoystick") as HTMLElement | null;
    expect(joystick?.hasAttribute("data-emit-cardinal")).toBe(true);
  });

  it("unlocks screen orientation after requesting fullscreen", async () => {
    const unlock = vi.fn();
    Object.defineProperty(globalThis, "screen", {
      configurable: true,
      value: { orientation: { unlock } },
    });

    const el = await mount();
    const reqFs = vi.fn(() => Promise.resolve());
    el.requestFullscreen = reqFs as typeof el.requestFullscreen;

    buttonByText(el, "fullscreen").click();
    await vi.waitFor(() => {
      expect(reqFs).toHaveBeenCalledTimes(1);
      expect(unlock).toHaveBeenCalled();
    });
  });

  it("calls navigator.vibrate on joystick pointerdown when vibrate is true", async () => {
    const vibrate = vi.fn(() => true as boolean);
    Object.defineProperty(navigator, "vibrate", {
      configurable: true,
      writable: true,
      value: vibrate,
    });

    const el = await mount();
    el.leftControl = "joystick";
    await el.updateComplete;

    const knob = el.shadowRoot?.querySelector(".gcjoystick__knob") as HTMLButtonElement | undefined;
    if (!knob) throw new Error("joystick knob not found");

    knob.dispatchEvent(new PointerEvent("pointerdown", { bubbles: true, cancelable: true }));

    expect(vibrate).toHaveBeenCalledWith(10);
  });

  it("skips joystick haptics when vibrate is false", async () => {
    const vibrate = vi.fn(() => true as boolean);
    Object.defineProperty(navigator, "vibrate", {
      configurable: true,
      writable: true,
      value: vibrate,
    });

    const el = await mount();
    el.leftControl = "joystick";
    el.vibrate = false;
    await el.updateComplete;

    const knob = el.shadowRoot?.querySelector(".gcjoystick__knob") as HTMLButtonElement | undefined;
    if (!knob) throw new Error("joystick knob not found");

    knob.dispatchEvent(new PointerEvent("pointerdown", { bubbles: true, cancelable: true }));

    expect(vibrate).not.toHaveBeenCalled();
  });

  it("pulses haptics when joystick cardinal changes", async () => {
    const vibrate = vi.fn(() => true as boolean);
    Object.defineProperty(navigator, "vibrate", {
      configurable: true,
      writable: true,
      value: vibrate,
    });

    const el = await mount();
    el.leftControl = "joystick";
    await el.updateComplete;

    vibrate.mockClear();
    el.dispatchEvent(
      new CustomEvent(EVENTS.gcJoystick.cardinal.up, {
        bubbles: true,
        composed: true,
        detail: { cardinal: "up" },
      }),
    );

    expect(vibrate).toHaveBeenCalledWith(10);
  });

  it("cancels a second tap so the page does not zoom", async () => {
    const el = await mount();
    const first = new Event("touchend", { bubbles: true, cancelable: true });
    el.dispatchEvent(first);
    expect(first.defaultPrevented).toBe(false);

    const second = new Event("touchend", { bubbles: true, cancelable: true });
    el.dispatchEvent(second);
    expect(second.defaultPrevented).toBe(true);

    const dblclick = new MouseEvent("dblclick", { bubbles: true, cancelable: true });
    el.dispatchEvent(dblclick);
    expect(dblclick.defaultPrevented).toBe(true);
  });
});
