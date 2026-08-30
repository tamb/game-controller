/**
 * Usable screen size: the visual viewport minus header / footer / side chrome
 * (app menus, toolbars, `data-gc-chrome` bands). Used by `<game-controller scale="usable">`.
 */

/** `"usable"` (default) fills the remaining viewport; `"none"` leaves sizing to CSS only. */
export type GameControllerScale = "usable" | "none";

/** CSS custom properties written by {@link applyUsableScreenScale}. */
export const GC_USABLE_SCREEN_VARS = {
  usableHeight: "--gc-usable-height",
  usableWidth: "--gc-usable-width",
  chromeTop: "--gc-chrome-top",
  chromeRight: "--gc-chrome-right",
  chromeBottom: "--gc-chrome-bottom",
  chromeLeft: "--gc-chrome-left",
} as const;

export type UsableScreenInsets = {
  top: number;
  right: number;
  bottom: number;
  left: number;
};

export type UsableScreenSize = {
  width: number;
  height: number;
  chrome: UsableScreenInsets;
};

export type RectLike = {
  top: number;
  right: number;
  bottom: number;
  left: number;
};

export type UsableScreenViewport = {
  width: number;
  height: number;
  offsetTop?: number;
  offsetLeft?: number;
};

/**
 * Header / footer / side chrome: a pixel size, a CSS selector, or an element
 * outside the controller. Numbers are CSS pixels reserved on that edge.
 */
export type UsableScreenChromeSource = Element | string | number | null | undefined;

export type MeasureUsableScreenOptions = {
  header?: UsableScreenChromeSource;
  footer?: UsableScreenChromeSource;
  start?: UsableScreenChromeSource;
  end?: UsableScreenChromeSource;
  inset?: Partial<UsableScreenInsets>;
  root?: ParentNode | null;
  viewport?: UsableScreenViewport;
};

const HEADER_MARK = '[data-gc-chrome="header"], [data-gc-chrome="top"]';
const FOOTER_MARK = '[data-gc-chrome="footer"], [data-gc-chrome="bottom"]';
const START_MARK = '[data-gc-chrome="start"], [data-gc-chrome="left"]';
const END_MARK = '[data-gc-chrome="end"], [data-gc-chrome="right"]';

/**
 * Resolves `scale` / `scale` attribute. Empty or unknown values are usable
 * (same default as omitting the attribute). `"none"` / `"false"` / `"0"` / `"off"` disable JS fit.
 */
export function resolveGameControllerScale(value: string | null | undefined): GameControllerScale {
  if (value == null) return "usable";
  const normalized = String(value).trim().toLowerCase();
  if (normalized === "" || normalized === "usable" || normalized === "true") return "usable";
  if (
    normalized === "none" ||
    normalized === "false" ||
    normalized === "0" ||
    normalized === "off"
  ) {
    return "none";
  }
  return "usable";
}

/** Parses a chrome prop (`"48"`, `"48px"`, selector, or element). */
export function parseUsableScreenChromeSource(
  value: unknown,
): Exclude<UsableScreenChromeSource, undefined> {
  if (value instanceof Element) return value;
  if (typeof value === "number" && Number.isFinite(value)) return Math.max(0, value);
  if (typeof value === "string") {
    const trimmed = value.trim();
    if (!trimmed) return null;
    if (/^\d+(\.\d+)?(px)?$/i.test(trimmed)) return Math.max(0, Number.parseFloat(trimmed));
    return trimmed;
  }
  return null;
}

export function readVisualViewportSize(
  win: Window = globalThis as unknown as Window,
): UsableScreenViewport {
  const vv = win.visualViewport;
  if (vv && Number.isFinite(vv.width) && Number.isFinite(vv.height)) {
    return {
      width: vv.width,
      height: vv.height,
      offsetTop: vv.offsetTop,
      offsetLeft: vv.offsetLeft,
    };
  }
  const doc = win.document?.documentElement;
  return {
    width: win.innerWidth || doc?.clientWidth || 0,
    height: win.innerHeight || doc?.clientHeight || 0,
    offsetTop: 0,
    offsetLeft: 0,
  };
}

function asRect(source: Element): RectLike {
  const box = source.getBoundingClientRect();
  return { top: box.top, right: box.right, bottom: box.bottom, left: box.left };
}

