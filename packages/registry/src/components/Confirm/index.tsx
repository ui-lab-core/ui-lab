import React from 'react';
import { Confirm } from 'ui-lab-components';
import { ControlDef, ComponentDetail } from '@/types';
import { FaCheck, FaX } from 'react-icons/fa6';


const confirmBasicCode = `import {Confirm} from "ui-lab-components";

          export function Example() {
  return (
          <Confirm
            labels={{
              trigger: "Delete Account",
              confirming: { title: "Are you sure?", body: "This action cannot be undone." },
              confirm: "Delete",
              cancel: "Cancel",
            }}
            onConfirm={() => console.log('Confirmed')}
            onCancel={() => console.log('Cancelled')}
          />
          );
}`;

export const confirmDetail: ComponentDetail = {
  id: 'confirm',
  name: 'Confirm',
  description: 'A confirm dialog for critical user actions.',
  overview: (
    <div className="space-y-4 text-foreground-300">
      <p>
        The Confirm component provides a safety mechanism for destructive or irreversible actions. It requires explicit user confirmation before proceeding with critical operations.
      </p>
      <p>
        With clear messaging, customizable labels, and accessible keyboard interactions, the Confirm dialog helps prevent accidental actions while maintaining a smooth user experience.
      </p>
    </div>
  ),
  examples: [],
  variants: [
    {
      id: 'default',
      name: 'Default',
      description: 'Basic confirm dialog for destructive actions.',
      code: confirmBasicCode,
      preview: (
        <Confirm
          labels={{
            trigger: "Delete Account",
            confirming: { title: "Are you sure?", body: "This action cannot be undone." },
            confirm: "Delete",
            cancel: "Cancel",
          }}
          onConfirm={() => console.log('Confirmed')}
          onCancel={() => console.log('Cancelled')}
        />
      ),
    },
  ],
};
