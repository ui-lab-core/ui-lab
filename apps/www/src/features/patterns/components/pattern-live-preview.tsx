'use client';

import { getPreviewComponent as getPatternPreviewComponent } from '../lib/get-pattern-preview';
import { getPatternDemo } from 'ui-lab-registry/demo-registry';

type PatternLivePreviewProps = {
  scope: 'pattern' | 'variation';
  id: string;
};

export function PatternLivePreview({ scope, id }: PatternLivePreviewProps) {
  const PreviewComponent =
    scope === 'pattern'
      ? getPatternPreviewComponent(id)
      : getPatternDemo(id);

  if (!PreviewComponent) {
    return (
      <div className="p-8 text-center text-foreground-400 text-sm">
        No preview available
      </div>
    );
  }

  return <PreviewComponent />;
}
