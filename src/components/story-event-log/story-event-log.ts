import { css, html, LitElement } from "lit";
import {
  EVENTS,
  SB_GAME_CONTROLLER_EVENTS,
  SB_GC_ANCILLARY_EVENTS,
  SB_GC_DPAD_EVENTS,
  SB_GC_FACE_EVENTS,
  SB_GC_JOYSTICK_EVENTS,
} from "../../events";
import { formatStoryEventLogLine } from "./story-event-log-format";

export {
  EVENTS,
  SB_GAME_CONTROLLER_EVENTS,
  SB_GC_ANCILLARY_EVENTS,
  SB_GC_DPAD_EVENTS,
  SB_GC_FACE_EVENTS,
  SB_GC_JOYSTICK_EVENTS,
};

const TAG = "sb-event-log";

export class SbEventLogElement extends LitElement {
  static styles = css`
    :host {
      display: block;
      width: 100%;
      box-sizing: border-box;
      font-family: system-ui, sans-serif;
    }

    :host([embed-stage]) {
      display: flex;
      flex-direction: column;
      flex: 1 1 auto;
      min-height: 0;
    }

    .sb-el {
      display: grid;
      grid-template-columns: minmax(220px, 1fr) minmax(280px, 1.1fr);
      gap: 1rem;
      align-items: start;
      width: 100%;
      max-width: 960px;
      margin: 0 auto;
      padding: 0.5rem;
    }

    @media (max-width: 700px) {
      .sb-el {
        grid-template-columns: 1fr;
      }
    }

    .sb-el__demo {
      min-height: 120px;
    }

    .sb-el__panel {
      border: 1px solid #334155;
      border-radius: 8px;
      background: #0f172a;
      color: #e2e8f0;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      max-height: min(70vh, 420px);
    }

    :host([embed-stage]) .sb-el__panel {
      flex: 1 1 auto;
      min-height: 0;
      max-height: none;
      border-radius: 0;
      border-width: 0;
    }

    .sb-el__toolbar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 0.5rem;
      padding: 0.35rem 0.6rem;
      background: #1e293b;
      border-bottom: 1px solid #334155;
      font-size: 0.8rem;
    }

    .sb-el__toolbar button {
      cursor: pointer;
      border-radius: 4px;
      border: 1px solid #475569;
      background: #334155;
      color: #f8fafc;
      padding: 0.2rem 0.5rem;
      font-size: 0.75rem;
    }

    .sb-el__pre {
      margin: 0;
      padding: 0.5rem 0.65rem;
      overflow: auto;
      min-height: 0;
      font-size: 11px;
      line-height: 1.35;
      white-space: pre-wrap;
      word-break: break-word;
      flex: 1;
    }

    .sb-el__move-hint {
      font-size: 0.7rem;
      opacity: 0.85;
      padding: 0 0.6rem 0.35rem;
    }
  `;

  static properties = {
    heading: { type: String },
    eventNames: { type: Array, attribute: false },
    maxLines: { type: Number },
    /** Minimum ms between logging consecutive move lines (`EVENTS.gcJoystick.move`) */
    moveLogThrottleMs: { type: Number, attribute: false },
    /** Listen on nearest `<game-controller>` (for `slot="stage"`); omits side-by-side demo grid. */
    embedStage: { type: Boolean, reflect: true, attribute: "embed-stage" },
  };

  heading = "Events";

  eventNames: readonly string[] = SB_GAME_CONTROLLER_EVENTS;

  maxLines = 100;

  moveLogThrottleMs = 48;

  embedStage = false;

  private lines: string[] = [];

  private eventListenRoot: EventTarget | null = null;

  private moveBuffered = "";

  private lastMoveLogAt = 0;

  private readonly onEvent = (ev: Event) => {
    if (!(ev instanceof CustomEvent)) return;
    let line: string;
    if (ev.type === EVENTS.gcJoystick.move) {
      const now = Date.now();
      this.moveBuffered = formatStoryEventLogLine(ev);
      if (now - this.lastMoveLogAt >= this.moveLogThrottleMs) {
        this.lastMoveLogAt = now;
        line = this.moveBuffered;
      } else {
        this.requestUpdate();
        return;
      }
    } else {
      line = formatStoryEventLogLine(ev);
    }
    this.lines = [...this.lines, line].slice(-this.maxLines);
    this.requestUpdate();
  };

  private clear = () => {
    this.lines = [];
    this.moveBuffered = "";
    this.lastMoveLogAt = 0;
    this.requestUpdate();
  };

  private listenRoot(): EventTarget {
    if (this.embedStage) {
      return this.closest("game-controller") ?? this;
    }
    return this;
  }

  private attachEventListeners() {
    this.detachEventListeners();
    this.eventListenRoot = this.listenRoot();
    for (const type of this.eventNames) {
      this.eventListenRoot.addEventListener(type, this.onEvent);
    }
  }

  private detachEventListeners() {
    if (!this.eventListenRoot) return;
    for (const type of this.eventNames) {
      this.eventListenRoot.removeEventListener(type, this.onEvent);
    }
    this.eventListenRoot = null;
  }

  override connectedCallback() {
    super.connectedCallback();
    this.attachEventListeners();
  }

  override disconnectedCallback() {
    this.detachEventListeners();
    super.disconnectedCallback();
  }

  private panelTemplate(tail: string) {
    return html`
      <aside class="sb-el__panel">
        <div class="sb-el__toolbar">
          <span>${this.heading}</span>
          <button type="button" @click=${this.clear}>Clear</button>
        </div>
        ${
          this.eventNames.includes(EVENTS.gcJoystick.move)
            ? html`<div class="sb-el__move-hint">
              <code>${EVENTS.gcJoystick.move}</code> lines are throttled (${this.moveLogThrottleMs}ms) —
              drag the stick to see sector / cardinal / clock edge events.
            </div>`
            : null
        }
        <pre class="sb-el__pre" part="log">${this.lines.join("\n")}${tail ? `\n… pending move: ${tail}` : ""}</pre>
      </aside>
    `;
  }

  render() {
    const tail =
      this.moveBuffered && this.lines[this.lines.length - 1] !== this.moveBuffered
        ? this.moveBuffered
        : "";
    if (this.embedStage) {
      return this.panelTemplate(tail);
    }
    return html`
      <div class="sb-el">
        <div class="sb-el__demo">
          <slot></slot>
        </div>
        ${this.panelTemplate(tail)}
      </div>
    `;
  }
}

if (!customElements.get(TAG)) {
  customElements.define(TAG, SbEventLogElement);
}
