import { type ReactNode, useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  EVENTS,
  SB_GAME_CONTROLLER_EVENTS,
  SB_GC_ANCILLARY_EVENTS,
  SB_GC_DPAD_EVENTS,
  SB_GC_FACE_EVENTS,
  SB_GC_JOYSTICK_EVENTS,
} from "../../events";
import { resolveComponentCss } from "../../lib/component-css";
import { defineOnce, defineReactElement } from "../../lib/r2wc-element";
import { getCustomElementHost, isShadowContainer } from "../../lib/shadow-host";
import { formatStoryEventLogLine } from "./story-event-log-format";

export {
  EVENTS,
  SB_GAME_CONTROLLER_EVENTS,
  SB_GC_ANCILLARY_EVENTS,
  SB_GC_DPAD_EVENTS,
  SB_GC_FACE_EVENTS,
  SB_GC_JOYSTICK_EVENTS,
};

const HOST_CLASS = "sb-event-log-host";
const TAG = "sb-event-log";

const STYLES = `
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

export type SbEventLogProps = {
  heading?: string;
  eventNames?: readonly string[];
  maxLines?: number;
  moveLogThrottleMs?: number;
  embedStage?: boolean;
  newestFirst?: boolean;
  children?: ReactNode;
  container?: HTMLElement;
};

function coerceBool(value: unknown): boolean {
  if (value === true) return true;
  if (value === false || value === undefined || value === null) return false;
  if (typeof value === "string") return value === "" || /^[ty1-9]/i.test(value);
  return Boolean(value);
}

export function SbEventLog({
  heading = "Events",
  eventNames = SB_GAME_CONTROLLER_EVENTS,
  maxLines = 100,
  moveLogThrottleMs = 48,
  embedStage,
  newestFirst,
  children,
  container,
}: SbEventLogProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [lines, setLines] = useState<string[]>([]);
  const [moveBuffered, setMoveBuffered] = useState("");
  const lastMoveLogAt = useRef(0);
  const inShadow = isShadowContainer(container);
  const css = resolveComponentCss(STYLES, HOST_CLASS, inShadow);
  const embed = coerceBool(embedStage);
  const newest = coerceBool(newestFirst);
  const names = eventNames ?? SB_GAME_CONTROLLER_EVENTS;

  const onEvent = useCallback(
    (ev: Event) => {
      if (!(ev instanceof CustomEvent)) return;
      if (ev.type === EVENTS.gcJoystick.move) {
        const now = Date.now();
        const formatted = formatStoryEventLogLine(ev);
        setMoveBuffered(formatted);
        if (now - lastMoveLogAt.current >= moveLogThrottleMs) {
          lastMoveLogAt.current = now;
          setLines((prev) => [...prev, formatted].slice(-maxLines));
        }
        return;
      }
      const line = formatStoryEventLogLine(ev);
      setLines((prev) => [...prev, line].slice(-maxLines));
    },
    [maxLines, moveLogThrottleMs],
  );

  useEffect(() => {
    const host = getCustomElementHost(container, rootRef.current);
    if (!host) return;
    const listenRoot: EventTarget = embed ? (host.closest("game-controller") ?? host) : host;
    for (const type of names) {
      listenRoot.addEventListener(type, onEvent);
    }
    return () => {
      for (const type of names) {
        listenRoot.removeEventListener(type, onEvent);
      }
    };
  }, [container, embed, names, onEvent]);

  const clear = () => {
    setLines([]);
    setMoveBuffered("");
    lastMoveLogAt.current = 0;
  };

  const tail = useMemo(() => {
    if (moveBuffered && lines[lines.length - 1] !== moveBuffered) return moveBuffered;
    return "";
  }, [moveBuffered, lines]);

  const logText = useMemo(() => {
    const ordered = newest ? [...lines].reverse() : [...lines];
    const body = ordered.join("\n");
    if (!tail) return body;
    const pending = `… pending move: ${tail}`;
    if (newest) return body ? `${pending}\n${body}` : pending;
    return body ? `${body}\n${pending}` : pending;
  }, [lines, newest, tail]);

  const panel = (
    <aside className="sb-el__panel">
      <div className="sb-el__toolbar">
        <span>{heading}</span>
        <button type="button" onClick={clear}>
          Clear
        </button>
      </div>
      {names.includes(EVENTS.gcJoystick.move) ? (
        <div className="sb-el__move-hint">
          <code>{EVENTS.gcJoystick.move}</code> lines are throttled ({moveLogThrottleMs}ms) — drag
          the stick to see sector / cardinal / clock edge events.
        </div>
      ) : null}
      <pre className="sb-el__pre" part="log">
        {logText}
      </pre>
    </aside>
  );

  return (
    <>
      <style>{css}</style>
      <div
        ref={rootRef}
        className={inShadow ? undefined : HOST_CLASS}
        style={inShadow ? { display: "contents" } : undefined}
      >
        {embed ? (
          panel
        ) : (
          <div className="sb-el">
            <div className="sb-el__demo">
              <slot>{children}</slot>
            </div>
            {panel}
          </div>
        )}
      </div>
    </>
  );
}

export interface SbEventLogElement extends HTMLElement {
  heading: string;
  eventNames: readonly string[];
  maxLines: number;
  moveLogThrottleMs: number;
  embedStage: boolean;
  newestFirst: boolean;
  readonly updateComplete: Promise<void>;
}

export const SbEventLogElement = defineReactElement<SbEventLogProps, SbEventLogElement>(
  SbEventLog,
  {
    props: {
      heading: "string",
      maxLines: "number",
      moveLogThrottleMs: "number",
      embedStage: "boolean",
      newestFirst: "boolean",
    },
    objectProps: ["eventNames"],
    emptyBooleanAttributes: ["embed-stage", "newest-first"],
  },
);

defineOnce(TAG, SbEventLogElement);
