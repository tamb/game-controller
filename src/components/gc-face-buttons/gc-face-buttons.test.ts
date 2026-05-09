import { beforeEach, describe, expect, it, vi } from "vitest";
import { EVENTS } from "../../events";
import type { GcFaceButtonsElement } from "./gc-face-buttons";
import "./gc-face-buttons";

async function mount(actions: number) {
  document.body.replaceChildren();
  const el = document.createElement("gc-face-buttons") as GcFaceButtonsElement;
  el.actions = actions;
  document.body.append(el);
  await el.updateComplete;
  return el;
}

function clickLabel(el: GcFaceButtonsElement, label: string) {
  const btn = [...el.shadowRoot!.querySelectorAll("button")].find(
    (b) => b.textContent?.trim() === label,
  );
  if (!btn) throw new Error(`missing button ${label}`);
  (btn as HTMLButtonElement).click();
}

describe("GcFaceButtonsElement", () => {
  beforeEach(() => {
    document.body.replaceChildren();
  });

  it("defines the gc-face-buttons tag", () => {
    expect(customElements.get("gc-face-buttons")).toBeDefined();
  });

  it("renders two labeled buttons when actions is 2", async () => {
    const el = await mount(2);
    const buttons = el.shadowRoot!.querySelectorAll("button");
    expect(buttons.length).toBe(2);
    expect([...buttons].map((b) => b.textContent?.trim())).toEqual(["A", "B"]);
  });

  it("renders four diamond buttons when actions is 4", async () => {
    const el = await mount(4);
    const buttons = el.shadowRoot!.querySelectorAll("button");
    expect(buttons.length).toBe(4);
    expect([...buttons].map((b) => b.textContent?.trim())).toEqual(["Y", "X", "B", "A"]);
  });

  it("uses four-button layout for non-2 actions counts", async () => {
    const el = await mount(3);
    expect(el.shadowRoot!.querySelectorAll("button").length).toBe(4);
  });

  it.each([
    ["A", EVENTS.gcFace.a, "a"],
    ["B", EVENTS.gcFace.b, "b"],
  ] as const)("two-button: emits %s", async (label, eventType, buttonKey) => {
    const el = await mount(2);
    const spy = vi.fn();
    el.addEventListener(eventType, spy);
    clickLabel(el, label);
    expect(spy).toHaveBeenCalledTimes(1);
    const evt = spy.mock.calls[0][0] as CustomEvent<{ controller: HTMLElement; button: string }>;
    expect(evt.detail.controller).toBe(el);
    expect(evt.detail.button).toBe(buttonKey);
    expect(evt.bubbles).toBe(true);
    expect(evt.composed).toBe(true);
  });

  it.each([
    ["Y", EVENTS.gcFace.y, "y"],
    ["X", EVENTS.gcFace.x, "x"],
    ["B", EVENTS.gcFace.b, "b"],
    ["A", EVENTS.gcFace.a, "a"],
  ] as const)("four-button: emits %s", async (label, eventType, buttonKey) => {
    const el = await mount(4);
    const spy = vi.fn();
    el.addEventListener(eventType, spy);
    clickLabel(el, label);
    expect(spy).toHaveBeenCalledTimes(1);
    expect((spy.mock.calls[0][0] as CustomEvent).detail.button).toBe(buttonKey);
  });

  it("exposes part names per face button", async () => {
    const el = await mount(4);
    const root = el.shadowRoot!;
    expect(root.querySelector("[part='btn-y']")).toBeTruthy();
    expect(root.querySelector("[part='btn-x']")).toBeTruthy();
    expect(root.querySelector("[part='btn-b']")).toBeTruthy();
    expect(root.querySelector("[part='btn-a']")).toBeTruthy();
  });
});
