import { describe, expect, it } from "vitest";
import { getDemoCapabilityStatus, isFullscreenSupported, isHapticsSupported } from "./capabilities";

describe("isHapticsSupported", () => {
  it("returns true when navigator.vibrate is a function", () => {
    expect(isHapticsSupported({ vibrate: () => true })).toBe(true);
  });

  it("returns false when vibrate is missing", () => {
    expect(isHapticsSupported({} as Navigator)).toBe(false);
    expect(isHapticsSupported(undefined)).toBe(false);
    expect(isHapticsSupported(null)).toBe(false);
  });
});

describe("isFullscreenSupported", () => {
  it("returns true when document.fullscreenEnabled is true", () => {
    expect(
      isFullscreenSupported({ fullscreenEnabled: true }, { requestFullscreen: async () => {} }),
    ).toBe(true);
  });

  it("returns true when webkitFullscreenEnabled is true", () => {
    expect(
      isFullscreenSupported(
        { webkitFullscreenEnabled: true },
        { webkitRequestFullscreen: () => {} },
      ),
    ).toBe(true);
  });

  it("returns false when fullscreenEnabled is false", () => {
    expect(
      isFullscreenSupported({ fullscreenEnabled: false }, { requestFullscreen: async () => {} }),
    ).toBe(false);
  });

  it("falls back to requestFullscreen presence when flags are unset", () => {
    expect(isFullscreenSupported({} as Document, { requestFullscreen: async () => {} })).toBe(true);
    expect(isFullscreenSupported({} as Document, { webkitRequestFullscreen: () => {} })).toBe(true);
    expect(isFullscreenSupported({} as Document, {} as Element)).toBe(false);
    expect(isFullscreenSupported(undefined, undefined)).toBe(false);
  });
});

describe("getDemoCapabilityStatus", () => {
  it("reports both capabilities from the given document and navigator", () => {
    expect(
      getDemoCapabilityStatus(
        { fullscreenEnabled: true },
        { vibrate: () => true },
        { requestFullscreen: async () => {} },
      ),
    ).toEqual({ fullscreen: true, haptics: true });

    expect(
      getDemoCapabilityStatus({ fullscreenEnabled: false }, {} as Navigator, {} as Element),
    ).toEqual({ fullscreen: false, haptics: false });
  });
});
