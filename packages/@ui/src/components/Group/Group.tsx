"use client";

import * as React from "react";
import { mergeProps } from "@react-aria/utils";
import { cn } from "@/lib/cn";
import { useFocus } from "@/hooks/useFocus";
import { useMergeRefs } from "@/hooks/useMergeRefs";
import { GroupContext, type GroupContextValue } from "./group.context";
import { GroupButton, GroupExpand, GroupInput, GroupSelect } from "./Group.Controls";
import { resolveGroupStyles } from "./group.styles";
import type { GroupOrientation, GroupProps, GroupSpacing } from "./group.types";
import css from "./Group.module.css";

const orientationMap: Record<GroupOrientation, string> = {
  horizontal: css.horizontal,
  vertical: css.vertical,
};

const spacingMap: Record<GroupSpacing, string> = {
  none: css.none,
  xs: css.xs,
  sm: css.sm,
};

// Detect Divider elements by checking for separator role, orientation prop, or displayName
function isDivider(child: React.ReactNode): boolean {
  if (!React.isValidElement(child)) return false;
  const props = (child.props || {}) as Record<string, unknown>;
  const type = child.type as any;
  return props.role === "separator" || "orientation" in props || type?.displayName === "Divider";
}

// React.Children.toArray does not flatten explicit <Fragment key={...}> wrappers
// (only plain arrays/iterables), so a common `<Fragment key={x}>{divider}{item}</Fragment>`
// list would otherwise be treated as one opaque child per pair, hiding the real item's
// props (className, divider role) from the per-item logic below. Flatten fragments recursively
// so each real element is its own entry, matching what consumers expect from a children list.
function flattenGroupChildren(children: React.ReactNode): React.ReactElement[] {
  const result: React.ReactElement[] = [];
  React.Children.forEach(children, (child) => {
    if (!React.isValidElement(child)) return;
    if (child.type === React.Fragment) {
      result.push(
        ...flattenGroupChildren((child.props as { children?: React.ReactNode }).children),
      );
    } else {
      result.push(child);
    }
  });
  return result;
}

// A child that asks to fill the inline axis makes its item wrapper grow too, so
// the growth request survives the wrapper Group inserts around every child.
function requestsGrowth(className: unknown): boolean {
  return (
    typeof className === "string" &&
    (className.includes("w-full") || className.includes("flex-1"))
  );
}

