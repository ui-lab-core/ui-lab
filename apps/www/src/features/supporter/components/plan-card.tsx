import type { ReactNode } from "react";
import type { LumenIconId } from "@ui-lab-core/library/icons";
import { Flex } from "ui-lab-components/flex";
import { Icon } from "ui-lab-components/icon";

/** The price row shared by every plan: amount, then its qualifier over a note. */
export function PlanPrice({
  price,
  qualifier,
  note,
}: {
  price: string;
  qualifier: string;
  note: string;
}) {
  return (
    <div className="flex items-center gap-4">
      <span className="text-3xl text-foreground-100">{price}</span>
      <p className="text-xs leading-5 text-foreground-400">
        {qualifier}
        <br />
        {note}
      </p>
    </div>
  );
}

/**
 * One plan in the pricing grid. Each card spans five rows of its parent grid
 * through `subgrid` — header, price and call to action, reassurance, features,
 * footer — so every row lines up across the cards whatever its content height.
 * The parent must be a {@link PlanGrid}, whose flexible features row keeps the
 * cards the same height even when they stack.
 */
export function PlanCard({
  name,
  tagline,
  mark,
  action,
  children,
  assurance,
  features,
  footer,
  featured = false,
}: {
  name: string;
  tagline: string;
  /** The plan's icon tile beside its name. */
  mark: ReactNode;
  /** Optional element opposite the name, e.g. a badge. */
  action?: ReactNode;
  /** Price and call to action. */
  children: ReactNode;
  assurance: { icon: LumenIconId; label: ReactNode };
  features: readonly { icon: LumenIconId; label: string }[];
  footer?: ReactNode;
  featured?: boolean;
}) {
  return (
    <div
      className={`row-span-5 grid grid-rows-subgrid gap-y-6 rounded-xl border p-6 ${
        featured
          ? "border-accent-500/30 bg-[linear-gradient(to_bottom_in_oklab,var(--background-900)_20%,color-mix(in_oklab,var(--accent-600)_10%,var(--background-900)))]"
          : "border-background-800 bg-background-950"
      }`}
    >
      <Flex layout="bar" gap={3} className="items-start">
        <Flex gap={3} align-center>
          {mark}
          <div>
            <h2 className="text-lg font-medium text-foreground-50">{name}</h2>
            <p className="text-sm text-foreground-400">{tagline}</p>
          </div>
        </Flex>

        {action}
      </Flex>

      <div>{children}</div>

      <div className="flex items-center gap-2 text-sm text-foreground-400">
        <Icon id={assurance.icon} size={16} />
        <span>{assurance.label}</span>
      </div>

      <section
        className={`space-y-4 border-t pt-6 ${
          featured ? "border-accent-500/20" : "border-background-700"
        }`}
      >
        <h3 className="text-sm font-medium text-foreground-200">Included with {name}</h3>
        <ul className="space-y-3 text-sm">
          {features.map(({ icon, label }) => (
            <li key={label}>
              <Flex
                gap={3}
                className={`items-start ${featured ? "text-foreground-300" : "text-foreground-400"}`}
              >
                <Icon
                  id={icon}
                  size={18}
                  className={`mt-0.5 shrink-0 ${featured ? "text-accent-400" : "text-foreground-500"}`}
                />
                <span>{label}</span>
              </Flex>
            </li>
          ))}
        </ul>
      </section>

      <div className="min-h-5 self-end text-sm">{footer}</div>
    </div>
  );
}

/**
 * Three columns on wide screens, with a shared row track for {@link PlanCard}.
 * Every features row is `1fr`, and flexible rows in a content-sized grid all
 * resolve to the tallest one, so stacked cards stay the same height too.
 */
export function PlanGrid({ children }: { children: ReactNode }) {
  return (
    <div className="grid w-full grid-rows-[repeat(3,auto_auto_auto_1fr_auto)] gap-4 lg:grid-cols-3 lg:grid-rows-[auto_auto_auto_1fr_auto]">
      {children}
    </div>
  );
}
