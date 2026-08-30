/** True when r2wc passed the shadow root as `container`. */
export function isShadowContainer(container?: HTMLElement | null): boolean {
  if (!container) return false;
  const host = (container as unknown as ShadowRoot).host;
  return host instanceof HTMLElement;
}

/**
 * Resolves the custom-element host from an r2wc shadow `container`,
 * or falls back to the shadow host of `fallback` / the node itself.
 */
export function getCustomElementHost(
  container?: HTMLElement | null,
  fallback?: Element | null,
): HTMLElement | null {
  if (container) {
    const host = (container as unknown as ShadowRoot).host;
    if (host instanceof HTMLElement) return host;
    if (container instanceof HTMLElement) return container;
  }
  if (fallback) {
    const root = fallback.getRootNode();
    if (root instanceof ShadowRoot && root.host instanceof HTMLElement) {
      return root.host;
    }
    if (fallback instanceof HTMLElement) return fallback;
  }
  return null;
}
