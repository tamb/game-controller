/** Build a custom element for Storybook without Lit templates. */
export function createEl<T extends HTMLElement>(
  tag: string,
  assign: Record<string, unknown> = {},
  children: Array<Node | string> = [],
): T {
  const el = document.createElement(tag) as T;
  Object.assign(el, assign);
  for (const child of children) {
    el.append(child);
  }
  return el;
}
