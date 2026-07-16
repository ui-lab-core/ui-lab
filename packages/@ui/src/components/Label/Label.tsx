import { cn, type StyleValue } from "@/lib/utils";
import { type StylesProp, createStylesResolver } from "@/lib/styles";
import css from "./Label.module.css";

interface LabelStyleSlots {
  root?: StyleValue;
  text?: StyleValue;
  requiredIndicator?: StyleValue;
  helperText?: StyleValue;
}

type LabelStylesProp = StylesProp<LabelStyleSlots>;

const resolveLabelBaseStyles = createStylesResolver(["root", "text", "requiredIndicator", "helperText"] as const);

export interface LabelProps
  extends React.LabelHTMLAttributes<HTMLLabelElement> {
  /** Keyed styles for the root and named component parts. Use className for conventional root classes. */
  styles?: LabelStylesProp;
  /** Whether to show a required asterisk indicator */
  required?: boolean;
  /** Helper text shown below the label */
  helperText?: React.ReactNode;
  /** Whether to style the helper text as an error */
  helperTextError?: boolean;
  /** Size of the label text */
  size?: "sm" | "md" | "lg" | null;
  /** Whether the label appears disabled */
  disabled?: boolean | null;
  /** Whether to apply error styling */
  error?: boolean | null;
}

const Label = ({
  className,
  styles,
  size = "md",
  disabled,
  error,
  required,
  helperText,
  helperTextError,
  children,
  ...props
}: LabelProps) => {
  const resolved = resolveLabelBaseStyles(styles);
  return (
    <div className={cn('label', css.label, 'w-full', className, resolved.root)}>
      <label
        className={cn("text", css.text, resolved.text)}
        data-size={size ?? 'md'}
        data-disabled={disabled || undefined}
        data-error={error || undefined}
        {...props}
      >
        {children}
        {required && (
          <span className={cn("required", css["required-indicator"], resolved.requiredIndicator)} aria-label="required">
            *
          </span>
        )}
      </label>
      {helperText && (
        <p
          className={cn("helper", css["helper-text"], resolved.helperText)}
          data-error={helperTextError || undefined}
        >
          {helperText}
        </p>
      )}
    </div>
  );
};

Label.displayName = "Label";

export { Label };
