import type { CSSProperties, ReactNode } from "react";

type SectionHeadingProps = {
  title: ReactNode;
  /** Centered headings carry the short-form sections; everything else runs left. */
  align?: "start" | "center";
  /** Tighter columns take the smaller cut so the heading fits the space. */
  size?: "default" | "small";
  className?: string;
};

const headingSizes = {
  default: "type-section",
  small: "type-page",
} as const;

export function SectionHeading({
  title,
  align = "start",
  size = "default",
  className = "",
}: SectionHeadingProps) {
  const centered = align === "center";

  return (
    <div
      className={`flex flex-col pl-6 mt-8 gap-4 ${centered ? "items-center text-center" : ""} ${className}`}
    >
      <h2
        className={`max-w-[28ch] text-balance ${headingSizes[size]} text-foreground-100`}
      >
        {title}
      </h2>
    </div>
  );
}

/** Grounds alternate down the page so the sequence reads as chapters. */
type Ground = "1000" | "950" | "900";
/** Not every section deserves the same air. */
type Rhythm = "small" | "tight" | "normal" | "loose" | "none";

const grounds: Record<Ground, string> = {
  "1000": "bg-background-1000",
  "950": "bg-background-950",
  "900": "bg-background-900",
};

const rhythms: Record<Rhythm, string> = {
  tight: "py-4 md:py-10 px-4",
  normal: "py-10 md:py-18 px-4",
  loose: "py-14 md:py-22 px-4",
  small: "py-3 px-3",
  none: "px-0",
};

type SectionProps = {
  ground?: Ground;
  rhythm?: Rhythm;
  /** Drops the page-width column so the section can run edge to edge. */
  bleed?: boolean;
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
};

export function Section({
  ground = "950",
  rhythm = "normal",
  bleed = false,
  className = "",
  style,
  children,
}: SectionProps) {
  return (
    <section className={`w-full ${grounds[ground]} ${rhythms[rhythm]} ${className}`} style={style}>
      {bleed ? children : <Page>{children}</Page>}
    </section>
  );
}

/** The page-width column. Bleeding sections use it to pull single rows back in. */
export function Page({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`mx-auto w-full max-w-(--page-width) ${className}`}>{children}</div>;
}

/** One wide typographic line, used sparingly to break the section rhythm. */
export function Statement({ children }: { children: ReactNode }) {
  return (
    <p className="mx-auto max-w-[34ch] type-section text-center text-foreground-200">
      {children}
    </p>
  );
}

/** Wireframe lattice: gap-px cells sitting on a background-700 grid. */
export function Lattice({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={`grid gap-px overflow-hidden rounded-sm border border-background-700 bg-background-700 ${className}`}
    >
      {children}
    </div>
  );
}

/** Fades the bottom edge of a shot whose UI is taller than its frame. */
const cropFade = "linear-gradient(180deg, #000 74%, transparent 100%)";

type ShotProps = {
  /** Chrome label — the address or path the shot would live at. */
  label: string;
  /** Frame aspect, so shots stay a fixed size regardless of what is inside. */
  aspect?: string;
  /** Scales the UI down so it reads as a shot, not as live page furniture. */
  scale?: number;
  /** Set when the UI is taller than the frame, so the crop reads as intentional. */
  cropped?: boolean;
  className?: string;
  children: ReactNode;
};

/** A product shot: real UI, framed in panel chrome and made inert. */
export function Shot({
  label,
  aspect = "16/10",
  scale = 0.86,
  cropped = false,
  className = "",
  children,
}: ShotProps) {
  return (
    <figure
      className={`overflow-hidden rounded-sm border border-background-700 bg-background-950 ${className}`}
    >
      <figcaption className="flex items-center gap-1.5 border-b border-background-700 px-3 py-2 font-mono text-xs text-foreground-400">
        <span className="h-2 w-2 rounded-full bg-background-600" />
        <span className="h-2 w-2 rounded-full bg-background-600" />
        <span className="h-2 w-2 rounded-full bg-background-600" />
        <span className="ml-1 truncate">{label}</span>
      </figcaption>
      <div className="relative overflow-hidden bg-background-900" style={{ aspectRatio: aspect }}>
        <div
          aria-hidden
          className="pointer-events-none absolute left-0 top-0 origin-top-left select-none p-3"
          style={{
            width: `${100 / scale}%`,
            height: `${100 / scale}%`,
            transform: `scale(${scale})`,
            maskImage: cropped ? cropFade : undefined,
            WebkitMaskImage: cropped ? cropFade : undefined,
          }}
        >
          {children}
        </div>
      </div>
    </figure>
  );
}
