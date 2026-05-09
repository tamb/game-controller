import { beforeEach, describe, expect, it } from "vitest";
import { EVENTS } from "../../events";
import "../../index";
import type { GameControllerElement } from "../game-controller/game-controller";
import type { SbEventLogElement } from "./story-event-log";
import "./story-event-log";

async function flush() {
  await new Promise((r) => requestAnimationFrame(r));
}

describe("SbEventLogElement", () => {
  beforeEach(() => {
    document.body.replaceChildren();
  });

  it("defines the sb-event-log tag", () => {
    expect(customElements.get("sb-event-log")).toBeDefined();
  });

  it("logs gcdpad events from slotted demo (default layout)", async () => {
    const log = document.createElement("sb-event-log") as SbEventLogElement;
    log.eventNames = [EVENTS.gcDpad.up];
    const dpad = document.createElement("gc-dpad");
    log.appendChild(dpad);
    document.body.append(log);
    await log.updateComplete;

    const up = dpad.shadowRoot!.querySelector(".gcdpad__btn--up") as HTMLButtonElement;
    up.click();
    await log.updateComplete;

    const pre = log.shadowRoot!.querySelector('[part="log"]');
    expect(pre?.textContent).toContain(EVENTS.gcDpad.up);
    expect(pre?.textContent).toContain('"direction":"up"');
  });

  it("Clear resets the log", async () => {
    const log = document.createElement("sb-event-log") as SbEventLogElement;
    log.eventNames = [EVENTS.gcDpad.down];
    const dpad = document.createElement("gc-dpad");
    log.appendChild(dpad);
    document.body.append(log);
    await log.updateComplete;

    (dpad.shadowRoot!.querySelector(".gcdpad__btn--down") as HTMLButtonElement).click();
    await log.updateComplete;
    expect(log.shadowRoot!.querySelector('[part="log"]')?.textContent).toContain(
      EVENTS.gcDpad.down,
    );

    (log.shadowRoot!.querySelector("button") as HTMLButtonElement).click();
    await log.updateComplete;
    expect(log.shadowRoot!.querySelector('[part="log"]')?.textContent?.trim()).toBe("");
  });

  it("embed-stage listens on closest game-controller", async () => {
    const gc = document.createElement("game-controller") as GameControllerElement;
    const log = document.createElement("sb-event-log") as SbEventLogElement;
    log.setAttribute("embed-stage", "");
    log.slot = "stage";
    log.eventNames = [EVENTS.gameController.ancillary.select];
    gc.appendChild(log);
    document.body.appendChild(gc);
    await gc.updateComplete;
    await log.updateComplete;

    gc.dispatchEvent(
      new CustomEvent(EVENTS.gameController.ancillary.select, {
        bubbles: true,
        composed: true,
        detail: { controller: gc },
      }),
    );
    await flush();
    await log.updateComplete;

    const pre = log.shadowRoot!.querySelector('[part="log"]');
    expect(pre?.textContent).toContain(EVENTS.gameController.ancillary.select);
  });
});
