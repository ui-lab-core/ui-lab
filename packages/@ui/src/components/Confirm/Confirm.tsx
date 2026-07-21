"use client"

import React, { useState, useEffect } from "react"
import { cn, type StyleValue } from "@/lib/utils"
import { type StylesProp, createStylesResolver } from "@/lib/styles"
import { Button } from "../Button"
import { Modal } from "../Modal"
import { CircleAlert, TriangleAlert, Info } from "lucide-react"
import styles from "./Confirm.module.css"
import { useControlledState } from "@/hooks/useControlledState"

export interface ConfirmStyleSlots {
  root?: StyleValue;
  container?: StyleValue;
  panel?: StyleValue;
  header?: StyleValue;
  body?: StyleValue;
  actions?: StyleValue;
  rowText?: StyleValue;
  title?: StyleValue;
  description?: StyleValue;
  errorMessage?: StyleValue;
  warningBox?: StyleValue;
  input?: StyleValue;
}

export type ConfirmStylesProp = StylesProp<ConfirmStyleSlots>;
export interface ConfirmState { open?: boolean }

const resolveConfirmBaseStyles = createStylesResolver([
  'root',
  'container',
  'panel',
  'header',
  'body',
  'actions',
  'rowText',
  'title',
  'description',
  'errorMessage',
  'warningBox',
  'input'
] as const);

export interface ConfirmStageLabel {
  /** Heading for this stage: the row label when idle, the warning/dialog heading when confirming. */
  title?: string
  /** Supporting copy shown under the title. */
  body?: string
}

export interface ConfirmLabels {
  /** Label for the trigger button. */
  trigger: string
  /** Row content shown before the trigger is clicked. Omit to show nothing. */
  idle?: ConfirmStageLabel
  /** Row content (inline) or heading/body (dialog) shown once the user is confirming. */
  confirming?: ConfirmStageLabel
  /** Label for the confirm button. Defaults to "Confirm". */
  confirm?: string
  /** Label for the cancel button. Defaults to "Cancel". */
  cancel?: string
}

export interface ConfirmProps {
  /** Initial confirmation visibility. For controlled usage, pass `state={{ open }}`. */
  open?: boolean
  /** Controlled state. */
  state?: ConfirmState
  /** "inline" swaps the trigger for confirm/cancel buttons in place. "dialog" opens a modal. */
  mode?: "inline" | "dialog"
  /** Severity level that affects icon and button color */
  severity?: "low" | "medium" | "high" | "critical"
  /** Called when the user confirms the action */
  onConfirm: () => void | Promise<void>
  /** Called when the user cancels the action */
  onCancel?: () => void
  /** Text for the trigger, idle/confirming stages, and confirm/cancel buttons. */
  labels: ConfirmLabels
  /** Whether the trigger button is disabled */
  disabled?: boolean
  /** Custom icon shown in the dialog header */
  icon?: React.ReactNode
  /** Warning message displayed in a colored box before confirming. Dialog mode only. */
  destructiveActionWarning?: string
  /** Seconds the user must wait before the confirm button becomes active */
  countdownSeconds?: number
  /** Whether the user must type confirmText to enable the confirm button. Dialog mode only. */
  requiresReason?: boolean
  /** Text the user must type to confirm when requiresReason is true */
  confirmText?: string
  /** Milliseconds after which the inline confirm auto-resets to idle state */
  autoResetAfter?: number
  /** Keyed styles for the root and named component parts. Use className for conventional root classes. */
  styles?: ConfirmStylesProp
}

const severityConfig = {
  low: {
    icon: <Info className="w-5 h-5 text-blue-500" />,
    warningBoxClass: styles["warning-box-low"],
    buttonVariant: "primary" as const,
  },
  medium: {
    icon: <TriangleAlert className="w-5 h-5 text-yellow-500" />,
    warningBoxClass: styles["warning-box-medium"],
    buttonVariant: "secondary" as const,
  },
  high: {
    icon: <CircleAlert className="w-5 h-5 text-orange-500" />,
    warningBoxClass: styles["warning-box-high"],
    buttonVariant: "secondary" as const,
  },
  critical: {
    icon: <TriangleAlert className="w-5 h-5 text-red-500" />,
    warningBoxClass: styles["warning-box-critical"],
    buttonVariant: "secondary" as const,
  },
} as const

