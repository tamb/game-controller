import { createElement } from "react";
import { describe, expect, it } from "vitest";
import {
  GAME_CONTROLLER_SLOTS,
  GameControllerActions,
  GameControllerAncillaries,
  GameControllerLeftControl,
  GameControllerStage,
  partitionGameControllerSlots,
} from "./game-controller-slots";

describe("partitionGameControllerSlots", () => {
  it("sends unnamed children to the stage", () => {
    const parts = partitionGameControllerSlots(createElement("p", { className: "hud" }, "score"));
    expect(parts.stage).toHaveLength(1);
    expect(parts.leftControl).toHaveLength(0);
  });

  it("routes named slot components", () => {
    const parts = partitionGameControllerSlots([
      createElement(GameControllerStage, { key: "s" }, "screen"),
      createElement(GameControllerLeftControl, { key: "l" }, "stick"),
      createElement(GameControllerActions, { key: "a" }, "faces"),
      createElement(GameControllerAncillaries, { key: "n" }, "row"),
    ]);
    expect(parts.stage).toHaveLength(1);
    expect(parts.leftControl).toHaveLength(1);
    expect(parts.actions).toHaveLength(1);
    expect(parts.ancillaries).toHaveLength(1);
  });

  it("honors a slot attribute on arbitrary elements", () => {
    const parts = partitionGameControllerSlots(
      createElement("gc-joystick", { slot: GAME_CONTROLLER_SLOTS.leftControl }),
    );
    expect(parts.leftControl).toHaveLength(1);
    expect(parts.stage).toHaveLength(0);
  });
});
