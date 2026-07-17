/**
 * Unlocks screen orientation so the host can rotate into landscape (and back).
 * Safe to call when the Screen Orientation API is missing or denies unlock.
 */
export async function unlockScreenOrientation(): Promise<void> {
  try {
    const orientation = (
      globalThis as typeof globalThis & {
        screen?: { orientation?: { unlock?: () => void } };
      }
    ).screen?.orientation;
    orientation?.unlock?.();
  } catch {
    /* unsupported or denied */
  }
}
