import * as React from "react";

type SelectionLock = {
  count: number;
  previousUserSelect: string;
};

const selectionLocks = new WeakMap<Document, SelectionLock>();

function preventSelection(event: Event) {
  event.preventDefault();
}

export function useDocumentSelectionSuppression() {
  const lockedDocumentRef = React.useRef<Document | null>(null);

  const restoreSelection = React.useCallback(() => {
    const ownerDocument = lockedDocumentRef.current;
    if (!ownerDocument) return;
    lockedDocumentRef.current = null;

    const lock = selectionLocks.get(ownerDocument);
    if (!lock) return;

    lock.count -= 1;
    if (lock.count > 0) return;

    if (ownerDocument.body) {
      ownerDocument.body.style.userSelect = lock.previousUserSelect;
    }
    ownerDocument.removeEventListener("selectstart", preventSelection);
    selectionLocks.delete(ownerDocument);
  }, []);

  const suppressSelection = React.useCallback(
    (ownerDocument: Document) => {
      if (lockedDocumentRef.current === ownerDocument) return;
      restoreSelection();

      const existingLock = selectionLocks.get(ownerDocument);
      if (existingLock) {
        existingLock.count += 1;
      } else {
        selectionLocks.set(ownerDocument, {
          count: 1,
          previousUserSelect: ownerDocument.body?.style.userSelect ?? "",
        });
        if (ownerDocument.body) {
          ownerDocument.body.style.userSelect = "none";
        }
        ownerDocument.addEventListener("selectstart", preventSelection);
      }

      lockedDocumentRef.current = ownerDocument;
    },
    [restoreSelection],
  );

  React.useEffect(() => restoreSelection, [restoreSelection]);

  return { suppressSelection, restoreSelection };
}
