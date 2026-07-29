import * as React from "react";
import { useDocumentSelectionSuppression } from "./useDocumentSelectionSuppression";

type DragSession = {
  kind: string;
  ownerDocument: Document;
  pointerId: number;
  restoreSelection: () => void;
  value: boolean;
  visited: Set<HTMLElement>;
};

let activeSession: DragSession | null = null;
let suppressClicks = new Set<HTMLElement>();
let suppressClicksTimer: ReturnType<typeof setTimeout> | undefined;

function clearClickSuppression() {
  suppressClicks.clear();
  if (suppressClicksTimer) clearTimeout(suppressClicksTimer);
  suppressClicksTimer = undefined;
}

function stopSession(event: PointerEvent) {
  if (!activeSession || activeSession.pointerId !== event.pointerId) return;

  suppressClicks = activeSession.visited;
  activeSession.restoreSelection();
  activeSession.ownerDocument.removeEventListener("pointerup", stopSession, true);
  activeSession.ownerDocument.removeEventListener("pointercancel", stopSession, true);
  activeSession = null;
  suppressClicksTimer = setTimeout(clearClickSuppression);
}

function applySession(
  root: HTMLElement,
  input: HTMLInputElement,
  session: DragSession,
  setValue?: (value: boolean) => void,
) {
  if (session.visited.has(root) || input.disabled) return;
  session.visited.add(root);

  if (input.checked === session.value) return;
  if (setValue) {
    setValue(session.value);
  } else {
    input.click();
  }
}

export function useDragToggle(
  kind: string,
  rootRef: React.RefObject<HTMLElement | null>,
  inputRef: React.RefObject<HTMLInputElement | null>,
  setValue?: (value: boolean) => void,
) {
  const { suppressSelection, restoreSelection } =
    useDocumentSelectionSuppression();

  const onPointerDownCapture = React.useCallback(
    (event: React.PointerEvent<HTMLElement>) => {
      if (event.pointerType !== "mouse" || event.button !== 0) return;

      const root = rootRef.current;
      const input = inputRef.current;
      if (!root || !input || input.disabled) return;

      clearClickSuppression();
      suppressSelection(root.ownerDocument);
      activeSession = {
        kind,
        ownerDocument: root.ownerDocument,
        pointerId: event.pointerId,
        restoreSelection,
        value: !input.checked,
        visited: new Set(),
      };

      root.ownerDocument.addEventListener("pointerup", stopSession, true);
      root.ownerDocument.addEventListener("pointercancel", stopSession, true);
      applySession(root, input, activeSession, setValue);
    },
    [
      inputRef,
      kind,
      restoreSelection,
      rootRef,
      setValue,
      suppressSelection,
    ],
  );

  const onPointerOverCapture = React.useCallback(() => {
    const root = rootRef.current;
    const input = inputRef.current;
    if (!root || !input || !activeSession || activeSession.kind !== kind) return;

    applySession(root, input, activeSession, setValue);
  }, [inputRef, kind, rootRef, setValue]);

  const onClickCapture = React.useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      const root = rootRef.current;
      if (!root || !suppressClicks.delete(root)) return;

      event.preventDefault();
      event.stopPropagation();
    },
    [rootRef],
  );

  return { onPointerDownCapture, onPointerOverCapture, onClickCapture };
}
