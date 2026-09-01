"use client";

import { getStarterById } from "@ui-lab-core/library/catalog";
import { DetailPageShell } from "@/features/layout/components/detail-page-shell";
import { WorkshopPreview } from "@/features/workshop";
import { getPreviewComponent } from "@/features/starters";

interface StarterDetailClientProps {
  starterId: string;
}

export default function StarterDetailClient({ starterId }: StarterDetailClientProps) {
  const starter = getStarterById(starterId);

  if (!starter) {
    return <DetailPageShell name="" description="" notFoundLabel="Starter not found." />;
  }

  const isPremium = starter.access === "premium";
  const CardPreview = getPreviewComponent(starterId);

  return (
    <DetailPageShell
      name={starter.name}
      description={starter.description}
      tags={starter.tags}
      preview={CardPreview ? <CardPreview /> : undefined}
    >
      <WorkshopPreview
        headingId="starter-files"
        hidePreview
        files={starter.files}
        locked={isPremium}
      />
    </DetailPageShell>
  );
}
