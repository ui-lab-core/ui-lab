import type { ComponentAPIEnrichment, PropDefinition } from "../../types";

const prop = (name: string, type: string, description: string, defaultValue?: string): PropDefinition => ({
  name, type, description, defaultValue, required: false,
});

export const apiEnrichment: ComponentAPIEnrichment = {
  props: [
    prop("viewport-ref", "React.Ref<HTMLDivElement>", "Ref to the inner scrolling viewport. The component's forwarded ref points to the outer root."),
    prop("max-height", "string", "Maximum vertical size as a CSS length, for example 20rem."),
    prop("max-width", "string", "Maximum horizontal size as a CSS length."),
    prop("direction", '"vertical" | "horizontal"', "Scrollable axis. The root fills its parent's height in vertical mode or width in horizontal mode.", '"vertical"'),
    prop("padding-y", "string | number", "Vertical scrollbar inset. Numbers are pixels; strings are CSS lengths.", "4"),
    prop("fade-y", "boolean", "Enable vertical edge fades.", "false"),
    prop("fade-x", "boolean", "Enable horizontal edge fades.", "false"),
    prop("fade-distance", "number", "Scroll distance in pixels over which an edge fade reaches full strength.", "5"),
    prop("fade-size", "number", "Maximum edge fade size as a percentage of the viewport.", "4"),
    prop("enabled", "boolean", "Enable the custom scrollbar and overflow management.", "true"),
    prop("hide", "boolean", "Hide the thumb until hover, scrolling, or dragging.", "true"),
    prop("inline", "boolean", "Reserve a content gutter for the scrollbar instead of letting it cover content.", "false"),
    prop("scroll-mode", '"native" | "programmatic"', "Native permits user scrolling. Programmatic allows scrollTop/scrollLeft updates but lets wheel input fall through to the document.", '"native"'),
    prop("storage-key", "string", "Session-storage key used to restore the scroll offset."),
  ],
};
