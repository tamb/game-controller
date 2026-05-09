import { describe, expect, it } from "vitest";
import { gameControllerFaceButtonLabels, gcFaceButtonsInnerClass } from "./game-controller-layout";

describe("gameControllerFaceButtonLabels", () => {
  it("returns two-button layout for actions === 2", () => {
    expect(gameControllerFaceButtonLabels(2)).toEqual(["a", "b"]);
  });

  it("returns diamond labels otherwise", () => {
    expect(gameControllerFaceButtonLabels(4)).toEqual(["y", "x", "b", "a"]);
    expect(gameControllerFaceButtonLabels(99)).toEqual(["y", "x", "b", "a"]);
  });
});

describe("gcFaceButtonsInnerClass", () => {
  it("maps two vs four layouts", () => {
    expect(gcFaceButtonsInnerClass(2)).toContain("--two");
    expect(gcFaceButtonsInnerClass(4)).toContain("--four");
    expect(gcFaceButtonsInnerClass(3)).toContain("--four");
  });
});
