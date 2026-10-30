import * as React from "react";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { useMergeRefs } from "@/hooks/useMergeRefs";
import { Input, type InputProps } from "../Input";
import css from "./Command.module.css";
import { useCommandContext } from "./Command.shared";

/**
 * Input props forwarded to the underlying Input component. Command manages the
 * value when value is omitted and supplies search defaults for its icon,
 * clear action, placeholder, and accessible name.
 */
export interface CommandInputProps extends InputProps {}

/** Search input connected to the nearest Command or Command.Root context. */
export const CommandInput = React.forwardRef<HTMLInputElement, CommandInputProps>(
  (
    {
      value: externalValue,
      onChange: externalOnChange,
      onBlur: externalOnBlur,
      icon,
      actions,
      styles: inputComponentStyles,
      placeholder = "Search...",
      autoFocus,
      ...props
    },
    ref,
  ) => {
    const {
      isOpen,
      close,
      surfaceRef,
      pointerRef,
      searchInputRef,
      dismissOnBlur,
      searchValue,
      setSearchValue,
      styles,
    } = useCommandContext();
    const value = externalValue !== undefined ? externalValue : searchValue;
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setSearchValue(event.target.value);
      externalOnChange?.(event);
    };
    const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
      externalOnBlur?.(event);
      if (!dismissOnBlur || pointerRef.current) return;
      const next = event.relatedTarget;
      if (next instanceof Node && surfaceRef.current?.contains(next)) return;
      queueMicrotask(() => {
        const input = searchInputRef.current;
        const ownerDocument = input?.ownerDocument;
        if (!input || !ownerDocument?.hasFocus() || pointerRef.current) return;
        const activeElement = ownerDocument.activeElement;
        if (
          activeElement === null ||
          activeElement === ownerDocument.body ||
          activeElement === ownerDocument.documentElement
        )
          close();
      });
    };
    const inputRef = useMergeRefs(ref, searchInputRef);
    React.useLayoutEffect(() => {
      if (autoFocus ?? isOpen) searchInputRef.current?.focus({ preventScroll: true });
    }, [autoFocus, isOpen, searchInputRef]);
    const usesDefaultClearAction = actions === undefined;
    const resolvedActions = actions ?? [
      {
        icon: <>✕</>,
        title: "Clear search",
        onClick: () => {
          setSearchValue("");
        },
      },
    ];
    const inputStyles = cn(css.input, usesDefaultClearAction && !value && css["input-empty"], styles["input.root"]);
    return (
      <div className={cn("search", css.search, styles["search.root"])} data-slot="search">
        <Input
          ref={inputRef}
          state={{ value: value as string }}
          onChange={handleChange}
          onBlur={handleBlur}
          variant="ghost"
          icon={icon ?? <Search className="w-4 h-4" />}
          actions={resolvedActions}
          placeholder={placeholder}
          aria-label="Search commands"
          styles={{
            ...inputComponentStyles,
            root: cn(inputStyles, inputComponentStyles?.root),
          }}
          {...props}
          data-slot="input"
        />
      </div>
    );
  },
);

CommandInput.displayName = "Command.Input";
