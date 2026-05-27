'use client';

import { getPreviewComponent as getSectionPreviewComponent } from '../lib/get-section-preview';

type SectionLivePreviewProps = {
  demoId: string;
};

export function SectionLivePreview({ demoId }: SectionLivePreviewProps) {
  const PreviewComponent = getSectionPreviewComponent(demoId);

  if (!PreviewComponent) {
    return (
      <div className="p-8 text-center text-foreground-400 text-sm">
        No preview available
      </div>
    );
  }

  return <PreviewComponent />;
}
