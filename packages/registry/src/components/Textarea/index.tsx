import React from 'react';
import { TextArea } from 'ui-lab-components';
import { ComponentDetail } from '@/types';

const textareaBasicCode = `import { TextArea } from "ui-lab-components";

export function Example() {
  return (
    <TextArea
      placeholder="Enter your text here..."
      rows={4}
    />
  );
}`;

export const textareaDetail: ComponentDetail = {
  id: 'textarea',
  name: 'TextArea',
  description: 'A multi-line text input component for collecting longer text input from users.',
  overview: (
    <div className="space-y-4 text-foreground-300">
      <p>
        The TextArea component provides a multi-line text input field, perfect for collecting longer text input such as comments, descriptions, or messages. It's more flexible than a single-line input and can be sized to fit your layout needs.
      </p>
      <p>
        TextArea supports customizable row heights, placeholder text, and disabled states, making it suitable for various form scenarios.
      </p>
    </div>
  ),
  examples: [],
};
