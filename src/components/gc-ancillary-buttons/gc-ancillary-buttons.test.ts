import { beforeEach, describe, expect, it, vi } from "vitest";
import { EVENTS } from "../../events";
import type { GcAncillaryButtonsElement } from "./gc-ancillary-buttons";
import "./gc-ancillary-buttons";

async function mount() {
  document.body.replaceChildren();
  const el = document.createElement("gc-ancillary-buttons") as GcAncillaryButtonsElement;
  document.body.append(el);
  await el.updateComplete;
  return el;
}

describe("GcAncillaryButtonsElement", () => {
  beforeEach(() => {
    document.body.replaceChildren();
  });

  it("defines the gc-ancillary-buttons tag", () => {
    expect(customElements.get("gc-ancillary-buttons")).toBeDefined();
  });

  it.each([
    ["fullscreen", EVENTS.gcAncillary.fullscreen, "fullscreen"],
    ["select", EVENTS.gcAncillary.select, "select"],
    ["start", EVENTS.gcAncillary.start, "start"],
  ] as const)("emits %s with id and controller", async (label, eventType, id) => {
    const el = await mount();
    const spy = vi.fn();
    el.addEventListener(eventType, spy);

    const btn = [...el.shadowRoot!.querySelectorAll("button")].find(
      (b) => b.textContent?.trim() === label,
    );
    expect(btn).toBeTruthy();
    btn!.click();

    expect(spy).toHaveBeenCalledTimes(1);
    const evt = spy.mock.calls[0][0] as CustomEvent<{ controller: HTMLElement; id: string }>;
    expect(evt.detail.controller).toBe(el);
    expect(evt.detail.id).toBe(id);
    expect(evt.bubbles).toBe(true);
    expect(evt.composed).toBe(true);
  });

  it("exposes stable part names on buttons", async () => {
    const el = await mount();
    const root = el.shadowRoot!;
    expect(root.querySelector("[part='btn-fullscreen']")).toBeTruthy();
    expect(root.querySelector("[part='btn-select']")).toBeTruthy();
    expect(root.querySelector("[part='btn-start']")).toBeTruthy();
  });
});