/** Confirms destructive actions either inline, in place, or in a modal dialog */
const Confirm = React.forwardRef<HTMLDivElement, ConfirmProps>(
  (
    {
      mode = "inline",
      severity = "medium",
      onConfirm,
      onCancel,
      labels,
      disabled = false,
      icon,
      destructiveActionWarning,
      countdownSeconds,
      requiresReason = false,
      confirmText,
      autoResetAfter,
      open,
      state: controlledState,
      styles: stylesProp,
    },
    ref
  ) => {
    const [isConfirming, setIsConfirming] = useControlledState(controlledState?.open, open, false)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [countdown, setCountdown] = useState(countdownSeconds || 0)
    const [inputValue, setInputValue] = useState("")
    const resolvedStyles = resolveConfirmBaseStyles(stylesProp)
    const config = severityConfig[severity]
    const confirmLabel = labels.confirm ?? "Confirm"
    const cancelLabel = labels.cancel ?? "Cancel"

    // Handle countdown timer
    useEffect(() => {
      if (!isConfirming || countdown <= 0) return

      const timer = setTimeout(() => {
        setCountdown(countdown - 1)
      }, 1000)

      return () => clearTimeout(timer)
    }, [isConfirming, countdown])

    // Auto-reset inline confirms
    useEffect(() => {
      if (mode !== "inline" || !isConfirming || !autoResetAfter) return

      const timer = setTimeout(() => {
        resetConfirm()
      }, autoResetAfter)

      return () => clearTimeout(timer)
    }, [mode, isConfirming, autoResetAfter])

    const resetConfirm = () => {
      setIsConfirming(false)
      setError(null)
      setCountdown(countdownSeconds || 0)
      setInputValue("")
    }

    const handleTrigger = () => {
      setIsConfirming(true)
      setCountdown(countdownSeconds || 0)
    }

    const handleConfirm = async () => {
      if (requiresReason && inputValue !== confirmText) {
        setError(`Please type "${confirmText}" to confirm`)
        return
      }

      if (countdownSeconds && countdown > 0) {
        setError(`Please wait ${countdown} seconds before confirming`)
        return
      }

      setIsLoading(true)
      setError(null)

      try {
        await Promise.resolve(onConfirm())
        resetConfirm()
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred")
        setIsLoading(false)
      }
    }

    const handleCancel = () => {
      onCancel?.()
      resetConfirm()
    }

    const canConfirm = !countdownSeconds || countdown === 0
    const confirmValid = !requiresReason || inputValue === confirmText
    const stage = isConfirming ? labels.confirming : labels.idle

    if (mode === "dialog") {
      return (
        <div ref={ref} className={cn(styles.confirm, resolvedStyles.root, resolvedStyles.container)}>
          <div className={styles.row}>
            {(labels.idle?.title || labels.idle?.body) && (
              <div className={cn(styles['row-text'], resolvedStyles.rowText)}>
                {labels.idle.title && <span className={cn(styles['row-title'], resolvedStyles.title)}>{labels.idle.title}</span>}
                {labels.idle.body && (
                  <span className={cn(styles['row-description'], resolvedStyles.description)}>{labels.idle.body}</span>
                )}
              </div>
            )}
            <Button
              onClick={handleTrigger}
              isDisabled={disabled || isLoading}
              variant={config.buttonVariant}
            >
              {labels.trigger}
            </Button>
          </div>

          <Modal
            state={{ open: isConfirming }}
            onOpenChange={(next) => { if (!next) handleCancel() }}
            className={resolvedStyles.panel}
            title={
              <div className={cn(styles.header, resolvedStyles.header)}>
                {icon || config.icon}
                <span>{labels.confirming?.title || labels.trigger}</span>
              </div>
            }
            footer={
              <>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={handleCancel}
                  isDisabled={isLoading}
                >
                  {cancelLabel}
                </Button>
                <Button
                  size="sm"
                  variant="primary"
                  onClick={handleConfirm}
                  isDisabled={!canConfirm || !confirmValid || isLoading}
                >
                  {isLoading ? "..." : confirmLabel}
                </Button>
              </>
            }
          >
            <div className={cn(styles.body, resolvedStyles.body)}>
              {labels.confirming?.body && (
                <p className={cn(styles.description, resolvedStyles.description)}>{labels.confirming.body}</p>
              )}
              {destructiveActionWarning && (
                <div className={cn(
                  styles['warning-box'],
                  config.warningBoxClass,
                  resolvedStyles.warningBox
                )}>
                  {destructiveActionWarning}
                </div>
              )}
              {countdownSeconds && countdown > 0 && (
                <div className={styles['countdown-text']}>
                  Please wait {countdown}s before confirming
                </div>
              )}
              {requiresReason && (
                <div>
                  <label className={styles['input-label']}>
                    Type "{confirmText}" to confirm:
                  </label>
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => {
                      setInputValue(e.target.value)
                      setError(null)
                    }}
                    placeholder={confirmText}
                    className={cn(styles.input, resolvedStyles.input)}
                  />
                </div>
              )}
              {error && (
                <p className={cn(styles['error-message'], resolvedStyles.errorMessage)}>{error}</p>
              )}
            </div>
          </Modal>
        </div>
      )
    }

    // Inline mode: idle/confirming each render their own title+body, actions swap on the right.
    return (
      <div ref={ref} className={cn(styles.confirm, resolvedStyles.root, resolvedStyles.container)}>
        <div className={styles.row}>
          {(stage?.title || stage?.body) && (
            <div className={cn(styles['row-text'], resolvedStyles.rowText)}>
              {stage.title && <span className={cn(styles['row-title'], resolvedStyles.title)}>{stage.title}</span>}
              {stage.body && (
                <span className={cn(styles['row-description'], resolvedStyles.description)}>{stage.body}</span>
              )}
            </div>
          )}
          <div className={cn(styles.actions, resolvedStyles.actions)}>
            {!isConfirming ? (
              <Button
                onClick={handleTrigger}
                isDisabled={disabled || isLoading}
                variant={config.buttonVariant}
              >
                {labels.trigger}
              </Button>
            ) : (
              <>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={handleCancel}
                  isDisabled={isLoading}
                >
                  {cancelLabel}
                </Button>
                <Button
                  size="sm"
                  variant="primary"
                  onClick={handleConfirm}
                  isDisabled={!canConfirm || !confirmValid || isLoading}
                >
                  {isLoading ? "..." : confirmLabel}
                </Button>
              </>
            )}
          </div>
        </div>
        {error && (
          <p className={cn(styles['error-message'], resolvedStyles.errorMessage)}>{error}</p>
        )}
      </div>
    )
  }
)

Confirm.displayName = "Confirm"

export { Confirm }
