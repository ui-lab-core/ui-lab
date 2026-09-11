import * as React from "react";
import css from "./useHighlight.module.css";

export interface UseHighlightOptions {
  /** Literal, case-insensitive search text. Empty queries leave content unchanged. */
  query: string;
}

export interface UseHighlightReturn {
  /** Props for a text-only highlight surface, without layout or typography changes. */
  highlightProps: { className: string; "data-highlight": "true" };
  /** Highlights strings and numbers. Custom React elements are preserved unchanged. */
  highlight: (content: React.ReactNode) => React.ReactNode;
}

const highlightProps: UseHighlightReturn["highlightProps"] = {
  className: css.highlight,
  "data-highlight": "true",
};

export function useHighlight({ query }: UseHighlightOptions): UseHighlightReturn {
  const highlight = React.useCallback((content: React.ReactNode): React.ReactNode => {
    if (!query || (typeof content !== "string" && typeof content !== "number")) {
      return content;
    }

    const text = String(content);
    const pattern = new RegExp(query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "gi");
    const parts: React.ReactNode[] = [];
    let offset = 0;

    for (const match of text.matchAll(pattern)) {
      const start = match.index!;
      if (start > offset) parts.push(text.slice(offset, start));
      parts.push(React.createElement("mark", { ...highlightProps, key: start }, match[0]));
      offset = start + match[0].length;
    }

    if (!parts.length) return content;
    if (offset < text.length) parts.push(text.slice(offset));
    return parts;
  }, [query]);

  return { highlightProps, highlight };
}
