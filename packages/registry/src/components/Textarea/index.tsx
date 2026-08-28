import React from "react";
import { ComponentDetail } from "@/types";

export const textareaDetail: ComponentDetail = {
  id: "textarea",
  name: "TextArea",
  description: "A multi-line text input component for collecting longer text input from users.",
  overview: (
    <div className="space-y-4 text-foreground-300">
      <p>
        TextArea renders a native multi-line text field inside a wrapper that owns the resize
        handle, the optional capped scroll surface, and the optional character count. It suits
        comments, descriptions, and messages where a single-line Input is not enough.
      </p>
      <p>
        Size presets set the minimum height and text density, <code>resize</code> selects the axis
        of the custom drag handle, <code>maxHeight</code> caps the visible height and grows the
        field with its content, and <code>maxCharacters</code> truncates input while
        <code>showCharacterCount</code> reports progress against the limit.
      </p>
    </div>
  ),
  examples: [],
};