function isOutsideHost(el: Element, host: Element): boolean {
  return el !== host && !host.contains(el);
}

function queryOutside(root: ParentNode, selector: string, host: Element): Element | null {
  const matches = root.querySelectorAll(selector);
  for (const el of matches) {
    if (isOutsideHost(el, host)) return el;
  }
  return null;
}

function siblingAlong(
  host: Element,
  direction: "previousElementSibling" | "nextElementSibling",
  test: (el: Element) => boolean,
): Element | null {
  let node: Element | null = host[direction];
  while (node) {
    if (test(node) && isOutsideHost(node, host)) return node;
    node = node[direction];
  }
  return null;
}

function isHeaderChrome(el: Element): boolean {
  const tag = el.tagName;
  if (tag === "HEADER") return true;
  const role = el.getAttribute("role");
  return role === "banner" || el.matches(HEADER_MARK);
}

function isFooterChrome(el: Element): boolean {
  const tag = el.tagName;
  if (tag === "FOOTER") return true;
  const role = el.getAttribute("role");
  return role === "contentinfo" || el.matches(FOOTER_MARK);
}

function resolveChromeElement(
  source: UsableScreenChromeSource,
  host: Element,
  root: ParentNode,
  auto: {
    mark: string;
    sibling?: "previousElementSibling" | "nextElementSibling";
    siblingTest?: (el: Element) => boolean;
  },
): Element | number | null {
  if (typeof source === "number" && Number.isFinite(source)) return Math.max(0, source);
  if (source instanceof Element) return isOutsideHost(source, host) ? source : null;
  if (typeof source === "string") {
    const parsed = parseUsableScreenChromeSource(source);
    if (typeof parsed === "number") return parsed;
    if (typeof parsed === "string") {
      const found = queryOutside(root, parsed, host);
      if (found) return found;
    }
  }

  const marked = queryOutside(root, auto.mark, host);
  if (marked) return marked;
  if (auto.sibling && auto.siblingTest) {
    const sib = siblingAlong(host, auto.sibling, auto.siblingTest);
    if (sib) return sib;
  }
  return null;
}

/**
 * Pure geometry: remaining visual viewport after header / footer / side chrome.
 * In-flow chrome above the host is also implied by `host.top` (no double-count).
 */
export function computeUsableScreen(input: {
  host: RectLike;
  viewport: UsableScreenViewport;
  header?: RectLike | number | null;
  footer?: RectLike | number | null;
  start?: RectLike | number | null;
  end?: RectLike | number | null;
  inset?: Partial<UsableScreenInsets>;
}): UsableScreenSize {
  const vy = input.viewport.offsetTop ?? 0;
  const vx = input.viewport.offsetLeft ?? 0;
  const extra: UsableScreenInsets = {
    top: input.inset?.top ?? 0,
    right: input.inset?.right ?? 0,
    bottom: input.inset?.bottom ?? 0,
    left: input.inset?.left ?? 0,
  };

  const headerReserve =
    typeof input.header === "number"
      ? Math.max(0, input.header)
      : input.header
        ? Math.max(0, input.header.bottom - vy)
        : 0;
  const footerReserve =
    typeof input.footer === "number"
      ? Math.max(0, input.footer)
      : input.footer
        ? Math.max(0, vy + input.viewport.height - input.footer.top)
        : 0;
  const startReserve =
    typeof input.start === "number"
      ? Math.max(0, input.start)
      : input.start
        ? Math.max(0, input.start.right - vx)
        : 0;
  const endReserve =
    typeof input.end === "number"
      ? Math.max(0, input.end)
      : input.end
        ? Math.max(0, vx + input.viewport.width - input.end.left)
        : 0;

  const top = Math.max(0, input.host.top - vy, headerReserve, extra.top);
  const bottom = Math.max(0, footerReserve, extra.bottom);
  const left = Math.max(0, input.host.left - vx, startReserve, extra.left);
  const right = Math.max(0, endReserve, extra.right);

  return {
    width: Math.max(0, input.viewport.width - left - right),
    height: Math.max(0, input.viewport.height - top - bottom),
    chrome: { top, right, bottom, left },
  };
}

function toComputeChrome(resolved: Element | number | null): RectLike | number | null {
  if (typeof resolved === "number") return resolved;
  if (resolved) return asRect(resolved);
  return null;
}

