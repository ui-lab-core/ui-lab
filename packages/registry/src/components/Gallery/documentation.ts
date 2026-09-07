import type { ComponentStyleDocumentation } from "../../types";

export const styleDocumentation = {
  quickStart: {
    title: "How to style Gallery",
    description:
      "Start with className for the grid's own layout, then use styles on Gallery.Item, Gallery.View, or Gallery.Body for a one-off part, and CSS variables when a color or shape decision should cascade to every item.",
    recipes: [
      {
        title: "Size the grid",
        description: "Use className when the root grid element is all you need to change.",
        code: '<Gallery className="max-w-4xl" columns={3}>\n  <Gallery.Item>...</Gallery.Item>\n</Gallery>',
      },
      {
        title: "Style an item's view or body",
        description:
          "Use each compound part's own styles prop for a one-off override, or Gallery's styles for a bulk change applied to every item, view, or body it renders.",
        code: `<Gallery styles={{ view: "rounded-lg" }}>
  <Gallery.Item styles={{ root: "shadow-lg" }}>
    <Gallery.View aspectRatio="1/1">
      <img src="/photo.jpg" alt="" />
    </Gallery.View>
    <Gallery.Body>
      <strong>Title</strong>
      <span>Description</span>
    </Gallery.Body>
  </Gallery.Item>
</Gallery>`,
      },
      {
        title: "Cascade item and border colors",
        description:
          "Set the item and border slots' variables on a class targeting the Gallery root; every item, and its border, inherits them unless a hover, pressed, or disabled state overrides them.",
        code: `<Gallery className="brand-gallery">
  <Gallery.Item href="/photo">...</Gallery.Item>
</Gallery>

/* .brand-gallery {
  @slot item {
    --background: var(--accent-950);
    --radius: var(--radius-lg);
  }
  @slot border {
    --background: var(--accent-700);
  }
} */`,
      },
      {
        title: "Style a selected or disabled item",
        description: "Target the data-selected or data-disabled state from the item's own root style slot.",
        code: `<Gallery.Item selected styles={{ root: "data-[selected=true]:ring-2 ring-accent-500" }}>
  ...
</Gallery.Item>`,
      },
    ],
  },
  anatomy: {
    title: "Anatomy",
    description: "Choose a named Gallery, Gallery.Item, Gallery.View, or Gallery.Body slot to style the corresponding region of the component.",
    groupOrder: [
      "GalleryStyleSlots",
      "GalleryItemStyleSlots",
      "GalleryViewStyleSlots",
      "GalleryBodyStyleSlots",
    ],
    groupLabels: {
      GalleryStyleSlots: "Gallery",
      GalleryItemStyleSlots: "Gallery.Item",
      GalleryViewStyleSlots: "Gallery.View",
      GalleryBodyStyleSlots: "Gallery.Body",
    },
  },
  customization: {
    title: "Customize Gallery",
    description:
      "Use the item, border, view, and body slots to change every Gallery.Item's rendered element without reaching into Gallery's internal descendants. These variables are set once on the Gallery root and cascade to every item it renders.",
    groups: [
      {
        title: "Item appearance",
        description: "Set the base fill and corner radius shared by every item.",
        variables: [
          {
            name: "--background",
            selector: ".gallery",
            slot: "item",
            description: "Sets the base background color for every item's rendered element.",
          },
          {
            name: "--radius",
            selector: ".gallery",
            slot: "item",
            description: "Sets every item's corner radius.",
          },
          {
            name: "--disabled-opacity",
            selector: ".gallery",
            slot: "item",
            description: "Sets the opacity of a disabled item.",
          },
        ],
        code: `.gallery {
  @slot item {
    --background: var(--accent-950);
    --radius: var(--radius-lg);
    --disabled-opacity: 0.4;
  }
}`,
      },
      {
        title: "Item border and interaction states",
        description: "Adjust the item border without replacing Gallery's structural CSS.",
        variables: [
          {
            name: "--width",
            selector: ".gallery",
            slot: "border",
            description: "Sets the item border width.",
          },
          {
            name: "--style",
            selector: ".gallery",
            slot: "border",
            description: "Sets the item border style.",
          },
          {
            name: "--background",
            selector: ".gallery",
            slot: "border",
            description: "Sets the item border color.",
          },
          {
            name: "--background-hover",
            selector: ".gallery",
            slot: "border",
            description: "Sets the item border color while hovered.",
          },
          {
            name: "--background-pressed",
            selector: ".gallery",
            slot: "border",
            description: "Sets the item border color while pressed.",
          },
        ],
        code: `.gallery {
  @slot border {
    --width: 2px;
    --style: solid;
    --background: var(--background-border);
    --background-hover: var(--accent-600);
    --background-pressed: var(--accent-700);
  }
}`,
      },
      {
        title: "View fill",
        description: "Set the placeholder fill shown behind a view's image or video before it loads.",
        variables: [
          {
            name: "--background",
            selector: ".gallery",
            slot: "view",
            description: "Sets the background color of every item's view area.",
          },
        ],
        code: `.gallery {
  @slot view {
    --background: var(--background-900);
  }
}`,
      },
      {
        title: "Body typography and spacing",
        description: "Adjust the gap, padding, and text colors shared by every item's body.",
        variables: [
          {
            name: "--gap",
            selector: ".gallery",
            slot: "body",
            description: "Sets the gap between a body's title and description.",
          },
          {
            name: "--padding",
            selector: ".gallery",
            slot: "body",
            description: "Sets the padding around a body's content.",
          },
          {
            name: "--foreground",
            selector: ".gallery",
            slot: "body",
            description: "Sets the color of a body's first child, treated as the title.",
          },
          {
            name: "--foreground-muted",
            selector: ".gallery",
            slot: "body",
            description: "Sets the color of a body's remaining children, treated as the description.",
          },
        ],
        code: `.gallery {
  @slot body {
    --gap: 0.5rem;
    --padding: 1rem;
    --foreground: var(--foreground-50);
    --foreground-muted: var(--foreground-400);
  }
}`,
      },
    ],
  },
} satisfies ComponentStyleDocumentation;
