import * as React from "react";

export type PresenceState = "entering" | "entered" | "exiting";

function isReducedMotion() {
  return typeof window !== "undefined"
    && window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches === true;
}

/**
 * Keeps content mounted through its exit transition and guarantees that newly
 * mounted content paints its initial state before being promoted to entered.
 */
export function usePresence(open: boolean, duration: number) {
  const [present, setPresent] = React.useState(false);
  const [state, setState] = React.useState<PresenceState>("exiting");

  React.useEffect(() => {
    let firstFrame = 0;
    let secondFrame = 0;
    let timeout = 0;

    if (open) {
      if (!present) {
        setState("entering");
        setPresent(true);
      } else if (state === "exiting") {
        // Reversing an in-progress exit should transition from its current
        // computed value instead of restarting from the hidden state.
        setState("entered");
      } else if (state === "entering") {
        if (isReducedMotion()) {
          setState("entered");
        } else {
          // A single animation frame may still run before the browser paints.
          // Two frames guarantee the entering styles have been committed once.
          firstFrame = window.requestAnimationFrame(() => {
            secondFrame = window.requestAnimationFrame(() => {
              setState("entered");
            });
          });
        }
      }
    } else if (present) {
      if (state !== "exiting") {
        setState("exiting");
      } else if (isReducedMotion()) {
        setPresent(false);
      } else {
        // transitionend is authoritative. This covers interrupted/missing
        // events and stays synchronized with the CSS duration.
        timeout = window.setTimeout(() => setPresent(false), duration);
      }
    }

    return () => {
      window.cancelAnimationFrame(firstFrame);
      window.cancelAnimationFrame(secondFrame);
      window.clearTimeout(timeout);
    };
  }, [duration, open, present, state]);

  const finishExit = React.useCallback(() => {
    if (!open && state === "exiting") {
      setPresent(false);
    }
  }, [open, state]);

  return { present, state, finishExit };
}
