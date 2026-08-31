import { describe, expect, it } from "vitest";
import { coerceFeedback, parseFeedbackAttribute, syncFeedbackAttribute } from "./feedback";

describe("parseFeedbackAttribute", () => {
  it("defaults to on when omitted", () => {
    expect(parseFeedbackAttribute(null)).toBe(true);
  });

  it("parses false, 0, and off as disabled", () => {
    expect(parseFeedbackAttribute("false")).toBe(false);
    expect(parseFeedbackAttribute("0")).toBe(false);
    expect(parseFeedbackAttribute("off")).toBe(false);
  });
});

describe("coerceFeedback", () => {
  it("treats undefined as enabled", () => {
    expect(coerceFeedback(undefined)).toBe(true);
  });

  it("coerces boolean false", () => {
    expect(coerceFeedback(false)).toBe(false);
  });
});

describe("syncFeedbackAttribute", () => {
  it("sets data-gc-feedback=off when disabled", () => {
    const host = document.createElement("game-controller");
    syncFeedbackAttribute(host, false);
    expect(host.getAttribute("data-gc-feedback")).toBe("off");
  });

  it("removes data-gc-feedback when enabled", () => {
    const host = document.createElement("gc-dpad");
    host.setAttribute("data-gc-feedback", "off");
    syncFeedbackAttribute(host, true);
    expect(host.hasAttribute("data-gc-feedback")).toBe(false);
  });
});
