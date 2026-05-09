import { beforeEach, describe, expect, it, vi } from "vitest";
import { EVENTS } from "../../events";
import type { GcDpadElement } from "./gc-dpad";
import "./gc-dpad";

async function mountDpad() {
  document.body.replaceChildren();
  const el = document.createElement("gc-dpad") as GcDpadElement;
  document.body.append(el);
  await el.updateComplete;
  return el;
}

function clickPad(sr: ShadowRoot, sel: string) {
  const b = sr.querySelector(sel);
  if (!b) throw new Error(`missing ${sel}`);
  (b as HTMLButtonElement).click();
}

describe("GcDpadElement", () => {
  beforeEach(() => {
    document.body.replaceChildren();
  });

  it("defines the gc-dpad tag", () => {
    expect(customElements.get("gc-dpad")).toBeDefined();
  });

  it("emits gcdpad:up with direction and controller", async () => {
    const el = await mountDpad();
    const spy = vi.fn();
    el.addEventListener(EVENTS.gcDpad.up, spy);
    clickPad(el.shadowRoot!, ".gcdpad__btn--up");
    expect(spy).toHaveBeenCalledTimes(1);
    const evt = spy.mock.calls[0][0] as CustomEvent;
    expect(evt.detail.direction).toBe("up");
    expect(evt.detail.controller).toBe(el);
    expect(evt.bubbles).toBe(true);
    expect(evt.composed).toBe(true);
  });

  it.each([
    [".gcdpad__btn--down", EVENTS.gcDpad.down, "down"],
    [".gcdpad__btn--left", EVENTS.gcDpad.left, "left"],
    [".gcdpad__btn--right", EVENTS.gcDpad.right, "right"],
  ] as const)("emits %s", async (sel, type, dir) => {
    const el = await mountDpad();
    const spy = vi.fn();
    el.addEventListener(type, spy);
    clickPad(el.shadowRoot!, sel);
    expect(spy).toHaveBeenCalledTimes(1);
    expect((spy.mock.calls[0][0] as CustomEvent).detail.direction).toBe(dir);
  });
});
