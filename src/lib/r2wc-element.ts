import type { R2WCOptions } from "@r2wc/core";
import r2wc from "@r2wc/core";
import { type ComponentType, createElement } from "react";
import { createRoot, type Root } from "react-dom/client";

type Ctx<P> = { root: Root; Component: ComponentType<P> };

const renderSymbol = Symbol.for("r2wc.render");
const propsSymbol = Symbol.for("r2wc.props");

type R2wcInstance = HTMLElement & {
  [renderSymbol]: () => void;
  [propsSymbol]: Record<string, unknown>;
};

export type ReactWebComponentClass<El extends HTMLElement> = {
  new (): El;
  prototype: El;
};

export type DefineReactElementOptions<P extends { container?: HTMLElement }> = R2WCOptions<P> & {
  /** Property names stored as raw JS values (objects / functions), not attribute transforms. */
  objectProps?: string[];
  /** Attributes that should treat the HTML empty-boolean form (`emit-cardinal`) as `true`. */
  emptyBooleanAttributes?: string[];
};

function flushRender(): Promise<void> {
  return new Promise((resolve) => {
    queueMicrotask(() => {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          queueMicrotask(resolve);
        });
      });
    });
  });
}

function promoteEmptyBooleanAttributes(el: HTMLElement, attrs: readonly string[]): void {
  for (const attr of attrs) {
    if (el.hasAttribute(attr) && el.getAttribute(attr) === "") {
      el.setAttribute(attr, "true");
    }
  }
}

/**
 * Wraps a React component with `@r2wc/core` (open shadow root) and adds Lit-like
 * `updateComplete` plus support for object properties and empty boolean attributes.
 */
export function defineReactElement<P extends { container?: HTMLElement }, El extends HTMLElement>(
  Component: ComponentType<P>,
  options: DefineReactElementOptions<P> = {},
): ReactWebComponentClass<El> {
  const { objectProps = [], emptyBooleanAttributes = [], ...r2wcOptions } = options;

  const Base = r2wc<P, Ctx<P>>(
    Component,
    { shadow: "open", ...r2wcOptions },
    {
      mount(container, ReactComponent, props) {
        const root = createRoot(container as unknown as Element);
        root.render(createElement(ReactComponent, props));
        return { root, Component: ReactComponent };
      },
      update({ root, Component: ReactComponent }, props) {
        root.render(createElement(ReactComponent, props));
      },
      unmount({ root }) {
        root.unmount();
      },
    },
  );

  class ReactWebComponent extends Base {
    get updateComplete(): Promise<void> {
      return flushRender();
    }

    connectedCallback(): void {
      promoteEmptyBooleanAttributes(this, emptyBooleanAttributes);
      (Base.prototype as unknown as { connectedCallback: () => void }).connectedCallback.call(this);
    }
  }

  for (const name of objectProps) {
    Object.defineProperty(ReactWebComponent.prototype, name, {
      enumerable: true,
      configurable: true,
      get(this: R2wcInstance) {
        return this[propsSymbol][name];
      },
      set(this: R2wcInstance, value: unknown) {
        this[propsSymbol][name] = value;
        this[renderSymbol]();
      },
    });
  }

  return ReactWebComponent as unknown as ReactWebComponentClass<El>;
}

export function defineOnce(tag: string, ctor: CustomElementConstructor): void {
  if (typeof customElements === "undefined") return;
  if (!customElements.get(tag)) {
    customElements.define(tag, ctor);
  }
}
