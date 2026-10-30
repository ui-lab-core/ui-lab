import { lumenIcons } from "@ui-lab-core/library/icons";
import { canAccessContent, getLumenIconSvg } from "@ui-lab-core/library/server";
import { getViewerEntitlement } from "@/features/entitlements/server";

const SEGMENT_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

// Serves `/ui/icons/<variant>/<id>.svg` for the Lumen set from the private
// library, gated like any other catalog entry. Files already in
// `public/ui/icons` are matched before this route.
export async function GET(_request: Request, { params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await params;
  if (slug.length !== 2) return new Response("Not found", { status: 404 });

  const [variant, file] = slug;
  const id = file.endsWith(".svg") ? file.slice(0, -4) : file;
  if (!SEGMENT_PATTERN.test(variant) || !SEGMENT_PATTERN.test(id)) {
    return new Response("Not found", { status: 404 });
  }

  if (lumenIcons.access !== "free" && !canAccessContent(lumenIcons, await getViewerEntitlement())) {
    return new Response("Supporter access required", { status: 403 });
  }

  const svg = await getLumenIconSvg(variant, id);
  if (!svg) return new Response("Not found", { status: 404 });

  return new Response(svg, {
    headers: {
      "Content-Type": "image/svg+xml",
      "Cache-Control":
        lumenIcons.access === "free" ? "public, max-age=3600" : "private, max-age=3600",
    },
  });
}
