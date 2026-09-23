import { readFile } from "node:fs/promises";
import path from "node:path";

/**
 * Server-side handler factory for serving icon SVGs on demand.
 *
 * The default `<IconProvider>` asset base URL is `/ui/icons`, and `<Icon>`
 * resolves each icon to `{base}/{variant}/{id}.svg`. Rather than copying an
 * entire icon set into a framework's static/public directory — which exposes
 * every asset — mount this handler at that route and it reads only the icons
 * actually requested from a source directory you control.
 *
 * It speaks the Web Fetch `Request`/`Response` contract, so it works with any
 * framework whose route handlers do (e.g. a Next.js App Router
 * `app/ui/icons/[...slug]/route.ts`):
 *
 * ```ts
 * import { createIconRouteHandler } from "ui-lab-components/icon-route";
 * export const { GET } = createIconRouteHandler({ root: "assets/icons" });
 * ```
 */

const SEGMENT_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export interface IconRouteHandlerOptions {
  /**
   * Directory that contains the variant folders (each holding `{id}.svg`
   * files). Absolute, or relative to `process.cwd()`.
   */
  root: string;
  /** `Cache-Control` header for served icons. Defaults to one immutable year. */
  cacheControl?: string;
}

/** Route context shape shared by frameworks that pass dynamic segments as `params`. */
export interface IconRouteContext {
  params: Promise<{ slug: string[] }> | { slug: string[] };
}

export interface IconRouteHandler {
  GET(request: Request, context: IconRouteContext): Promise<Response>;
}

export function createIconRouteHandler(options: IconRouteHandlerOptions): IconRouteHandler {
  const root = path.isAbsolute(options.root)
    ? options.root
    : path.join(process.cwd(), options.root);
  const cacheControl = options.cacheControl ?? "public, max-age=31536000, immutable";

  async function GET(_request: Request, context: IconRouteContext): Promise<Response> {
    const { slug } = await context.params;

    // Expect exactly `{variant}/{file}`. The strict segment pattern also blocks
    // path traversal, since `.` and `/` cannot appear in a valid segment.
    if (!Array.isArray(slug) || slug.length !== 2) {
      return new Response("Not found", { status: 404 });
    }

    const [variant, file] = slug;
    const id = file.endsWith(".svg") ? file.slice(0, -4) : file;

    if (!SEGMENT_PATTERN.test(variant) || !SEGMENT_PATTERN.test(id)) {
      return new Response("Not found", { status: 404 });
    }

    try {
      const svg = await readFile(path.join(root, variant, `${id}.svg`));
      return new Response(svg, {
        headers: {
          "Content-Type": "image/svg+xml",
          "Cache-Control": cacheControl,
        },
      });
    } catch {
      return new Response("Not found", { status: 404 });
    }
  }

  return { GET };
}
