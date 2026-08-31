import { describe, expect, it } from "vitest";
import "./react";

describe("@tamb/gamecontroller/react", () => {
  it("does not register custom element tags", () => {
    expect(customElements.get("game-controller")).toBeUndefined();
    expect(customElements.get("gc-dpad")).toBeUndefined();
    expect(customElements.get("gc-joystick")).toBeUndefined();
    expect(customElements.get("gc-face-buttons")).toBeUndefined();
    expect(customElements.get("gc-ancillary-buttons")).toBeUndefined();
  });
});
