"use client";

import { getStarterById } from "@ui-lab-core/library/catalog";
import { DetailPageShell } from "@/features/layout/components/detail-page-shell";
import { WorkshopPreview } from "@/features/workshop";
import { WaitlistModalClient, useWaitlistModal } from "@/features/workshop";
import { Button } from "ui-lab-components";
import { Mail } from "lucide-react";

interface StarterDetailClientProps {
  starterId: string;
}

function StarterDetailContent({ starterId }: StarterDetailClientProps) {
  const starter = getStarterById(starterId);
  const modalContext = useWaitlistModal();

  if (!starter) {
    return <DetailPageShell name="" description="" notFoundLabel="Starter not found." />;
  }

  const isPremium = starter.pricing && starter.pricing.price !== null;

  return (
    <DetailPageShell
      name={starter.name}
      description={starter.description}
      tags={starter.tags}
      actions={
        isPremium ? (
          <Button icon={{ left: <Mail /> }} size="md" variant="primary" onClick={modalContext.openModal}>
            Join waitlist
          </Button>
        ) : undefined
      }
    >
      <WorkshopPreview headingId="starter-files" hidePreview files={starter.files} />
    </DetailPageShell>
  );
}

export default function StarterDetailClient(props: StarterDetailClientProps) {
  return (
    <WaitlistModalClient>
      <StarterDetailContent {...props} />
    </WaitlistModalClient>
  );
}
