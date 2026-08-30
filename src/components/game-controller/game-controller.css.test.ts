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

  it("lays out the d-pad as a 3×3 plus that scales with axis tokens", () => {
    expect(dpadCss).toMatch(/\.gcdpad\s*\{[^}]*display:\s*grid/);
    expect(dpadCss).toMatch(/grid-template-columns:\s*2fr 1fr 2fr/);
    expect(dpadCss).toMatch(/grid-template-rows:\s*2fr 1fr 2fr/);
    expect(dpadCss).toMatch(/aspect-ratio:\s*1/);
    expect(dpadCss).toMatch(
      /width:\s*calc\(\s*var\(--_gc-dpad-axis\)\s*\*\s*2\s*\+\s*var\(--_gc-dpad-half\)\)/,
    );
    expect(dpadCss).toMatch(/\.gcdpad__btn--up\s*\{[^}]*grid-column:\s*2/);
    expect(dpadCss).toMatch(/\.gcdpad__btn--left\s*\{[^}]*grid-column:\s*1/);
    expect(dpadCss).toMatch(/\.gcdpad__btn--right\s*\{[^}]*grid-column:\s*3/);
    expect(dpadCss).toMatch(/\.gcdpad__btn--down\s*\{[^}]*grid-column:\s*2/);
    expect(dpadCss).not.toMatch(/margin-left:\s*38%/);
  });

  it("pads the control strip on all sides and scales d-pad with face buttons", () => {
    expect(controllerCss).toMatch(/--gc-controls-pad-block:/);
    expect(controllerCss).toMatch(/--gc-controls-pad-inline:/);
    expect(controllerCss).toMatch(
      /\.gamecontroller__main-controls\s*\{[^}]*padding:\s*var\(--gc-controls-pad-block\)\s+var\(--gc-controls-pad-inline\)/,
    );
    expect(controllerCss).not.toMatch(/padding:\s*0\.75rem 2\.5% 0/);
    expect(controllerCss).toMatch(/--gc-control-size-small:\s*120px/);
    expect(controllerCss).toMatch(/--gc-control-size-normal:\s*165px/);
    expect(controllerCss).toMatch(/--gc-control-size-large:\s*198px/);
    expect(controllerCss).toMatch(/--gc-control-size:\s*var\(--gc-control-size-normal\)/);
    expect(controllerCss).toMatch(/@media \(max-width:\s*360px\),\s*\(max-height:\s*360px\)/);
    expect(controllerCss).toMatch(/@media \(min-width:\s*600px\) and \(min-height:\s*600px\)/);
    expect(controllerCss).toMatch(/--gc-controls-pad-block:\s*0\.75rem/);
    expect(controllerCss).toMatch(
      /@media \(orientation:\s*landscape\)\s*\{[^}]*--gc-control-size-normal:\s*140px/,
    );
    expect(controllerCss).toMatch(/:host\(\[size="small"\]\)/);
    expect(controllerCss).toMatch(/--gc-action-size:\s*calc\(\s*var\(--gc-control-size\)/);
    expect(controllerCss).toMatch(/--gc-dpad-axis:\s*calc\(\s*var\(--gc-control-size\)/);
    expect(dpadCss).not.toMatch(/:host\s*\{[^}]*--gc-dpad-axis:\s*66px/);
    expect(controllerCss).toMatch(
      /\.gamecontroller__d-pad-container \.gcdpad-host\s*\{[^}]*width:\s*var\(--gc-control-size\)/,
    );
    expect(controllerCss).toMatch(/flex:\s*0 0 auto/);
    expect(controllerCss).not.toMatch(/flex:\s*0 1 26%/);
    expect(joystickCss).not.toMatch(/--gc-joystick-knob-size:\s*28px/);
    expect(faceCss).toMatch(/margin-bottom:\s*30%/);
  });

  it("does not force display:block on inner control layout classes", () => {
    expect(controllerCss).not.toMatch(/\.gamecontroller__d-pad-container \.gcdpad\s*[,{]/);
    expect(controllerCss).not.toMatch(/\.gamecontroller__actions \.gcface__actions\s*[,{]/);
    expect(controllerCss).not.toMatch(/\.gamecontroller__ancillaries \.gcancillary\s*[,{]/);
  });
});
