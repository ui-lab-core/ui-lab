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
        Icon renders monochrome SVG assets as CSS masks. The browser loads the requested file from a
        public asset directory, while the component remains independent of Vite, Next.js, and other
        bundlers.
      </p>
      <p>
        Fill icons inherit the current text color. Use a label when the icon conveys meaning;
        otherwise it remains hidden from assistive technology.
      </p>
    </div>
  ),
  examples: [],
  variants: [
    {
      id: "fill",
      name: "Fill",
      description: "Resolves a monochrome fill SVG from the configured asset base URL.",
      code: '<Icon variant="fill" id="cake-fill" size={24} />',
      preview: <Icon variant="fill" id="cake-fill" size={32} />,
    },
  ],
};
