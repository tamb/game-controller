import { createElement } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, describe, expect, it } from "vitest";
import { GameController } from "./game-controller";

describe("GameController React component", () => {
  let root: Root | null = null;
  let host: HTMLDivElement | null = null;

  afterEach(() => {
    root?.unmount();
    root = null;
    host?.remove();
    host = null;
  });

  it("renders d-pad and face buttons into a React root", async () => {
    host = document.createElement("div");
    document.body.append(host);
    root = createRoot(host);
    root.render(createElement(GameController, { actions: 2 }));
    await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));

    expect(host.querySelector(".gcdpad")).toBeTruthy();
    expect(host.querySelector(".gcface__actions--two")).toBeTruthy();
    expect([...host.querySelectorAll(".gcface__btn")].map((b) => b.textContent?.trim())).toEqual([
      "A",
      "B",
    ]);
  });

  it("renders children in the stage", async () => {
    host = document.createElement("div");
    document.body.append(host);
    root = createRoot(host);
    root.render(
      createElement(
        GameController,
        { actions: 2 },
        createElement("p", { className: "stage-child" }, "hello"),
      ),
    );
    await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));

    expect(host.querySelector(".gamecontroller__stage .stage-child")?.textContent).toBe("hello");
  });
});
