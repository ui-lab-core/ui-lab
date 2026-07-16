"use client"

import * as React from "react";
import { createPortal } from "react-dom";
import { useDialog } from "react-aria";
import { useFocusRing } from "@react-aria/focus";
import { mergeProps } from "@react-aria/utils";
import { cn, type StyleValue } from "@/lib/utils";
import { type StylesProp, createStylesResolver } from "@/lib/styles";
import { asElementProps } from "@/lib/react-aria";
import { X } from "lucide-react";
import { useScrollLock } from "../../hooks/useScrollLock";
import { useControlledState } from "@/hooks/useControlledState";
import { usePresence } from "@/hooks/usePresence";
import css from "./Modal.module.css";

const transitionDuration = 180;

const useModalKeyboard = (
  element: HTMLDivElement | null,
  isOpen: boolean,
  isDismissable: boolean,
  isKeyboardDismissDisabled: boolean,
  onClose: () => void
) => {
  const onCloseRef = React.useRef(onClose);
  onCloseRef.current = onClose;

  React.useEffect(() => {
    if (!isOpen || !element) return;

    if (!element.contains(element.ownerDocument.activeElement)) {
      element.focus();
    }

    const ownerDocument = element.ownerDocument;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isDismissable && !isKeyboardDismissDisabled) {
        e.preventDefault();
        onCloseRef.current();
      }
    };

    ownerDocument.addEventListener("keydown", handleKeyDown, { capture: true });
    return () => ownerDocument.removeEventListener("keydown", handleKeyDown, { capture: true });
  }, [element, isOpen, isDismissable, isKeyboardDismissDisabled]);
};

export interface ModalStyleSlots {
  root?: StyleValue;
  overlay?: StyleValue;
  backdrop?: StyleValue;
  header?: StyleValue;
  title?: StyleValue;
  spacer?: StyleValue;
  close?: StyleValue;
  closeIcon?: StyleValue;
  content?: StyleValue;
  footer?: StyleValue;
}

export type ModalStylesProp = StylesProp<ModalStyleSlots>;

const resolveModalBaseStyles = createStylesResolver([
  'root', 'overlay', 'backdrop', 'header', 'title', 'spacer', 'close', 'closeIcon', 'content', 'footer'
] as const);

function resolveModalStyles(styles: ModalStylesProp | undefined) {
  if (!styles) return resolveModalBaseStyles(styles);
  const { root, overlay, backdrop, header, title, spacer, close, closeIcon, content, footer } = styles;
  return resolveModalBaseStyles({ root, overlay, backdrop, header, title, spacer, close, closeIcon, content, footer });
}

export interface ModalProps {
  state?: ModalState;
  /** Initial open state. For controlled usage, pass `state={{ open }}`. */
  open?: boolean;
  /** Controlled state. */
  /** @deprecated Use `open`. */
  isOpen?: boolean;
  /** Callback when the open state changes */
  onOpenChange?: (isOpen: boolean) => void;
  /** Optional title rendered in the modal header bar */
  title?: React.ReactNode;
  /** Accessible name used when the modal has no visible title. */
  "aria-label"?: string;
  /** Modal body content */
  children: React.ReactNode;
  /** Optional footer content rendered below the body */
  footer?: React.ReactNode;
  /** Whether to show the X close button in the header */
  close?: boolean;
  /** Controls modal width: "fit" adapts to content, "auto" uses default width */
  size?: "fit" | "auto";
  /** Controls the panel entrance and exit animation. */
  animation?: "default" | "fade";
  /** Whether clicking the backdrop dismisses the modal */
  isDismissable?: boolean;
  /** Prevents the Escape key from dismissing the modal */
  isKeyboardDismissDisabled?: boolean;
  /** Additional class for the modal panel */
  className?: string;
  /** Additional class for the inner content area */
  contentClassName?: string;
  /** Additional class for the backdrop overlay */
  overlayClassName?: string;
  /** Keyed styles for the root and named component parts. Use className for conventional root classes. */
  styles?: ModalStylesProp;
}
export interface ModalState { open?: boolean }

function getModalChildDisplayName(child: React.ReactNode) {
  if (!React.isValidElement(child)) return null;
  const type = child.type as { displayName?: string };
  return type.displayName ?? null;
}


