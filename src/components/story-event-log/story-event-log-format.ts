/** JSON.stringify replacer: shrink DOM nodes to tag placeholders for the log panel. */
export function storyEventDetailReplacer(_key: string, val: unknown): unknown {
  if (val instanceof HTMLElement) {
    return `<${val.tagName.toLowerCase()}>`;
  }
  return val;
}

export function serializeStoryEventDetail(detail: unknown): string {
  try {
    return JSON.stringify(detail, storyEventDetailReplacer);
  } catch {
    return "[detail]";
  }
}

/** One log line: time fragment, event type, JSON detail (Storybook event log). */
export function formatStoryEventLogLine(
  ev: Pick<CustomEvent<unknown>, "type" | "detail">,
  getTime: () => Date = () => new Date(),
): string {
  const t = getTime().toISOString().slice(11, 23);
  return `${t}  ${ev.type}  ${serializeStoryEventDetail(ev.detail)}`;
}
