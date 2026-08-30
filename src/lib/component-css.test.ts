import { describe, expect, it } from "vitest";
import { cssForClassHost, resolveComponentCss } from "./component-css";

describe("cssForClassHost", () => {
  it("rewrites :host and :host(...) to a class selector", () => {
    const raw = `
:host { display: block; }
:host(:fullscreen) { height: 100%; }
:host * { box-sizing: inherit; }
`;
    const out = cssForClassHost(raw, "game-controller");
    expect(out).toContain(".game-controller { display: block; }");
    expect(out).toContain(".game-controller:fullscreen { height: 100%; }");
    expect(out).toContain(".game-controller * { box-sizing: inherit; }");
    expect(out).not.toContain(":host");
  });
});

describe("resolveComponentCss", () => {
  it("keeps :host when rendering inside the custom element shadow", () => {
    expect(resolveComponentCss(":host { color: red; }", "x", true)).toBe(":host { color: red; }");
  });
});
