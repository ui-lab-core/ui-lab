import React from 'react';
import { Flex, Frame } from 'ui-lab-components';
import { ControlDef, ComponentDetail } from '@/types';

const BASE_FRAME_STYLE = {
  '--frame-fill': 'var(--background-900)',
  '--frame-stroke-color': 'var(--background-600)',
} as React.CSSProperties;

const flexControls: ControlDef[] = [
  {
    name: 'direction',
    label: 'Direction',
    type: 'select',
    options: [
      { label: 'Row', value: 'row' },
      { label: 'Column', value: 'column' },
    ],
    defaultValue: 'row',
  },
  {
    name: 'gap',
    label: 'Gap',
    type: 'select',
    options: [
      { label: 'Extra Small', value: 'xs' },
      { label: 'Small', value: 'sm' },
      { label: 'Medium', value: 'md' },
      { label: 'Large', value: 'lg' },
      { label: 'Extra Large', value: 'xl' },
    ],
    defaultValue: 'md',
  },
  {
    name: 'justify',
    label: 'Justify Content',
    type: 'select',
    options: [
      { label: 'Start', value: 'justify-start' },
      { label: 'Center', value: 'justify-center' },
      { label: 'End', value: 'justify-end' },
      { label: 'Space Between', value: 'justify-between' },
    ],
    defaultValue: 'justify-start',
  },
  {
    name: 'align',
    label: 'Align Items',
    type: 'select',
    options: [
      { label: 'Start', value: 'align-start' },
      { label: 'Center', value: 'align-center' },
      { label: 'End', value: 'align-end' },
      { label: 'Stretch', value: 'align-stretch' },
    ],
    defaultValue: 'align-stretch',
  },
];

const flexBasicCode = `import { Flex, Frame } from "ui-lab-components";

export function Example() {
  return (
    <Flex gap="md" align-stretch>
      <Frame pathStroke="dashed" style={{ width: "5rem", height: "7rem" }} />
      <Frame pathStroke="dashed" style={{ width: "11rem", height: "7rem", flex: "1 1 12rem" }} />
      <Flex direction="column" gap="sm" style={{ width: "5.5rem" }}>
        <Frame pathStroke="dashed" style={{ width: "5.5rem", height: "3.75rem" }} />
        <Frame pathStroke="dashed" style={{ width: "5.5rem", height: "2.5rem" }} />
      </Flex>
    </Flex>
  );
}`;

function FlexFrame({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <Frame pathStroke="dashed" className={className} style={{ ...BASE_FRAME_STYLE, ...style }}>
      <div className="size-full" />
    </Frame>
  );
}

export const flexDetail: ComponentDetail = {
  id: 'flex',
  name: 'Flex',
  description: 'A flexible layout component for building responsive layouts with CSS Flexbox.',
  overview: (
    <div className="space-y-4 text-foreground-300">
      <p>
        The Flex component provides a convenient way to apply flexbox layout patterns. It enforces
        consistency via the design system's spacing scale and simplifies responsive behavior.
      </p>
    </div>
  ),
  examples: [
    {
      id: 'preview',
      title: 'Preview',
      description: 'Adjust props to customize the component',
      code: flexBasicCode,
      preview: null,
      previewLayout: 'start',
      controls: flexControls,
      renderPreview: (props: any) => {
        return (
          <Flex
            direction={props.direction as any}
            gap={props.gap as any}
            {...(props.justify ? { [props.justify]: true } : {})}
            {...(props.align ? { [props.align]: true } : {})}
            className="w-full"
          >
            <FlexFrame className="shrink-0" style={{ width: '5rem', height: '7rem' }} />
            <FlexFrame className="min-w-[11rem] flex-1" style={{ width: 'auto', minWidth: '11rem', flex: '1.4 1 12rem', height: '7rem' }} />
            <Flex direction="column" gap="sm" className="w-[5.5rem] shrink-0">
              <FlexFrame className="shrink-0" style={{ width: '5.5rem', height: '3.75rem' }} />
              <FlexFrame className="shrink-0" style={{ width: '5.5rem', height: '2.5rem' }} />
            </Flex>
          </Flex>
        );
      },
    },
  ],
  variants: [
    {
      id: 'row',
      name: 'Row',
      description: 'Default flex direction in a row.',
      code: `<Flex direction="row" gap="md">
  <div>1</div>
  <div>2</div>
  <div>3</div>
</Flex>`,
      preview: (
        <Flex direction="row" gap="md">
          <div className="h-16 w-20 bg-background-800 rounded border border-accent-500/50 flex items-center justify-center">1</div>
          <div className="h-16 w-20 bg-background-800 rounded border border-accent-500/50 flex items-center justify-center">2</div>
          <div className="h-16 w-20 bg-background-800 rounded border border-accent-500/50 flex items-center justify-center">3</div>
        </Flex>
      ),
    },
    {
      id: 'column',
      name: 'Column',
      description: 'Flex direction in a column.',
      code: `<Flex direction="column" gap="md">
  <div>1</div>
  <div>2</div>
  <div>3</div>
</Flex>`,
      preview: (
        <Flex direction="column" gap="md">
          <div className="h-16 w-20 bg-background-800 rounded border border-accent-500/50 flex items-center justify-center">1</div>
          <div className="h-16 w-20 bg-background-800 rounded border border-accent-500/50 flex items-center justify-center">2</div>
          <div className="h-16 w-20 bg-background-800 rounded border border-accent-500/50 flex items-center justify-center">3</div>
        </Flex>
      ),
    },
  ],
};

export { flexControls };
