/**
 * Parses the `feedback` HTML attribute. Omitted → on; `false` / `0` / `off` → off.
 */
export function parseFeedbackAttribute(value: string | null): boolean {
  if (value === null) return true;
  const s = value.trim().toLowerCase();
  if (s === "false" || s === "0" || s === "off") return false;
  return true;
}

export function coerceFeedback(value: unknown): boolean {
  if (value === false) return false;
  if (value === true || value === undefined || value === null) return true;
  if (typeof value === "string") return parseFeedbackAttribute(value);
  return Boolean(value);
}

/** Sync `data-gc-feedback="off"` on a host when visual press feedback is disabled. */
export function syncFeedbackAttribute(host: HTMLElement, enabled: boolean): void {
  if (enabled) {
    host.removeAttribute("data-gc-feedback");
    return;
  }
  host.setAttribute("data-gc-feedback", "off");
}
