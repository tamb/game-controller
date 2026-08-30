/** Bubble + composed so listeners outside shadow DOM still see the event. */
export function dispatchComposed<T>(
  host: EventTarget | null | undefined,
  name: string,
  detail: T,
): void {
  if (!host) return;
  host.dispatchEvent(
    new CustomEvent<T>(name, {
      detail,
      bubbles: true,
      composed: true,
    }),
  );
}
