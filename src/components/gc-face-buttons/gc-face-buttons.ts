import { css, html, LitElement, unsafeCSS } from "lit";
import type { GameControllerActionKey } from "../../events";
import { EVENTS } from "../../events";
import {
  gameControllerFaceButtonLabels,
  gcFaceButtonsInnerClass,
} from "../game-controller/game-controller-layout";
import styles from "./gc-face-buttons.css?raw";

export type GcFacePressDetail = {
  controller: GcFaceButtonsElement;
  button: GameControllerActionKey;
};

const TAG = "gc-face-buttons";

export class GcFaceButtonsElement extends LitElement {
  static styles = css`
    ${unsafeCSS(styles)}
  `;

  static properties = {
    actions: { type: Number },
  };

  /** Number of face buttons: `2` or `4`. */
  actions = 2;

  private emitFace(button: GameControllerActionKey) {
    this.dispatchEvent(
      new CustomEvent<GcFacePressDetail>(EVENTS.gcFace[button], {
        detail: { controller: this, button },
        bubbles: true,
        composed: true,
      }),
    );
  }

  render() {
    const labels = gameControllerFaceButtonLabels(this.actions);
    const cls = gcFaceButtonsInnerClass(this.actions);

    return html`
      <div class="${cls}" part="actions">
        ${labels.map(
          (key, i) => html`
            <button
              type="button"
              class="gcface__btn gcface__btn--${i + 1}"
              part="btn-${key}"
              @click=${() => this.emitFace(key)}
            >
              ${key.toUpperCase()}
            </button>
          `,
        )}
      </div>
    `;
  }
}

if (!customElements.get(TAG)) {
  customElements.define(TAG, GcFaceButtonsElement);
}
