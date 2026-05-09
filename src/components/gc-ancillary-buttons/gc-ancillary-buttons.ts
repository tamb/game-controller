import { css, html, LitElement, unsafeCSS } from "lit";
import { EVENTS } from "../../events";
import styles from "./gc-ancillary-buttons.css?raw";

export type GcAncillaryId = keyof typeof EVENTS.gcAncillary;

export type GcAncillaryPressDetail = {
  controller: GcAncillaryButtonsElement;
  id: GcAncillaryId;
};

const TAG = "gc-ancillary-buttons";

export class GcAncillaryButtonsElement extends LitElement {
  static styles = css`
    ${unsafeCSS(styles)}
  `;

  private emitPress(id: GcAncillaryId) {
    this.dispatchEvent(
      new CustomEvent<GcAncillaryPressDetail>(EVENTS.gcAncillary[id], {
        detail: { controller: this, id },
        bubbles: true,
        composed: true,
      }),
    );
  }

  render() {
    return html`
      <div class="gcancillary" part="row">
        <button
          type="button"
          class="gcancillary__btn"
          part="btn-fullscreen"
          id="fullscreen"
          @click=${() => this.emitPress("fullscreen")}
        >
          fullscreen
        </button>
        <button
          type="button"
          class="gcancillary__btn"
          part="btn-select"
          @click=${() => this.emitPress("select")}
        >
          select
        </button>
        <button
          type="button"
          class="gcancillary__btn"
          part="btn-start"
          @click=${() => this.emitPress("start")}
        >
          start
        </button>
      </div>
    `;
  }
}

if (!customElements.get(TAG)) {
  customElements.define(TAG, GcAncillaryButtonsElement);
}
