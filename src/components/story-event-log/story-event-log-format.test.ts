import { describe, expect, it } from "vitest";
import {
  formatStoryEventLogLine,
  serializeStoryEventDetail,
  storyEventDetailReplacer,
} from "./story-event-log-format";

describe("storyEventDetailReplacer", () => {
  it("serializes elements as tag placeholders", () => {
    const el = document.createElement("gc-dpad");
    expect(storyEventDetailReplacer("x", el)).toBe("<gc-dpad>");
  });

  it("passes primitives through", () => {
    expect(storyEventDetailReplacer("k", 1)).toBe(1);
  });
});

describe("serializeStoryEventDetail", () => {
  it("stringifies plain objects", () => {
    expect(JSON.parse(serializeStoryEventDetail({ a: 1 }))).toEqual({ a: 1 });
  });

  it("survives non-JSON-serializable payloads", () => {
    const o: Record<string, unknown> = {};
    o.self = o;
    expect(serializeStoryEventDetail(o)).toBe("[detail]");
  });

  it("embeds element placeholders", () => {
    const el = document.createElement("game-controller");
    const s = serializeStoryEventDetail({ controller: el });
    expect(s).toContain("<game-controller>");
  });
});

describe("formatStoryEventLogLine", () => {
  it("joins fixed-width time, type, and detail", () => {
    const fixed = new Date("2026-01-15T08:09:10.123Z");
    const line = formatStoryEventLogLine(
      new CustomEvent("gamecontroller:action:a", { detail: { x: 1 } }),
      () => fixed,
    );
    expect(line.startsWith("08:09:10.123")).toBe(true);
    expect(line).toContain("gamecontroller:action:a");
    expect(line).toContain('"x":1');
  });
});
