import { css, html, LitElement, unsafeCSS } from "lit";
import { EVENTS } from "../../events";
import styles from "./gc-dpad.css?raw";

export type GcDpadDirection = "up" | "down" | "left" | "right";

export type GcDpadPressDetail = {
  controller: GcDpadElement;
  direction: GcDpadDirection;
};

export class GcDpadElement extends LitElement {
  static styles = css`
    ${unsafeCSS(styles)}
  `;

  private emitDirection(direction: GcDpadDirection) {
    this.dispatchEvent(
      new CustomEvent<GcDpadPressDetail>(EVENTS.gcDpad[direction], {
        detail: { controller: this, direction },
        bubbles: true,
        composed: true,
      }),
    );
  }

  render() {
    return html`
      <div class="gcdpad" part="base">
        <button
          type="button"
          class="gcdpad__btn gcdpad__btn--up"
          aria-label="Up"
          part="btn-up"
          @click=${() => this.emitDirection("up")}
        ></button>
        <button
          type="button"
          class="gcdpad__btn gcdpad__btn--left"
          aria-label="Left"
          part="btn-left"
          @click=${() => this.emitDirection("left")}
        ></button>
        <button
          type="button"
          class="gcdpad__btn gcdpad__btn--right"
          aria-label="Right"
          part="btn-right"
          @click=${() => this.emitDirection("right")}
        ></button>
        <button
          type="button"
          class="gcdpad__btn gcdpad__btn--down"
          aria-label="Down"
          part="btn-down"
          @click=${() => this.emitDirection("down")}
        ></button>
      </div>
    `;
  }
}

const DPAD_TAG = "gc-dpad";

if (!customElements.get(DPAD_TAG)) {
  customElements.define(DPAD_TAG, GcDpadElement);
}
