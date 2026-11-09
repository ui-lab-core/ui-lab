import * as React from "react";
import { transitionDuration } from "@/lib/motion";

type PresenceState = "entering" | "entered" | "exiting" | "exited";

function isReducedMotion() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches === true
  );
}

/**
 * Keeps content mounted through its exit transition and guarantees that newly
 * mounted content paints its initial state before being promoted to entered.
 */
export function usePresence(
  open: boolean,
  duration: number,
  { settleExit = false, elementRef }: { settleExit?: boolean; elementRef?: React.RefObject<HTMLElement | null> } = {},
) {
  const [present, setPresent] = React.useState(false);
  const [state, setState] = React.useState<PresenceState>("exiting");

  const completeExit = React.useCallback(() => {
    if (settleExit) setState("exited");
    else setPresent(false);
  }, [settleExit]);

  // Cancel pending entry/exit work during the commit, before a frame callback
  // can restore an obsolete state after dismissal or reopening.
  React.useLayoutEffect(() => {
    let firstFrame = 0;
    let secondFrame = 0;
    let timeout = 0;
    const exitDuration = transitionDuration(elementRef?.current ?? null, duration);

    if (open) {
      if (!present) {
        setState("entering");
        setPresent(true);
      } else if (state === "exiting" || state === "exited") {
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
      if (state === "exited") {
        // The owner hides this terminal state. Commit it for a rendering
        // opportunity before removing the portal; reopening cancels both frames.
        firstFrame = window.requestAnimationFrame(() => {
          secondFrame = window.requestAnimationFrame(() => setPresent(false));
        });
      } else if (state !== "exiting") {
        setState("exiting");
      } else if (isReducedMotion() || exitDuration === 0) {
        completeExit();
      } else if (settleExit) {
        // Start the missing-event fallback only after the exit styles have had
        // a rendering opportunity, not before the CSS transition starts.
        firstFrame = window.requestAnimationFrame(() => {
          secondFrame = window.requestAnimationFrame(() => {
            timeout = window.setTimeout(completeExit, exitDuration);
          });
        });
      } else {
        timeout = window.setTimeout(completeExit, exitDuration);
      }
    }

    return () => {
      window.cancelAnimationFrame(firstFrame);
      window.cancelAnimationFrame(secondFrame);
      window.clearTimeout(timeout);
    };
  }, [completeExit, duration, elementRef, open, present, settleExit, state]);

  const finishExit = React.useCallback(() => {
    if (!open && state === "exiting") {
      completeExit();
    }
  }, [completeExit, open, state]);

  return { present, state, finishExit };
}
