import type { ComponentType } from "react";
import Link from "next/link";
import { Layers3, LayoutGrid, Palette, Type } from "lucide-react";
import { Button } from "ui-lab-components/button";
import { Lattice, Section } from "./section";
import { Divider } from "ui-lab-components";
import { FaGraduationCap } from "react-icons/fa6";

type DesignSystemArea = {
  title: string;
  description: string;
  href: string;
  Icon: ComponentType<{ className?: string; size?: number }>;
};

const areas: DesignSystemArea[] = [
  {
    title: "Foundation",
    description: "The principles, accessibility standards, and shared decisions behind UI Lab.",
    href: "/design-system",
    Icon: Layers3,
  },
  {
    title: "Colors",
    description: "Perceptually uniform OKLCH palettes with semantic roles for every interface.",
    href: "/design-system/colors",
    Icon: Palette,
  },
  {
    title: "Typography",
    description: "Derived type scales that keep hierarchy readable, consistent, and responsive.",
    href: "/design-system/typography",
    Icon: Type,
  },
  {
    title: "Layout",
    description: "A shared spacing scale for predictable rhythm, density, and alignment.",
    href: "/design-system/spacing",
    Icon: LayoutGrid,
  },
];

export function DesignSystemSection() {
  return (
    <Section ground="1000" rhythm="small">
      <div className="grid-paper border overflow-hidden border-background-700 rounded-sm pt-12">
        <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1fr)_auto] lg:gap-20">
          <div className="space-y-5 pl-12">
            <h2 className="text-3xl text-foreground-100">Academy</h2>
            <p className="text-md max-w-[29ch] text-foreground-400">
              Powerful yet simple design system you can adapt to any project
            </p>
            <Button className="rounded-full" variant="secondary" href="/design-system">
              Explore the system
            </Button>
          </div>

          <div className="mr-6 w-fit space-y-6">
            <h3 className="max-w-[31ch] text-xl font-medium text-foreground-100 sm:text-2xl">
              One design language, from first principle to finished interface.
            </h3>
          </div>
        </div>

        <Divider className="mt-12" spacing="none" />
        <Lattice className="rounded-none! border-none sm:grid-cols-2">
          {areas.map(({ title, description, href, Icon }) => (
            <Link
              key={title}
              href={href}
              className="group grid min-h-30 grid-cols-[auto_minmax(0,1fr)] items-center gap-8 bg-background-1000 p-3 transition-colors hover:bg-background-950 focus-visible:z-10 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-foreground-200 sm:p-4 lg:p-6"
            >
              <span className="grid size-16 shrink-0 place-items-center rounded-md text-foreground-300 transition-colors group-hover:text-foreground-100 sm:size-12 lg:size-20">
                <Icon aria-hidden className="text-background-500 size-6 sm:size-8 lg:size-10" />
              </span>
              <div className="self-center">
                <h3 className="text-lg font-medium text-foreground-100">{title}</h3>
                <p className="mt-1 max-w-[38ch] text-md leading-relaxed text-foreground-400">
                  {description}
                </p>
              </div>
            </Link>
          ))}
        </Lattice>
      </div>
    </Section>
  );
}