/** Groups related controls into one connected surface */
const GroupRoot = React.forwardRef<HTMLDivElement, GroupProps>(
  (
    {
      className,
      variant,
      orientation = "horizontal",
      spacing = "none",
      children,
      disabled = false,
      value,
      onChange,
      styles: stylesProp,
      ...props
    },
    ref,
  ) => {
    const scopeRef = React.useRef<HTMLDivElement>(null);
    const groupRef = React.useRef<HTMLDivElement>(null);
    const inputsRef = React.useRef<
      Map<React.RefObject<HTMLDivElement | null>, React.RefObject<HTMLInputElement | null>>
    >(new Map());
    const focusableSurfacesRef = React.useRef<React.RefObject<HTMLElement | null>[]>([]);

    const childrenArray = flattenGroupChildren(children);

    const resolved = resolveGroupStyles(stylesProp);
    const mergedRef = useMergeRefs<HTMLDivElement>(ref, groupRef);

    const { scopeProps, indicatorProps } = useFocus({
      scopeRef,
      containerRef: groupRef,
      surfaceSelector: '[data-focus-surface="true"]',
      radiusSource: "item",
      dependencies: [childrenArray.length, orientation, spacing],
    });

    const registerInput = React.useCallback(
      (
        containerRef: React.RefObject<HTMLDivElement | null>,
        inputRef: React.RefObject<HTMLInputElement | null>,
      ) => {
        inputsRef.current.set(containerRef, inputRef);
      },
      [],
    );

    const unregisterInput = React.useCallback(
      (containerRef: React.RefObject<HTMLDivElement | null>) => {
        inputsRef.current.delete(containerRef);
      },
      [],
    );

    const activateInput = React.useCallback(() => {
      const firstEntry = Array.from(inputsRef.current.entries())[0];
      if (firstEntry) {
        const [containerRef, inputRef] = firstEntry;
        if (containerRef.current && inputRef.current) {
          // Focus the actual input for keyboard interaction
          inputRef.current.focus();

          // Force focus-visible state by finding the input container inside the wrapper
          // The Input component renders a container div with data-input-focus-surface
          const inputContainer = containerRef.current.querySelector(
            '[data-input-focus-surface="true"]',
          ) as HTMLElement;
          if (inputContainer) {
            inputContainer.setAttribute("data-focus-visible", "true");
            inputContainer.setAttribute("data-focused", "true");
          }
          return true;
        }
      }
      return false;
    }, []);

    const registerFocusableSurface = React.useCallback(
      (ref: React.RefObject<HTMLElement | null>) => {
        focusableSurfacesRef.current.push(ref);
      },
      [],
    );

    const unregisterFocusableSurface = React.useCallback(
      (ref: React.RefObject<HTMLElement | null>) => {
        focusableSurfacesRef.current = focusableSurfacesRef.current.filter((r) => r !== ref);
      },
      [],
    );

    const handleGroupKeyDown = React.useCallback(
      (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (e.defaultPrevented) {
          return;
        }

        if (
          e.key !== "ArrowRight" &&
          e.key !== "ArrowLeft" &&
          e.key !== "ArrowDown" &&
          e.key !== "ArrowUp"
        ) {
          return;
        }

        const focusedElement = document.activeElement;
        if (
          !(focusedElement instanceof HTMLElement) ||
          !groupRef.current?.contains(focusedElement)
        ) {
          return;
        }

        // Editable controls own their arrow keys even when their focus ring is visible.
        if (
          focusedElement.matches("input, textarea, select") ||
          focusedElement.isContentEditable
        ) {
          return;
        }

        const focusableElements = focusableSurfacesRef.current
          .map((ref) => ref.current)
          .filter((el): el is HTMLElement => el !== null && !!groupRef.current?.contains(el));

        if (focusableElements.length === 0) {
          return;
        }

        const currentIndex = focusableElements.findIndex((el) =>
          el.contains(focusedElement as Node),
        );
        if (currentIndex === -1) {
          return;
        }

        const isHorizontal = orientation === "horizontal";
        const isNavigatingInline =
          (e.key === "ArrowRight" || e.key === "ArrowLeft") && isHorizontal;
        const isNavigatingBlock = (e.key === "ArrowDown" || e.key === "ArrowUp") && !isHorizontal;

        if (!isNavigatingInline && !isNavigatingBlock) {
          return;
        }

        e.preventDefault();

        let nextIndex = currentIndex;
        if (e.key === "ArrowRight" || e.key === "ArrowDown") {
          nextIndex = (currentIndex + 1) % focusableElements.length;
        } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
          nextIndex = currentIndex === 0 ? focusableElements.length - 1 : currentIndex - 1;
        }

        const nextElement = focusableElements[nextIndex];
        if (nextElement) {
          // Try to focus an interactive element within the surface
          const focusableChild = nextElement.querySelector(
            'button, input, [role="button"]',
          ) as HTMLElement | null;
          if (focusableChild) {
            focusableChild.focus();
          } else {
            nextElement.focus();
          }
        }
      },
      [orientation],
    );

    const contextValue: GroupContextValue = {
      isInGroup: true,
      groupRef,
      groupOrientation: orientation,
      groupSpacing: spacing,
      groupIsDisabled: disabled,
      groupValue: value,
      groupOnChange: onChange,
      groupVariant: variant,
      groupStyles: resolved,
      registerInput,
      unregisterInput,
      activateInput,
      registerFocusableSurface,
      unregisterFocusableSurface,
    };

    // The scope div below is the box that actually determines Group's outward size;
    // it never receives `className`, so sizing utilities on Group were trapped one
    // level too deep to take effect. Forward the same growth utilities the item-level
    // check above already recognizes.
    const rootClassName = className || "";

    return (
      <GroupContext.Provider value={contextValue}>
        <div
          ref={scopeRef}
          className={cn(
            "group-scope",
            scopeProps.className,
            rootClassName.includes("w-full") && "w-full",
            rootClassName.includes("flex-1") && "flex-1",
          )}
        >
          <div
            role="group"
            data-slot="root"
            data-orientation={orientation}
            data-spacing={spacing}
            data-variant={variant || undefined}
            aria-disabled={disabled || undefined}
            data-disabled={disabled ? "true" : undefined}
            {...mergeProps(props, { onKeyDown: handleGroupKeyDown })}
            ref={mergedRef}
            className={cn(
              "group",
              variant,
              orientation,
              css.group,
              orientationMap[orientation],
              spacingMap[spacing],
              className,
              resolved.root,
            )}
          >
            {childrenArray.map((child, index) => {
              const isFirst = index === 0;
              const isLast = index === childrenArray.length - 1;
              const isDividerChild = isDivider(child);

              // Extract layout-related classes from child to apply to the item wrapper
              const childProps = React.isValidElement(child) ? (child.props as any) : {};
              const shouldGrow = requestsGrowth(childProps.className);
              return (
                <div
                  key={`item-${index}`}
                  className={cn(
                    "item",
                    // Second identifier so themes can tell a separator wrapper
                    // apart from the interactive items it sits between.
                    isDividerChild && "divider",
                    variant,
                    css.item,
                    isDividerChild && css.divider,
                    shouldGrow && css.grow,
                    resolved["item.root"],
                    isFirst && resolved["item.first"],
                    isLast && resolved["item.last"],
                    isDividerChild && resolved["item.divider"],
                    shouldGrow && resolved["item.grow"],
                  )}
                  data-slot="item"
                  data-item="true"
                  data-divider={isDividerChild ? "true" : undefined}
                  data-grow={shouldGrow ? "true" : undefined}
                >
                  {child}
                </div>
              );
            })}
          </div>
          <div {...indicatorProps} />
        </div>
      </GroupContext.Provider>
    );
  },
);
GroupRoot.displayName = "Group";

/**
 * Group.InputWrapper is retained for backward compatibility and renders the same
 * component as Group.Input.
 * @deprecated Use Group.Input.
 */
const GroupInputWrapper = GroupInput;

// Assemble compound component
const Group = Object.assign(GroupRoot, {
  Button: GroupButton,
  Input: GroupInput,
  InputWrapper: GroupInputWrapper,
  Select: GroupSelect,
  Expand: GroupExpand,
});

export { Group };
