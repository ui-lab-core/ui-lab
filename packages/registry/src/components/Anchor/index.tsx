import React from "react";
import { ComponentDetail } from "@/types";

export const anchorDetail: ComponentDetail = {
  id: "anchor",
  name: "Anchor",
  description: "A styled link component with an animated underline and an optional hover preview.",
  overview: (
    <div className="space-y-4 text-foreground-300">
      <p>
        The Anchor component renders a link with an animated underline whose line treatment is
        selected with the <code>variant</code> prop. It renders a native anchor element when{" "}
        <code>href</code> is supplied and a span otherwise.
      </p>
      <p>
        Supply <code>preview</code> content, or an <code>&lt;Anchor.Preview&gt;</code> child in
        client components, to show supplementary information in a Tooltip overlay on hover and
        keyboard focus. It is well suited to links embedded in prose.
      </p>
    </div>
  ),
  examples: [],
};
