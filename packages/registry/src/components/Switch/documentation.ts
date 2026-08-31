import type { ComponentStyleDocumentation } from "../../types";

export const styleDocumentation = {
  quickStart: {
    title: "How to style Switch",
    description:
      "Use className for root layout, styles for concrete anatomy classes, and root variables with @slot blocks for cascading defaults. All parts remain inside the root.",
    recipes: [
      {
        title: "Resize the root",
        description: "Set the root width without changing the thumb's size or travel calculation.",
        code: '<Switch className="[--width:3rem]" aria-label="Notifications" />',
      },
      {
        title: "Style named parts",
        description: "Each class value applies only to its matching element. The input and local focus indicator are also public slots.",
        code: `<Switch
  aria-label="Notifications"
  styles={{ track: "bg-background-800", thumb: "bg-accent-400" }}
/>`,
      },
      {
        title: "Coordinate geometry",
        description: "Author variables on the global root and scope thumb measurements with @slot; process this CSS with UI Lab's PostCSS plugin.",
        code: `.switch {
  --width: 3rem;
  --height: 1.5rem;
  @slot thumb {
    --size: 1.2rem;
    --height: 1.2rem;
    --offset: 0.15rem;
  }
}`,
      },
      {
        title: "Style checked state",
        description: "The root emits data-selected only when checked. Persistent focus attributes use true and false values.",
        code: `<Switch
  aria-label="Notifications"
  styles={{ root: "data-[selected=true]:ring-2 data-[disabled=true]:opacity-40" }}
/>`,
      },
    ],
  },
  anatomy: {
    title: "Anatomy",
    description:
      "Switch exposes root, track, thumb, input, and focusIndicator. Root classes and inline style apply to the outer .switch surface; native props and the forwarded ref target the input. Slots accept classes only. The track and thumb also retain the switch-track and switch-thumb hooks.",
    groupOrder: ["SwitchStyleSlots"],
    groupLabels: { SwitchStyleSlots: "Switch" },
  },
  customization: {
    title: "Customize Switch",
    description:
      "Set generic variables on .switch and configure individual parts with @slot track or @slot thumb. Variables define cascading defaults; styles supplies concrete class overrides for each rendered part.",
    groups: [
      {
        title: "Root geometry",
        description: "Coordinate the outer dimensions and corner shape with the moving thumb.",
        variables: [
          { name: "--width", selector: ".switch", description: "Sets the track width and the thumb's selected travel distance." },
          { name: "--height", selector: ".switch", description: "Sets the outer height." },
          { name: "--radius", selector: ".switch", description: "Sets the root radius and the fallback radius for the track and thumb." },
        ],
        code: `.switch {
  --width: 2.75rem;
  --height: 1.5rem;
  --radius: 9999px;
}`,
      },
      {
        title: "Track colors and border",
        description: "Set base and selected colors in one track scope. Unset state values inherit the track's base values; base colors fall back to root --background and --background-border.",
        variables: [
          { name: "--background", selector: ".switch", slot: "track", description: "Sets the track fill." },
          { name: "--background-selected", selector: ".switch", slot: "track", description: "Sets the checked track fill." },
          { name: "--background-border", selector: ".switch", slot: "track", description: "Sets the track border color." },
          { name: "--background-border-selected", selector: ".switch", slot: "track", description: "Sets the checked track border color." },
          { name: "--width", selector: ".switch", slot: "track", description: "Sets border thickness, independently of the root width." },
          { name: "--style", selector: ".switch", slot: "track", description: "Sets the border line style." },
          { name: "--radius", selector: ".switch", slot: "track", description: "Overrides the track's corner radius." },
        ],
        code: `.switch {
  @slot track {
    --background: var(--background-800);
    --background-selected: var(--accent-600);
    --background-border: var(--background-600);
    --background-border-selected: var(--accent-500);
    --width: 1px;
    --style: solid;
    --radius: var(--radius);
  }
}`,
      },
      {
        title: "Thumb appearance and position",
        description: "Configure the movable thumb independently. Its fill falls back to root --foreground, and its selected fill falls back to its base fill.",
        variables: [
          { name: "--size", selector: ".switch", slot: "thumb", description: "Sets thumb width and fallback height; also determines selected travel." },
          { name: "--height", selector: ".switch", slot: "thumb", description: "Overrides thumb height without changing its width." },
          { name: "--offset", selector: ".switch", slot: "thumb", description: "Sets the logical inset at either end of the track." },
          { name: "--background", selector: ".switch", slot: "thumb", description: "Sets the thumb fill." },
          { name: "--background-selected", selector: ".switch", slot: "thumb", description: "Overrides the checked thumb fill." },
          { name: "--radius", selector: ".switch", slot: "thumb", description: "Overrides the thumb corner radius." },
          { name: "--border", selector: ".switch", slot: "thumb", description: "Sets the thumb border shorthand." },
        ],
        code: `.switch {
  @slot thumb {
    --size: 1.1rem;
    --height: 1.1rem;
    --offset: 0.15rem;
    --background: var(--foreground-100);
    --background-selected: var(--accent-50);
    --radius: 9999px;
    --border: 1px solid transparent;
  }
}`,
      },
      {
        title: "Disabled state and motion",
        description: "Adjust the whole switch's disabled opacity and shared track/thumb transitions.",
        variables: [
          { name: "--disabled-opacity", selector: ".switch", description: "Sets root opacity while disabled." },
          { name: "--hover-duration", selector: ".switch", description: "Sets track color and thumb movement transition duration." },
          { name: "--hover-transition-timing-function", selector: ".switch", description: "Sets easing for track color and thumb movement." },
        ],
        code: `.switch {
  --disabled-opacity: 0.45;
  --hover-duration: 180ms;
  --hover-transition-timing-function: ease-out;
}`,
      },
    ],
  },
} satisfies ComponentStyleDocumentation;
