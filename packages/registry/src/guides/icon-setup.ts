import type { GuideMetadata } from "../types.js";

const iconSetupGuide: GuideMetadata = {
  id: "icon-setup",
  name: "Set Up Icon Assets",
  description: "Configure IconProvider, SVG asset serving, collection IDs, and icon slot sizing.",
  category: "setup",
  summary: "Icon is a CSS-mask renderer for an application-owned SVG collection. Installing components alone does not install icon files.",
  tags: ["icon", "icons", "lumen", "assets", "provider", "svg"],
  whenToUse: ["Icons are blank or missing", "Installing an icon collection", "Finding valid icon ids or configuring IconProvider"],
  notFor: ["Assuming a universal built-in list of icon ids; collections are application-defined"],
  taskMatchers: ["install icons", "icon ids", "lumen icons", "missing icon", "IconProvider", "icon route"],
  prerequisites: ["An SVG collection you are entitled to serve, organized as variant/id.svg"],
  validation: ["The requested SVG URL returns image/svg+xml and the icon renders at the expected slot size."],
  relatedTools: ["get_component"],
  steps: [
    {
      title: "Serve the collection",
      goal: "Make the exact URL used by Icon return an SVG.",
      instructions: [
        "For static assets place files at public/ui/icons/{variant}/{id}.svg, or use your framework's equivalent public directory. /ui/icons is the default base URL.",
        "For on-demand Node serving use createIconRouteHandler from the icon-route subpath. root points at a directory containing variant folders. This handler reads the filesystem and must remain server-side.",
        "In Next.js mount the handler at app/ui/icons/[...slug]/route.ts; in static Vite deployments use public assets or a separate server route.",
      ],
      code: 'import { createIconRouteHandler } from "ui-lab-components/icon-route";\nexport const { GET } = createIconRouteHandler({ root: "assets/icons" });',
      language: "tsx",
    },
    {
      title: "Configure the client provider",
      goal: "Match the URL and variant to the collection actually installed.",
      instructions: [
        "Import IconProvider from ui-lab-components/icon-provider inside a client boundary. Set default-variant to an existing folder name; there is no implicit variant.",
        "Use the collection's manifest or installed filenames for ids. Do not guess identifiers from a different icon family. The library/MCP does not know every consuming application's inventory.",
        "A per-icon asset-url overrides a provider resolver. Otherwise resolve-source wins over the provider base URL. A failed mask is visually blank; development warns with the attempted URL.",
      ],
      code: '"use client";\nimport { IconProvider } from "ui-lab-components/icon-provider";\nimport { Icon } from "ui-lab-components/icon";\nexport function Example() {\n  return <IconProvider asset-url="/ui/icons" default-variant="stroke"><Icon id="plus" label="Add" /></IconProvider>;\n}\n// Requires an actual /ui/icons/stroke/plus.svg asset.',
      language: "tsx",
    },
    {
      title: "Use slots and accessible names",
      goal: "Keep icons sized and labeled consistently with their containing controls.",
      instructions: [
        "Icon is a span, not an svg. The default size inherits --icon-size with a 20px standalone fallback; supported control slots set that variable. Explicit size overrides it.",
        "Icons are decorative by default. Name meaningful standalone icons with label, and name icon-only Buttons with aria-label rather than relying on decorative icon content.",
        "Keep user-facing shortcut hints in Tooltip when intentionally using an explicitly square icon-size Button.",
      ],
    },
  ],
};

export default iconSetupGuide;
