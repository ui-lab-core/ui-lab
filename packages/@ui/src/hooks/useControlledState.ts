import * as React from "react";

export function useControlledState<T>(
  controlled: T | undefined,
  initial: T | undefined,
  fallback: T,
) {
  const [internal, setInternal] = React.useState<T>(() => controlled ?? initial ?? fallback);
  const isControlled = controlled !== undefined;

  React.useEffect(() => {
    if (isControlled) setInternal(controlled as T);
  }, [controlled, isControlled]);

  return [isControlled ? (controlled as T) : internal, setInternal, isControlled] as const;
}
