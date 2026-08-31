import { type RefObject, useLayoutEffect } from "react";
import { coerceFeedback, syncFeedbackAttribute } from "../feedback";
import { getCustomElementHost } from "./shadow-host";

/** Sync `data-gc-feedback="off"` on the custom-element host when feedback is disabled. */
export function useFeedbackAttribute(
  container: HTMLElement | undefined,
  rootRef: RefObject<HTMLElement | null>,
  feedbackProp: unknown,
): void {
  const enabled = coerceFeedback(feedbackProp);

  useLayoutEffect(() => {
    const root = rootRef.current;
    const host = getCustomElementHost(container, root) ?? root;
    if (!host) return;
    syncFeedbackAttribute(host, enabled);
  }, [container, rootRef, enabled]);
}
