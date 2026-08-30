import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const here = dirname(fileURLToPath(import.meta.url));

describe("demo anti-zoom page contract", () => {
  it("locks the viewport so mobile browsers cannot double-tap zoom", () => {
    const html = readFileSync(join(here, "index.html"), "utf8");
    expect(html).toMatch(/maximum-scale=1/);
    expect(html).toMatch(/minimum-scale=1/);
    expect(html).toMatch(/user-scalable=no/);
  });

  it("disables default touch gestures on the page chrome", () => {
    const css = readFileSync(join(here, "demo.css"), "utf8");
    expect(css).toMatch(/html,\s*body\s*\{[^}]*touch-action:\s*none/);
    expect(css).toMatch(/\.demo-stage-host \*\s*\{[^}]*touch-action:\s*none/);
    expect(css).toMatch(/\.stage-screen\s*\{[^}]*touch-action:\s*pan-y/);
  });

  it("installs the double-tap zoom guard on the document", () => {
    const main = readFileSync(join(here, "main.ts"), "utf8");
    expect(main).toMatch(/installDoubleTapZoomGuard\(document\)/);
  });
});
