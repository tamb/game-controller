import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const here = dirname(fileURLToPath(import.meta.url));
const readCss = (...parts: string[]) => readFileSync(join(here, ...parts), "utf8");

const controllerCss = readCss("game-controller.css");
const faceCss = readCss("..", "gc-face-buttons", "gc-face-buttons.css");
const dpadCss = readCss("..", "gc-dpad", "gc-dpad.css");
const ancillaryCss = readCss("..", "gc-ancillary-buttons", "gc-ancillary-buttons.css");
const joystickCss = readCss("..", "gc-joystick", "gc-joystick.css");

describe("controller touch + stage overflow CSS", () => {
  it("disables double-tap zoom on the controller host and shadow descendants", () => {
    expect(controllerCss).toMatch(/:host\s*\{[^}]*touch-action:\s*manipulation/);
    expect(controllerCss).toMatch(/:host \*\s*\{[^}]*touch-action:\s*manipulation/);
  });

  it("caps the host so the shell cannot grow past the viewport", () => {
    expect(controllerCss).toMatch(/:host\s*\{[^}]*max-height:/);
    expect(controllerCss).toMatch(/:host\s*\{[^}]*overflow:\s*hidden/);
  });

  it("defines usable-screen tokens that subtract header/footer chrome", () => {
    expect(controllerCss).toMatch(/--gc-usable-height:\s*calc\(100dvh/);
    expect(controllerCss).toMatch(/--gc-usable-width:\s*calc\(100dvw/);
    expect(controllerCss).toMatch(/--gc-chrome-top:/);
    expect(controllerCss).toMatch(/--gc-chrome-bottom:/);
    expect(controllerCss).toMatch(
      /min-height:\s*var\(--gc-host-min-height,\s*var\(--gc-usable-height\)\)/,
    );
    expect(controllerCss).toMatch(
      /max-height:\s*var\(--gc-host-max-height,\s*var\(--gc-host-height,\s*var\(--gc-usable-height\)\)\)/,
    );
  });

  it("clips the stage frame and scrolls the slot / direct children", () => {
    expect(controllerCss).toMatch(/\.gamecontroller__stage\s*\{[^}]*overflow:\s*hidden/);
    expect(controllerCss).toMatch(/\.gamecontroller__stage\s*>\s*slot[^}]*overflow:\s*auto/);
    expect(controllerCss).toMatch(/\.gamecontroller__stage\s*>\s*\*[^}]*overflow:\s*auto/);
    expect(controllerCss).not.toMatch(/min-height:\s*min\(40dvh/);
  });

  it("disables double-tap zoom on standalone controls", () => {
    expect(faceCss).toMatch(/touch-action:\s*none/);
    expect(dpadCss).toMatch(/touch-action:\s*none/);
    expect(ancillaryCss).toMatch(/touch-action:\s*none/);
    expect(joystickCss).toMatch(/touch-action:\s*none/);
  });
});
