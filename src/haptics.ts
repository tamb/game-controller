/** Default Vibration API pulse length (ms) for button / stick feedback. */
export const GC_HAPTIC_PULSE_MS = 10;

/**
 * Light haptic pulse via the Vibration API when enabled and supported.
 * No-ops when `enabled` is false or `navigator.vibrate` is missing.
 */
export function pulseHaptics(enabled: boolean, durationMs = GC_HAPTIC_PULSE_MS): void {
  if (!enabled) return;
  navigator.vibrate?.(durationMs);
}

/**
 * Parses the `vibrate` HTML attribute. Omitted → on; `false` / `0` / `off` → off.
 */
export function parseVibrateAttribute(value: string | null): boolean {
  if (value === null) return true;
  const s = value.trim().toLowerCase();
  if (s === "false" || s === "0" || s === "off") return false;
  return true;
}
