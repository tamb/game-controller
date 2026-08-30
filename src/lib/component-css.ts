/** Rewrite `:host` / `:host(...)` so the same stylesheet works on a class wrapper. */
export function cssForClassHost(raw: string, hostClass: string): string {
  const cls = hostClass.startsWith(".") ? hostClass : `.${hostClass}`;
  return raw.replace(/:host(\([^)]+\))?/g, (_, sel: string | undefined) =>
    sel ? `${cls}${sel.slice(1, -1)}` : cls,
  );
}

export function resolveComponentCss(raw: string, hostClass: string, inShadowHost: boolean): string {
  return inShadowHost ? raw : cssForClassHost(raw, hostClass);
}
