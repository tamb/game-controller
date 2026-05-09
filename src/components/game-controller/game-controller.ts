import { css, html, LitElement, unsafeCSS } from "lit";
import type { GameControllerActionKey } from "../../events";
import { EVENTS } from "../../events";
import "../gc-ancillary-buttons/gc-ancillary-buttons";
import "../gc-dpad/gc-dpad";
import "../gc-face-buttons/gc-face-buttons";
import "../gc-joystick/gc-joystick";
import styleText from "./game-controller.css?raw";

export type GameControllerHooks = Record<string, (controller: GameControllerElement) => void>;

export type GameControllerLeftControl = "dpad" | "joystick";

export class GameControllerElement extends LitElement {
  static styles = css`
    ${unsafeCSS(styleText)}
  `;

  static properties = {
    actions: { type: Number },
    vibrate: { type: Boolean },
    hooks: { type: Object, attribute: false },
    /** Left-hand control: directional pad or analog stick (`left-control` attribute). */
    leftControl: { type: String, attribute: "left-control" },
  };

  /** Number of face buttons: `2` or `4`. */
  actions = 2;

  vibrate = true;

  /** `"dpad"` (default) or `"joystick"`. Unknown values fall back to d-pad. */
  leftControl: GameControllerLeftControl = "dpad";

  /** Optional callbacks keyed by control name (e.g. `select`, `a`). Not reflected as attributes. */
  hooks: GameControllerHooks = {};

  override connectedCallback(): void {
    super.connectedCallback();
    document.addEventListener("fullscreenchange", this.onFullscreenChange);
  }

  override disconnectedCallback(): void {
    document.removeEventListener("fullscreenchange", this.onFullscreenChange);
    super.disconnectedCallback();
  }

  private readonly onFullscreenChange = () => {
    this.requestUpdate();
  };

  private emit(name: string, data: Record<string, unknown> = {}) {
    this.dispatchEvent(
      new CustomEvent(name, {
        detail: {
          ...data,
          controller: this,
        },
        bubbles: true,
        composed: true,
      }),
    );
  }

  private handleAncillary(refName: string, eventName: string) {
    if (this.vibrate) {
      navigator.vibrate?.(10);
    }
    this.hooks[refName]?.(this);
    this.emit(eventName);
  }

  private readonly onGcAncillaryFullscreen = () => {
    this.handleAncillary("fullscreen", EVENTS.gameController.ancillary.fullscreen);
    void this.toggleFullscreen();
  };

  private readonly onGcAncillarySelect = () => {
    this.handleAncillary("select", EVENTS.gameController.ancillary.select);
  };

  private readonly onGcAncillaryStart = () => {
    this.handleAncillary("start", EVENTS.gameController.ancillary.start);
  };

  private async toggleFullscreen() {
    try {
      if (document.fullscreenElement === this) {
        await document.exitFullscreen();
      } else {
        await this.requestFullscreen();
      }
    } catch {
      /* unsupported or denied */
    }
    this.requestUpdate();
  }

  private handleAction(buttonKey: GameControllerActionKey) {
    if (this.vibrate) {
      navigator.vibrate?.(10);
    }
    this.hooks[buttonKey]?.(this);
    this.emit(EVENTS.gameController.action[buttonKey]);
  }

  private get leftStickMode(): GameControllerLeftControl {
    return this.leftControl === "joystick" ? "joystick" : "dpad";
  }

  private dpadTemplate() {
    return html`
      <gc-dpad
        @gcdpad:up=${() => this.handleAncillary("up", EVENTS.gameController.dpad.up)}
        @gcdpad:left=${() => this.handleAncillary("left", EVENTS.gameController.dpad.left)}
        @gcdpad:right=${() => this.handleAncillary("right", EVENTS.gameController.dpad.right)}
        @gcdpad:down=${() => this.handleAncillary("down", EVENTS.gameController.dpad.down)}
      ></gc-dpad>
    `;
  }

  private joystickTemplate() {
    return html`<gc-joystick></gc-joystick>`;
  }

  render() {
    return html`
      <div class="gamecontroller__shell">
        <div class="gamecontroller__container">
          <div class="gamecontroller__center">
            <div class="gamecontroller__stage">
              <slot name="stage"></slot>
            </div>
            <div class="gamecontroller__ancillaries">
              <gc-ancillary-buttons
                @gcancillary:fullscreen=${this.onGcAncillaryFullscreen}
                @gcancillary:select=${this.onGcAncillarySelect}
                @gcancillary:start=${this.onGcAncillaryStart}
              ></gc-ancillary-buttons>
            </div>
          </div>
          <div class="gamecontroller__main-controls">
            <div class="gamecontroller__d-pad-container">
              ${this.leftStickMode === "joystick" ? this.joystickTemplate() : this.dpadTemplate()}
            </div>
            <div class="gamecontroller__actions">
              <gc-face-buttons
                .actions=${this.actions}
                @gcface:a=${() => this.handleAction("a")}
                @gcface:b=${() => this.handleAction("b")}
                @gcface:x=${() => this.handleAction("x")}
                @gcface:y=${() => this.handleAction("y")}
              ></gc-face-buttons>
            </div>
          </div>
        </div>
      </div>
    `;
  }
}