/** Measures the host against the visual viewport and any header / footer chrome. */
export function measureUsableScreen(
  host: Element,
  options: MeasureUsableScreenOptions = {},
): UsableScreenSize {
  const root = options.root ?? host.ownerDocument ?? document;
  const viewport =
    options.viewport ?? readVisualViewportSize(host.ownerDocument?.defaultView ?? window);

  const header = resolveChromeElement(options.header, host, root, {
    mark: HEADER_MARK,
    sibling: "previousElementSibling",
    siblingTest: isHeaderChrome,
  });
  const footer = resolveChromeElement(options.footer, host, root, {
    mark: FOOTER_MARK,
    sibling: "nextElementSibling",
    siblingTest: isFooterChrome,
  });
  const start = resolveChromeElement(options.start, host, root, { mark: START_MARK });
  const end = resolveChromeElement(options.end, host, root, { mark: END_MARK });

  return computeUsableScreen({
    host: asRect(host),
    viewport,
    header: toComputeChrome(header),
    footer: toComputeChrome(footer),
    start: toComputeChrome(start),
    end: toComputeChrome(end),
    inset: options.inset,
  });
}

/** Writes `--gc-usable-*` and `--gc-chrome-*` on the host. Skips zero-sized viewports. */
export function applyUsableScreenScale(
  host: HTMLElement,
  options?: MeasureUsableScreenOptions,
): UsableScreenSize {
  const size = measureUsableScreen(host, options);
  if (size.height > 0) {
    host.style.setProperty(GC_USABLE_SCREEN_VARS.usableHeight, `${size.height}px`);
  }
  if (size.width > 0) {
    host.style.setProperty(GC_USABLE_SCREEN_VARS.usableWidth, `${size.width}px`);
  }
  host.style.setProperty(GC_USABLE_SCREEN_VARS.chromeTop, `${size.chrome.top}px`);
  host.style.setProperty(GC_USABLE_SCREEN_VARS.chromeRight, `${size.chrome.right}px`);
  host.style.setProperty(GC_USABLE_SCREEN_VARS.chromeBottom, `${size.chrome.bottom}px`);
  host.style.setProperty(GC_USABLE_SCREEN_VARS.chromeLeft, `${size.chrome.left}px`);
  return size;
}

export function clearUsableScreenScale(host: HTMLElement): void {
  host.style.removeProperty(GC_USABLE_SCREEN_VARS.usableHeight);
  host.style.removeProperty(GC_USABLE_SCREEN_VARS.usableWidth);
  host.style.removeProperty(GC_USABLE_SCREEN_VARS.chromeTop);
  host.style.removeProperty(GC_USABLE_SCREEN_VARS.chromeRight);
  host.style.removeProperty(GC_USABLE_SCREEN_VARS.chromeBottom);
  host.style.removeProperty(GC_USABLE_SCREEN_VARS.chromeLeft);
}

/**
 * Keeps usable-screen tokens in sync with viewport and chrome resizes.
 * No-ops while the host is fullscreen (`:host(:fullscreen)` fills the screen).
 */
export function subscribeUsableScreenScale(
  host: HTMLElement,
  options?: MeasureUsableScreenOptions,
): () => void {
  const apply = () => {
    if (typeof document !== "undefined" && document.fullscreenElement === host) {
      clearUsableScreenScale(host);
      return;
    }
    applyUsableScreenScale(host, options);
  };

  apply();

  const win = host.ownerDocument?.defaultView ?? window;
  const doc = host.ownerDocument ?? document;
  const vv = win.visualViewport;

  win.addEventListener("resize", apply);
  win.addEventListener("orientationchange", apply);
  doc.addEventListener("fullscreenchange", apply);
  vv?.addEventListener("resize", apply);
  vv?.addEventListener("scroll", apply);

  const ro = typeof ResizeObserver !== "undefined" ? new ResizeObserver(apply) : null;
  ro?.observe(host);
  if (doc.documentElement) ro?.observe(doc.documentElement);
  if (doc.body) ro?.observe(doc.body);

  return () => {
    win.removeEventListener("resize", apply);
    win.removeEventListener("orientationchange", apply);
    doc.removeEventListener("fullscreenchange", apply);
    vv?.removeEventListener("resize", apply);
    vv?.removeEventListener("scroll", apply);
    ro?.disconnect();
    clearUsableScreenScale(host);
  };
}