/**
 * Modal component that displays content in a centered dialog with a backdrop overlay.
 * Built with React Aria for full accessibility support including focus management,
 * keyboard handling, and screen reader announcements.
 */
const ModalBase = React.forwardRef<HTMLDivElement, ModalProps>(
  (
    {
      open,
      state: controlledState,
      isOpen: legacyIsOpen,
      onOpenChange,
      title,
      "aria-label": ariaLabel,
      children,
      footer,
      close = true,
      size = "auto",
      animation = "default",
      isDismissable = true,
      isKeyboardDismissDisabled = false,
      className,
      contentClassName,
      overlayClassName,
      styles,
    },
    ref
  ) => {
    const modalRef = React.useRef<HTMLDivElement>(null);
    const [panelElement, setPanelElement] = React.useState<HTMLDivElement | null>(null);
    const setPanelRef = React.useCallback((el: HTMLDivElement | null) => {
      modalRef.current = el;
      setPanelElement(el);
    }, []);
    const [mounted, setMounted] = React.useState(false);
    const [isClosePressed, setIsClosePressed] = React.useState(false);
    const [isCloseHovered, setIsCloseHovered] = React.useState(false);
    const [isCloseFocused, setIsCloseFocused] = React.useState(false);
    const [isCloseFocusVisible, setIsCloseFocusVisible] = React.useState(false);

    const resolved = resolveModalStyles(styles);

    // All public open props represent the current state; leaving every one
    // undefined is the only uncontrolled/initially-closed mode.
    const [isOpen, setOpen] = useControlledState(
      controlledState?.open ?? open ?? legacyIsOpen,
      undefined,
      false,
    );
    const closeModal = React.useCallback(() => {
      setOpen(false);
      onOpenChange?.(false);
    }, [onOpenChange, setOpen]);

    // Handle mount to prevent hydration issues
    React.useEffect(() => {
      setMounted(true);
    }, []);

    const { present, state, finishExit } = usePresence(
      mounted && isOpen,
      transitionDuration,
    );

    // Use forwardRef callback to expose modalRef
    React.useImperativeHandle(ref, () => modalRef.current as HTMLDivElement);

    // Handle keyboard events and auto-focus
    useModalKeyboard(
      panelElement,
      isOpen,
      isDismissable,
      isKeyboardDismissDisabled,
      closeModal
    );

    // useDialog hook provides accessibility attributes and title handling
    const { dialogProps, titleProps } = useDialog({ "aria-label": ariaLabel }, modalRef);
    const { focusProps: modalFocusProps, isFocused: isModalFocused, isFocusVisible: isModalFocusVisible } = useFocusRing();

    const handleClose = closeModal;

    useScrollLock(isOpen, panelElement);

    if (!mounted || !present) return null;

    const handleCloseMouseDown = () => setIsClosePressed(true);
    const handleCloseMouseUp = () => setIsClosePressed(false);
    const handleCloseMouseLeave = () => {
      setIsClosePressed(false);
      setIsCloseHovered(false);
    };
    const handleCloseMouseEnter = () => setIsCloseHovered(true);
    const handleCloseFocus = (event: React.FocusEvent<HTMLButtonElement>) => {
      setIsCloseFocused(true);
      setIsCloseFocusVisible(event.currentTarget.matches(":focus-visible"));
    };
    const handleCloseBlur = () => {
      setIsCloseFocused(false);
      setIsCloseFocusVisible(false);
    };

    const childArray = React.Children.toArray(children);
    const slottedHeader: React.ReactNode[] = [];
    const slottedBody: React.ReactNode[] = [];
    const slottedFooter: React.ReactNode[] = [];
    const unslottedChildren: React.ReactNode[] = [];

    childArray.forEach((child) => {
      switch (getModalChildDisplayName(child)) {
        case "Modal.Header":
          slottedHeader.push(child);
          break;
        case "Modal.Body":
          slottedBody.push(child);
          break;
        case "Modal.Footer":
          slottedFooter.push(child);
          break;
        default:
          unslottedChildren.push(child);
      }
    });

    const headerContent =
      slottedHeader.length > 0 ? (
        slottedHeader
      ) : (
        (title || close) && (
          <div className={cn("header", css.header, resolved.header)}>
            {title && (
              <h4 {...asElementProps<"h4">(titleProps)} className={cn("title", css.title, resolved.title)}>
                {title}
              </h4>
            )}
            {!title && close && <div className={cn("spacer", css.spacer, resolved.spacer)} />}
            {close && (
              <button
                onClick={handleClose}
                onMouseDown={handleCloseMouseDown}
                onMouseEnter={handleCloseMouseEnter}
                onMouseUp={handleCloseMouseUp}
                onMouseLeave={handleCloseMouseLeave}
                onFocus={handleCloseFocus}
                onBlur={handleCloseBlur}
                className={cn("close", css.close, resolved.close)}
                aria-label="Close modal"
                type="button"
                data-pressed={isClosePressed ? "true" : "false"}
                data-hovered={isCloseHovered ? "true" : "false"}
                data-focused={isCloseFocused ? "true" : "false"}
                data-focus-visible={isCloseFocusVisible ? "true" : "false"}
              >
                <X className={cn("close-icon", css["close-icon"], resolved.closeIcon)} />
              </button>
            )}
          </div>
        )
      );

    const bodyContent =
      slottedBody.length > 0 ? (
        slottedBody
      ) : (
        <div className={cn("content", css.content, contentClassName, resolved.content)}>
          {unslottedChildren}
        </div>
      );

    return createPortal(
      <div
        className={cn(
          "modal",
          css.overlay,
          "fixed inset-0 z-9999 flex items-center justify-center",
          overlayClassName,
          resolved.overlay
        )}
        data-state={state}
      >
        {/* Backdrop overlay - click outside to dismiss */}
        <div
          className={cn("backdrop", css.backdrop, resolved.backdrop)}
          onMouseDown={() => { if (isDismissable) closeModal(); }}
        />

        {/* Modal content */}
        <div
          {...asElementProps<"div">(mergeProps(dialogProps, modalFocusProps))}
          aria-modal="true"
          ref={setPanelRef}
          className={cn(
            "panel",
            css.panel,
            className,
            resolved.root
          )}
          onClick={(e) => e.stopPropagation()}
          onTransitionEnd={(event) => {
            if (event.target === event.currentTarget && event.propertyName === "opacity") {
              finishExit();
            }
          }}
          tabIndex={-1}
          data-size={size}
          data-animation={animation}
          data-focused={isModalFocused ? "true" : "false"}
          data-focus-visible={isModalFocusVisible ? "true" : "false"}
        >
          {/* Header */}
          {headerContent}

          {/* Body */}
          {bodyContent}

          {/* Footer */}
          {slottedFooter.length > 0 && slottedFooter}
          {!slottedFooter.length && footer && (
            <div className={cn("footer", css.footer, resolved.footer)}>
              {footer}
            </div>
          )}
        </div>
      </div>,
      document.body
    );
  }
);

ModalBase.displayName = "Modal";

/**
 * ModalHeader component for use with compound Modal pattern
 */
const ModalHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { children?: React.ReactNode }
>(({ children, className, ...props }, ref) => (
  <div ref={ref} className={cn("header", css.header, className)} {...props}>
    {children}
  </div>
));

ModalHeader.displayName = "Modal.Header";

/**
 * ModalBody component for use with compound Modal pattern
 */
const ModalBody = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { children?: React.ReactNode }
>(({ children, className, ...props }, ref) => (
  <div ref={ref} className={cn("content", css.content, className)} {...props}>
    {children}
  </div>
));

ModalBody.displayName = "Modal.Body";

/**
 * ModalFooter component for use with compound Modal pattern
 */
const ModalFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { children?: React.ReactNode }
>(({ children, className, ...props }, ref) => (
  <div ref={ref} className={cn("footer", css.footer, className)} {...props}>
    {children}
  </div>
));

ModalFooter.displayName = "Modal.Footer";

const Modal = Object.assign(ModalBase, {
  Header: ModalHeader,
  Body: ModalBody,
  Footer: ModalFooter,
});

export { Modal, ModalHeader, ModalBody, ModalFooter };
