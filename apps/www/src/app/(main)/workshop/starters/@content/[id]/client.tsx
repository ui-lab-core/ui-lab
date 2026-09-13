"use client";

import { use } from "react";

import { DetailPageShell } from "@/features/layout/components/detail-page-shell";
import { WorkshopPreview } from "@/features/workshop";
import { getPreviewComponent } from "@/features/starters";
import type { WorkshopStarter } from "@/features/workshop/types/content";

interface StarterDetailClientProps {
  /** Resolved on the server against the viewer's entitlement. */
  starterPromise: Promise<WorkshopStarter | null>;
}

export default function StarterDetailClient({ starterPromise }: StarterDetailClientProps) {
  const starter = use(starterPromise);
  if (!starter) {
    return <DetailPageShell name="" description="" notFoundLabel="Starter not found." />;
  }

  const CardPreview = getPreviewComponent(starter.id);

  return (
    <DetailPageShell
      name={starter.name}
      description={starter.description}
      tags={starter.tags}
      preview={CardPreview ? <CardPreview /> : undefined}
    >
      <WorkshopPreview
        entryRef={`starter:${starter.id}`}
        entryHref={`/workshop/starters/${encodeURIComponent(starter.id)}#starter-files`}
        title={starter.name}
        headingId="starter-files"
        category="starter"
        hidePreview
        files={starter.files}
        locked={starter.locked}
      />
    </DetailPageShell>
  );
}
