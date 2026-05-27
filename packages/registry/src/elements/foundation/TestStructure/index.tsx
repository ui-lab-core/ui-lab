import React from 'react';
import type { ElementMetadata } from '../../../types.js';
import variationsData from './variations.json' with { type: 'json' };

const baseMetadata = {
  id: 'test-structure',
  name: 'Test Structure',
  description: 'Nested multi-file layout fixture used to verify the workshop file tree panel.',
  category: 'layout' as const,
  tags: ['test', 'nested', 'layout', 'tree'],
  layout: {
    layoutClass: 'test-structure',
    columnSpan: 3,
    rowSpan: 6,
  },
  componentDependencies: [],
};

const elementMetadata: ElementMetadata = {
  ...baseMetadata,
  variants: Object.entries(variationsData).map(([_key, variation]: any) => ({
    name: variation.name,
    description: variation.description,
    demoPath: variation.demoPath,
    files: variation.files,
  })),
};

export function getPreview(): React.ReactNode {
  return (
    <div className="flex flex-col gap-3 w-full rounded-sm border border-background-700 bg-background-950 p-3">
      <div className="h-8 rounded-sm border border-background-700 bg-background-900" />
      <div className="grid grid-cols-[14rem_1fr] gap-3">
        <div className="space-y-2 rounded-sm border border-background-700 bg-background-900 p-2">
          <div className="h-3 w-3/4 rounded-sm bg-background-700" />
          <div className="h-3 w-5/6 rounded-sm bg-background-700/80" />
          <div className="h-3 w-2/3 rounded-sm bg-background-700/70" />
        </div>
        <div className="space-y-3 rounded-sm border border-background-700 bg-background-900 p-3">
          <div className="h-3 w-32 rounded-sm bg-background-700" />
          <div className="grid grid-cols-2 gap-2">
            <div className="h-16 rounded-sm bg-background-800" />
            <div className="h-16 rounded-sm bg-background-800" />
          </div>
        </div>
      </div>
    </div>
  );
}

export const metadata = baseMetadata;
export default elementMetadata;


