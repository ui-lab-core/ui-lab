'use client';

import { Button, toast, Toaster } from 'ui-lab-components';
import { ControlDef, ComponentDetail } from '@/types';

// Define examplesData locally

const toastControls: ControlDef[] = [
  {
    name: 'variant',
    label: 'Variant',
    type: 'select',
    options: [
      { label: 'Default', value: 'default' },
      { label: 'Success', value: 'success' },
      { label: 'Danger', value: 'danger' },
      { label: 'Info', value: 'info' },
      { label: 'Warning', value: 'warning' },
    ],
    defaultValue: 'default',
  },
  {
    name: 'position',
    label: 'Position',
    type: 'select',
    options: [
      { label: 'Bottom Right', value: 'bottom-right' },
      { label: 'Bottom Left', value: 'bottom-left' },
      { label: 'Bottom Center', value: 'bottom' },
      { label: 'Top Right', value: 'top-right' },
      { label: 'Top Left', value: 'top-left' },
      { label: 'Top Center', value: 'top' },
    ],
    defaultValue: 'bottom-right',
  },
  {
    name: 'duration',
    label: 'Duration (ms)',
    type: 'text',
    defaultValue: '5000',
  },
];

const toastBasicCode = `import { toast, Toaster, Button } from "ui-lab-components";

export function Example() {
  return (
    <>
      <Button onClick={() => toast({ title: 'Notification', description: 'This is a toast message' })}>
        Show Toast
      </Button>
      <Toaster />
    </>
  );
}`;

export const toastDetail: ComponentDetail = {
  id: 'toast',
  name: 'Toast',
  description: 'A notification component for displaying temporary messages with multiple variants, positions, and auto-dismiss functionality.',
  overview: (
    <div className="space-y-4 text-foreground-300">
      <p>
        The Toast component displays temporary notifications to users. It supports multiple variants (default, success, danger, info, warning) for different message types and can be positioned in any corner or center of the viewport.
      </p>
      <p>
        Toasts automatically dismiss after a configurable duration, support manual dismissal via close button, and can be paused on hover or focus. They're perfect for providing feedback after user actions, displaying system messages, or showing alerts.
      </p>
    </div>
  ),
  examples: [
    {
      id: 'preview',
      title: 'Preview',
      description: 'Adjust props to customize the component',
      code: toastBasicCode,
      preview: (
        <>
          <Button size="sm" onClick={() => toast({ title: 'Notification', description: 'This is a toast message' })}>
            Show Toast
          </Button>
          <Toaster />
        </>
      ),
      controls: toastControls,
      renderPreview: (props: any) => (
        <>
          <Button
            size="sm"
            onClick={() =>
              toast({
                title: 'Notification',
                description: 'This is a toast message',
                variant: props.variant as any,
                position: props.position as any,
                duration: parseInt(props.duration) || 5000,
              })
            }
          >
            Show Toast
          </Button>
          <Toaster />
        </>
      ),
    }
  ],
};

export { toastControls };
