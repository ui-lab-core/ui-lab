import React from "react";
import { Icon } from "ui-lab-components";
import { ComponentDetail } from "@/types";

export const iconDetail: ComponentDetail = {
  id: "icon",
  name: "Icon",
  description: "A framework-agnostic icon that resolves local SVG assets by variant and filename.",
  overview: (
    <div className="space-y-4 text-foreground-300">
      <p>
        Icon renders SVG assets as CSS masks. The browser loads{" "}
        <code>/ui/icons/&lt;variant&gt;/&lt;id&gt;.svg</code>, while the component remains independent
        of Vite, Next.js, and other bundlers. These examples use the Lumen set from the{" "}
        <a href="/library/icons">icon library</a>, whose only variant, <code>duo-tone</code>, is set
        as the provider default.
      </p>
      <p>
        Icons inherit the current text color; Lumen's back layer keeps its 34% opacity through the
        mask, so the duo-tone survives any color. Use a label when the icon conveys meaning;
        otherwise it remains hidden from assistive technology.
      </p>
    </div>
  ),
  examples: [],
  variants: [
    {
      id: "duo-tone",
      name: "Duo-tone",
      description: "Resolves a Lumen duo-tone SVG from the provider's default variant.",
      code: '<Icon id="folder" size={24} />',
      preview: <Icon id="folder" size={32} />,
    },
    {
      id: "color",
      name: "Color",
      description: "Inherits the current text color; the back layer stays at 34% opacity.",
      code: '<Icon id="bell" size={24} className="text-accent-500" />',
      preview: <Icon id="bell" size={32} className="text-accent-500" />,
    },
    {
      id: "labelled",
      name: "Labelled",
      description: "Exposes the icon to assistive technology when it conveys meaning.",
      code: '<Icon id="wifi" size={24} label="Connected to Wi-Fi" />',
      preview: <Icon id="wifi" size={32} label="Connected to Wi-Fi" />,
    },
  ],
};
