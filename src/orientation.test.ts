import { describe, expect, it, vi } from "vitest";
import { unlockScreenOrientation } from "./orientation";

describe("unlockScreenOrientation", () => {
  it("calls screen.orientation.unlock when available", async () => {
    const unlock = vi.fn();
    Object.defineProperty(globalThis, "screen", {
      configurable: true,
      value: { orientation: { unlock } },
    });

    await unlockScreenOrientation();

    expect(unlock).toHaveBeenCalledTimes(1);
  });

  it("swallows unlock failures", async () => {
    Object.defineProperty(globalThis, "screen", {
      configurable: true,
      value: {
        orientation: {
          unlock: () => {
            throw new Error("denied");
          },
        },
      },
    });

    await expect(unlockScreenOrientation()).resolves.toBeUndefined();
  });

  it("no-ops when Screen Orientation API is missing", async () => {
    Object.defineProperty(globalThis, "screen", {
      configurable: true,
      value: {},
    });

    await expect(unlockScreenOrientation()).resolves.toBeUndefined();
  });
});
