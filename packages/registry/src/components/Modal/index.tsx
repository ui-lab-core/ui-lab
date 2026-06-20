import React from 'react';
import { ComponentDetail } from '@/types';
const modalBasicCode = `import { Modal, Button } from "ui-lab-components";
import { useState } from "react";

export function Example() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>
        Open Modal
      </Button>
      <Modal isOpen={isOpen} onOpenChange={setIsOpen}>
        <Modal.Header>Modal Title</Modal.Header>
        <Modal.Body>Modal content goes here</Modal.Body>
      </Modal>
    </>
  );
}`;

export const modalDetail: ComponentDetail = {
  id: "modal",
  name: "Modal",
  description: "A dialog component for displaying content in a modal overlay with support for forms, confirmations, and alerts.",

  overview: (
    <div className="space-y-4 text-foreground-300">
      <p>
        The Modal component displays content in a centered dialog that blocks interaction with the page behind it. It's built with accessibility in mind and includes keyboard handling (Escape to close) and backdrop click handling.
      </p>
      <p>
        Use modals for important user interactions like confirmations, forms, alerts, or when you need focused user attention. The component supports various sizes and can include headers, bodies, and footers.
      </p>
    </div>
  ),

  examples: [],

  variants: [
    {
      id: "default",
      name: "Default",
      description: "Standard modal with title and content.",
      code: modalBasicCode,
      preview: (
        <div className="text-sm text-foreground-400">
          See preview above
        </div>
      ),
    },
  ],
};
