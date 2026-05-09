import { beforeEach, describe, expect, it, vi } from "vitest";
import { EVENTS } from "../../events";
import type { GcJoystickElement } from "./gc-joystick";
import "./gc-joystick";

async function mountJoystick(props?: Partial<GcJoystickElement>) {
  document.body.replaceChildren();
  document.documentElement.style.minHeight = "320px";
  document.body.style.minHeight = "280px";
  document.body.style.minWidth = "280px";
  const el = document.createElement("gc-joystick") as GcJoystickElement;
  el.style.display = "block";
  el.style.width = "140px";
  Object.assign(el, props ?? {});
  document.body.append(el);
  await el.updateComplete;
  return el;
}

/** Stub ring geometry for environments without layout (e.g. Vitest / happy-dom). */
function stubJoystickRingRect(el: GcJoystickElement, size = 100, originLeft = 80, originTop = 80) {
  const ring = el.shadowRoot?.querySelector(".gcjoystick__ring") as HTMLElement | undefined;
  if (!ring) throw new Error("ring");
  const left = originLeft;
  const top = originTop;
  ring.getBoundingClientRect = (): DOMRect =>
    ({
      width: size,
      height: size,
      top,
      left,
      right: left + size,
      bottom: top + size,
      x: left,
      y: top,
      toJSON: () => "",
    }) as DOMRect;
}

/** Drag knob from ring center by (dx,dy) in CSS pixels. */
function dragKnob(el: GcJoystickElement, dx: number, dy: number) {
  stubJoystickRingRect(el);
  const ring = el.shadowRoot?.querySelector(".gcjoystick__ring") as HTMLElement | undefined;
  const knob = el.shadowRoot?.querySelector(".gcjoystick__knob") as HTMLElement | undefined;
  if (!ring || !knob) throw new Error("joystick DOM");

  const r = ring.getBoundingClientRect();
  const cx = r.left + r.width / 2;
  const cy = r.top + r.height / 2;
  const pid = 7;

  const mk = (type: string, x: number, y: number) =>
    new PointerEvent(type, {
      bubbles: true,
      clientX: x,
      clientY: y,
      pointerId: pid,
    });

  knob.dispatchEvent(mk("pointerdown", cx, cy));
  knob.dispatchEvent(mk("pointermove", cx + dx, cy + dy));
  knob.dispatchEvent(mk("pointerup", cx + dx, cy + dy));
}

function lastMoveWithMagnitude(spy: ReturnType<typeof vi.fn>): CustomEvent {
  const moves = spy.mock.calls
    .map((c) => c[0] as CustomEvent)
    .filter(
      (e) =>
        e.type === EVENTS.gcJoystick.move && (e.detail as { magnitude?: number }).magnitude > 0,
    );
  const last = moves.at(-1);
  if (!last) throw new Error(`expected ${EVENTS.gcJoystick.move} with magnitude > 0`);
  return last;
}

describe("GcJoystickElement", () => {
  beforeEach(() => {
    document.body.replaceChildren();
    document.documentElement.style.minHeight = "";
    document.body.style.minHeight = "";
    document.body.style.minWidth = "";
  });

  it("defines the gc-joystick tag", () => {
    expect(customElements.get("gc-joystick")).toBeDefined();
  });

  it("emits gcjoystick:pointerdown when grabbing the knob", async () => {
    const el = await mountJoystick();
    stubJoystickRingRect(el);
    const spy = vi.fn();
    el.addEventListener(EVENTS.gcJoystick.pointerDown, spy);
    const knob = el.shadowRoot?.querySelector(".gcjoystick__knob") as HTMLButtonElement;
    const ring = el.shadowRoot?.querySelector(".gcjoystick__ring") as HTMLElement;
    const r = ring.getBoundingClientRect();
    const cx = r.left + r.width / 2;
    const cy = r.top + r.height / 2;
    knob.dispatchEvent(
      new PointerEvent("pointerdown", {
        bubbles: true,
        cancelable: true,
        clientX: cx,
        clientY: cy,
        pointerId: 1,
      }),
    );
    expect(spy).toHaveBeenCalledTimes(1);
    const evt = spy.mock.calls[0][0] as CustomEvent<{ controller: GcJoystickElement }>;
    expect(evt.detail.controller).toBe(el);
    expect(evt.composed).toBe(true);
    expect(evt.bubbles).toBe(true);
  });

  it("emits gcjoystick:move with magnitude and angles after drag", async () => {
    const el = await mountJoystick({ deadZone: 0.05 });
    const spy = vi.fn();
    el.addEventListener(EVENTS.gcJoystick.move, spy);

    dragKnob(el, 55, 0);

    expect(spy.mock.calls.length).toBeGreaterThanOrEqual(1);
    const last = lastMoveWithMagnitude(spy);
    expect(last.detail.controller).toBe(el);
    expect(last.detail.magnitude).toBeGreaterThan(0.2);
    expect(last.detail.angleDeg).not.toBeNull();
    expect(typeof last.detail.x).toBe("number");
    expect(typeof last.detail.y).toBe("number");
    expect(last.detail.sectorId).toBeTruthy();
    expect(last.detail.cardinal).toBe("right");
    expect(last.detail.clockHour).toBe(3);
  });

  it("emits cardinal edge events when emitCardinal is true", async () => {
    const el = await mountJoystick({ emitCardinal: true, deadZone: 0.05 });
    const cardinalSpy = vi.fn();
    el.addEventListener(EVENTS.gcJoystick.cardinal.right, cardinalSpy);

    dragKnob(el, 60, 0);

    expect(cardinalSpy).toHaveBeenCalled();
    const evt = cardinalSpy.mock.calls[0][0] as CustomEvent;
    expect(evt.detail.cardinal).toBe("right");
    expect(evt.detail.previousCardinal).toBeDefined();
  });

  it("emits sector edge events when emitSectors is true", async () => {
    const el = await mountJoystick({ emitSectors: true, deadZone: 0.05 });
    const sectorSpy = vi.fn();
    el.addEventListener(EVENTS.gcJoystick.sector, sectorSpy);

    dragKnob(el, -50, -50);

    expect(sectorSpy).toHaveBeenCalled();
    const evt = sectorSpy.mock.calls.find(
      (c) => (c[0] as CustomEvent).detail.sectorId === "nw",
    )?.[0] as CustomEvent | undefined;
    expect(evt?.detail.sectorId).toBe("nw");
  });

  it("parses sectors-json into custom sectors", async () => {
    const sectorsJson = JSON.stringify([
      { id: "custom-a", startDeg: 0, endDeg: 179 },
      { id: "custom-b", startDeg: 180, endDeg: 359 },
    ]);
    const el = await mountJoystick({ sectorsJson, deadZone: 0.05 });
    await el.updateComplete;
    const spy = vi.fn();
    el.addEventListener(EVENTS.gcJoystick.move, spy);
    dragKnob(el, 0, 45);
    const last = lastMoveWithMagnitude(spy);
    expect(last.detail.sectorId).toBe("custom-b");
  });
});
