import * as React from "react"

export function useMergeRefs<T = any>(
  ...refs: Array<React.Ref<T> | undefined>
): React.RefCallback<T> {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return React.useCallback((value: T | null) => {
    for (const ref of refs) {
      if (!ref) continue
      if (typeof ref === "function") {
        ref(value)
      } else {
        (ref as React.MutableRefObject<T | null>).current = value
      }
    }
  }, refs)
}
