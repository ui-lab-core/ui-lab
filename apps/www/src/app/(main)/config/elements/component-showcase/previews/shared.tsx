import type { ReactNode } from "react";
import { Card } from "ui-lab-components/card";
import { Flex } from "ui-lab-components/flex";
import { Label } from "ui-lab-components/label";
import { Select } from "ui-lab-components/select";

export function Surface({
  title,
  action,
  children,
  footer,
}: {
  title: string;
  action?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <Card className="w-full min-w-0 h-full flex flex-col">
      <Card.Header>
        <Flex layout="bar" gap="sm" wrap>
          <h3>{title}</h3>
          {action}
        </Flex>
      </Card.Header>
      <Card.Body className="flex flex-col flex-1 min-h-0">
        <Flex direction="column" gap="md" justify-between className="min-w-0 flex-1">
          {children}
        </Flex>
      </Card.Body>
      {footer && <Card.Footer>{footer}</Card.Footer>}
    </Card>
  );
}

// Supporting copy. The inner span keeps multi-part text in one inline formatting
// context, so interpolated values do not become separate flex items.
export function Note({
  children,
  small,
  className,
  role,
}: {
  children: ReactNode;
  small?: boolean;
  className?: string;
  role?: string;
}) {
  return (
    <Flex
      role={role}
      className={[small ? "text-sm" : "text-md", "text-foreground-400", className]
        .filter(Boolean)
        .join(" ")}
    >
      <span>{children}</span>
    </Flex>
  );
}

export function Stat({
  value,
  unit,
  badge,
  caption,
}: {
  value: string;
  unit?: string;
  badge?: ReactNode;
  caption?: string;
}) {
  return (
    <Flex align-center gap="md" wrap>
      <Flex className="text-4xl font-medium tabular-nums">
        <span>{value}</span>
      </Flex>
      {unit && <Note>{unit}</Note>}
      {badge}
      {caption && <Note>{caption}</Note>}
    </Flex>
  );
}

export function Row({ label, value }: { label: ReactNode; value: ReactNode }) {
  return (
    <Flex layout="bar" gap="sm">
      <span>{label}</span>
      <strong>{value}</strong>
    </Flex>
  );
}

export function Field({
  label,
  htmlFor,
  hint,
  children,
}: {
  label: string;
  htmlFor: string;
  hint?: ReactNode;
  children: ReactNode;
}) {
  return (
    <Flex direction="column" gap="sm" className="min-w-0">
      <Label htmlFor={htmlFor}>{label}</Label>
      {children}
      {hint && <p>{hint}</p>}
    </Flex>
  );
}

export function Choice({
  label,
  value,
  className,
  options,
  onChange,
}: {
  label: string;
  value: string;
  className?: string;
  options: string[];
  onChange: (value: string) => void;
}) {
  return (
    <Select
      className={className}
      selectedKey={value}
      label={value}
      onSelectionChange={(key) => onChange(String(key))}
    >
      <Select.Trigger aria-label={label}>
        <Select.Value />
      </Select.Trigger>
      <Select.Content>
        {options.map((option) => (
          <Select.Item key={option} value={option}>
            {option}
          </Select.Item>
        ))}
      </Select.Content>
    </Select>
  );
}
