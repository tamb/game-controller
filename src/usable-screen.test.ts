import { afterEach, describe, expect, it } from "vitest";
import {
  applyUsableScreenScale,
  clearUsableScreenScale,
  computeUsableScreen,
  GC_USABLE_SCREEN_VARS,
  measureUsableScreen,
  parseUsableScreenChromeSource,
  resolveGameControllerScale,
} from "./usable-screen";

describe("resolveGameControllerScale", () => {
  it("defaults to usable", () => {
    expect(resolveGameControllerScale(undefined)).toBe("usable");
    expect(resolveGameControllerScale(null)).toBe("usable");
    expect(resolveGameControllerScale("")).toBe("usable");
    expect(resolveGameControllerScale("usable")).toBe("usable");
    expect(resolveGameControllerScale("true")).toBe("usable");
  });

  it("accepts none / falsey tokens", () => {
    expect(resolveGameControllerScale("none")).toBe("none");
    expect(resolveGameControllerScale("false")).toBe("none");
    expect(resolveGameControllerScale("0")).toBe("none");
    expect(resolveGameControllerScale("OFF")).toBe("none");
  });
});

describe("parseUsableScreenChromeSource", () => {
  it("parses pixel strings and numbers", () => {
    expect(parseUsableScreenChromeSource("48")).toBe(48);
    expect(parseUsableScreenChromeSource("48px")).toBe(48);
    expect(parseUsableScreenChromeSource(64)).toBe(64);
    expect(parseUsableScreenChromeSource("")).toBeNull();
  });

  it("keeps selectors and elements", () => {
    expect(parseUsableScreenChromeSource("header.app")).toBe("header.app");
    const el = document.createElement("header");
    expect(parseUsableScreenChromeSource(el)).toBe(el);
  });
});

describe("computeUsableScreen", () => {
  const viewport = { width: 400, height: 800, offsetTop: 0, offsetLeft: 0 };

  it("equals the viewport when the host is at the origin and there is no chrome", () => {
    expect(
      computeUsableScreen({
        host: { top: 0, right: 400, bottom: 800, left: 0 },
        viewport,
      }),
    ).toEqual({
      width: 400,
      height: 800,
      chrome: { top: 0, right: 0, bottom: 0, left: 0 },
    });
  });

  it("subtracts in-flow header and footer menus without double-counting host.top", () => {
    expect(
      computeUsableScreen({
        host: { top: 80, right: 400, bottom: 760, left: 0 },
        viewport,
        header: { top: 0, right: 400, bottom: 80, left: 0 },
        footer: { top: 760, right: 400, bottom: 800, left: 0 },
      }),
    ).toEqual({
      width: 400,
      height: 680,
      chrome: { top: 80, right: 0, bottom: 40, left: 0 },
    });
  });

  it("uses numeric chrome when the host sits at the viewport origin", () => {
    expect(
      computeUsableScreen({
        host: { top: 0, right: 400, bottom: 800, left: 0 },
        viewport,
        header: 56,
        footer: 48,
      }),
    ).toEqual({
      width: 400,
      height: 696,
      chrome: { top: 56, right: 0, bottom: 48, left: 0 },
    });
  });

  it("does not add an explicit header height on top of host.top", () => {
    expect(
      computeUsableScreen({
        host: { top: 80, right: 400, bottom: 800, left: 0 },
        viewport,
        header: 64,
      }).chrome.top,
    ).toBe(80);
  });

  it("subtracts side chrome and extra insets", () => {
    expect(
      computeUsableScreen({
        host: { top: 0, right: 360, bottom: 800, left: 40 },
        viewport,
        start: { top: 0, right: 40, bottom: 800, left: 0 },
        end: { top: 0, right: 400, bottom: 800, left: 360 },
        inset: { top: 8 },
      }),
    ).toEqual({
      width: 320,
      height: 792,
      chrome: { top: 8, right: 40, bottom: 0, left: 40 },
    });
  });
});

describe("measureUsableScreen + applyUsableScreenScale", () => {
  afterEach(() => {
    document.body.replaceChildren();
  });

  function stubRect(
    el: Element,
    box: { top: number; left: number; width: number; height: number },
  ) {
    Object.defineProperty(el, "getBoundingClientRect", {
      configurable: true,
      value: () => ({
        top: box.top,
        left: box.left,
        width: box.width,
        height: box.height,
        right: box.left + box.width,
        bottom: box.top + box.height,
        x: box.left,
        y: box.top,
        toJSON() {
          return this;
        },
      }),
    });
  }

  it("ignores header/footer menus that live inside the controller", () => {
    const host = document.createElement("div");
    const inner = document.createElement("header");
    inner.dataset.gcChrome = "header";
    host.append(inner);
    document.body.append(host);
    stubRect(host, { top: 0, left: 0, width: 400, height: 800 });
    stubRect(inner, { top: 0, left: 0, width: 400, height: 80 });

    const size = measureUsableScreen(host, { viewport: { width: 400, height: 800 } });
    expect(size.chrome.top).toBe(0);
    expect(size.height).toBe(800);
  });

  it("picks marked header/footer outside the host", () => {
    const header = document.createElement("header");
    header.dataset.gcChrome = "header";
    const host = document.createElement("div");
    const footer = document.createElement("footer");
    footer.dataset.gcChrome = "footer";
    document.body.append(header, host, footer);

    stubRect(header, { top: 0, left: 0, width: 390, height: 50 });
    stubRect(host, { top: 50, left: 0, width: 390, height: 700 });
    stubRect(footer, { top: 750, left: 0, width: 390, height: 50 });

    const size = measureUsableScreen(host, { viewport: { width: 390, height: 800 } });
    expect(size.height).toBe(700);
    expect(size.chrome).toEqual({ top: 50, right: 0, bottom: 50, left: 0 });
  });

  it("writes usable and chrome custom properties", () => {
    const host = document.createElement("div");
    document.body.append(host);
    stubRect(host, { top: 24, left: 0, width: 320, height: 500 });

    const size = applyUsableScreenScale(host, {
      viewport: { width: 320, height: 640 },
      footer: 40,
    });
    expect(size.height).toBe(576);
    expect(host.style.getPropertyValue(GC_USABLE_SCREEN_VARS.usableHeight)).toBe("576px");
    expect(host.style.getPropertyValue(GC_USABLE_SCREEN_VARS.chromeTop)).toBe("24px");
    expect(host.style.getPropertyValue(GC_USABLE_SCREEN_VARS.chromeBottom)).toBe("40px");

    clearUsableScreenScale(host);
    expect(host.style.getPropertyValue(GC_USABLE_SCREEN_VARS.usableHeight)).toBe("");
  });
});
