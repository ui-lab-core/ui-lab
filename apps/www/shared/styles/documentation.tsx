import { Code } from "../code/code";
import type { ComponentStyleDocumentation } from "ui-lab-registry";

export type CssVariable = {
  declared?: boolean;
  description?: string;
  scopes?: string[];
  name: string;
  value: string;
  referencedVars?: string[];
  selector: string;
  atRules?: string[];
  slot?: string;
};

type StyleSlot = { name: string; description?: string; type?: string };
type StyleableGroup = { name: string; slots: StyleSlot[] };

export type StyleInfo = {
  rawCss: string;
  onyxThemeCss?: string;
  cssVariables: CssVariable[];
  styleableParts: Array<{ name: string }>;
  styleableGroups?: StyleableGroup[];
  documentation?: ComponentStyleDocumentation;
};

export function Styles({ componentId, styles }: { componentId: string; styles: StyleInfo | null }) {
  if (!styles || (!styles.rawCss && !styles.onyxThemeCss)) {
    return <p className="py-8 text-foreground-400">No styles available for this component.</p>;
  }

  return (
    <div className="space-y-12">
      {styles.rawCss ? (
        <section id="styles-css-module" className="scroll-mt-20">
          <Code showLineNumbers language="css" heading={`${componentId}.module.css`}>
            {styles.rawCss}
          </Code>
        </section>
      ) : null}
      {styles.onyxThemeCss ? (
        <section id="styles-onyx-theme" className="scroll-mt-20">
          <Code showLineNumbers language="css" heading="onyx/styles.css">
            {styles.onyxThemeCss}
          </Code>
        </section>
      ) : null}
    </div>
  );
}
