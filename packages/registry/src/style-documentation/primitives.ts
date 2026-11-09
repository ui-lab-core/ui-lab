import type { StyleVariablePurpose } from "../types";

// Shared semantics only. Defaults belong to the consuming stylesheet, not this catalog.
export const primitiveStyleVariables: Record<string, StyleVariablePurpose> = {
  "--spacing": { category: "Layout", description: "Base spacing unit" },
  "--padding-inline": { category: "Layout", description: "Horizontal padding" },
  "--padding-block": { category: "Layout", description: "Vertical padding" },
  "--padding": { category: "Layout", description: "Padding on all sides" },
  "--margin": { category: "Layout", description: "Margin on all sides" },
  "--margin-inline": { category: "Layout", description: "Horizontal margin" },
  "--margin-block": { category: "Layout", description: "Vertical margin" },
  "--display": { category: "Layout", description: "Display mode" },
  "--gap": { category: "Layout", description: "Gap between children" },
  "--width": { category: "Layout", description: "Element width" },
  "--height": { category: "Layout", description: "Element height" },
  "--min-width": { category: "Layout", description: "Minimum width" },
  "--max-width": { category: "Layout", description: "Maximum width" },
  "--min-height": { category: "Layout", description: "Minimum height" },
  "--max-height": { category: "Layout", description: "Maximum height" },
  "--position": { category: "Layout", description: "Positioning mode" },
  "--inset": { category: "Layout", description: "Position offsets" },
  "--align-items": { category: "Layout", description: "Cross-axis alignment" },
  "--justify-content": { category: "Layout", description: "Main-axis alignment" },
  "--inset-gap": { category: "Layout", description: "Space between content and border" },
  "--font-body": { category: "Typography", description: "Body font family" },
  "--text-sm-body": { category: "Typography", description: "Small body text scale" },
  "--text-base-body": { category: "Typography", description: "Base body text size" },
  "--leading-sm": { category: "Typography", description: "Small text line height" },
  "--letter-spacing": { category: "Typography", description: "Letter spacing" },
  "--background": { category: "Appearance", description: "Background fill" },
  "--foreground": { category: "Appearance", description: "Text color" },
  "--foreground-muted": { category: "Appearance", description: "Muted text color" },
  "--foreground-400": { category: "Appearance", description: "Secondary foreground color" },
  "--icon-foreground": { category: "Appearance", description: "Icon color" },
  "--background-radius": { category: "Appearance", description: "Outer corner radius" },
  "--radius": { category: "Appearance", description: "Effective corner radius" },
  "--radius-sm": { category: "Appearance", description: "Small radius scale" },
  "--inset-radius": { category: "Appearance", description: "Inset corner radius" },
  "--border-width-base": { category: "Border", description: "Base border width" },
  "--disabled-opacity": { category: "Interaction", description: "Disabled opacity" },
  "--background-hover": { category: "Interaction", description: "Hover background" },
  "--hover-duration": { category: "Interaction", description: "Hover transition duration" },
  "--hover-enter-duration": { category: "Interaction", description: "Hover enter duration" },
  "--hover-leave-duration": { category: "Interaction", description: "Hover leave duration" },
  "--hover-easing": { category: "Interaction", description: "Hover easing function" },
  "--press-easing": { category: "Interaction", description: "Press feedback easing function" },
  "--press-duration": { category: "Interaction", description: "Press feedback duration" },
  "--toggle-easing": { category: "Interaction", description: "Selection change easing function" },
  "--toggle-duration": { category: "Interaction", description: "Selection change duration" },
  "--focus-easing": { category: "Interaction", description: "Focus feedback easing function" },
  "--focus-duration": { category: "Interaction", description: "Focus feedback duration" },
  "--layout-easing": { category: "Interaction", description: "Layout change easing function" },
  "--layout-duration": { category: "Interaction", description: "Layout change duration" },
  "--enter-easing": { category: "Interaction", description: "Surface entrance easing function" },
  "--enter-duration": { category: "Interaction", description: "Surface entrance duration" },
  "--exit-easing": { category: "Interaction", description: "Surface exit easing function" },
  "--exit-duration": { category: "Interaction", description: "Surface exit duration" },
  "--ease-in": { category: "Interaction", description: "Accelerating exit curve" },
  "--ease-out": { category: "Interaction", description: "Decelerating response curve" },
  "--ease-in-out": { category: "Interaction", description: "Standard ease-in-out curve" },
  "--ease-out-quint": { category: "Interaction", description: "Quintic ease-out for layout changes" },
  "--ease-linear": { category: "Interaction", description: "Constant-speed motion" },
};

export function describeStyleVariable(name: string, slot?: string): StyleVariablePurpose {
  if (slot === "border") {
    const descriptions: Record<string, string> = {
      "--width": "Border width",
      "--style": "Border style",
      "--background": "Border color or background",
    };
    if (descriptions[name]) return { category: "Border", description: descriptions[name] };
  }
  return primitiveStyleVariables[name] ?? {
    category: "Appearance",
    description: "Scope-specific styling token; see the stylesheet for its usage.",
  };
}
