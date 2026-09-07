import { Suspense } from "react";
import { resolveSavedPreviews } from "@/features/saved-items/resolve-previews";
import { SavedPreviewViewport } from "@/features/saved-items/saved-preview-viewport";

export default function SavedPreviewPage({ searchParams }: {
  searchParams: Promise<{ ref?: string | string[] }>;
}) {
  return <Suspense fallback={<p role="status">Loading preview…</p>}>
    <SavedPreviewContent searchParams={searchParams} />
  </Suspense>;
}

async function SavedPreviewContent({ searchParams }: {
  searchParams: Promise<{ ref?: string | string[] }>;
}) {
  const params = await searchParams;
  const entryRef = typeof params.ref === "string" ? params.ref : "";
  const targets = await resolveSavedPreviews([entryRef]);
  return <SavedPreviewViewport entryRef={entryRef} targets={targets} />;
}
