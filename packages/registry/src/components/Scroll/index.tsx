import React from 'react';
import { Divider, Scroll } from 'ui-lab-components';
import { ComponentDetail } from '@/types';
import { FaComputerMouse } from 'react-icons/fa6';

const scrollBasicCode = `import { Scroll } from "ui-lab-components";

export function Example() {
  return (
    <Scroll maxHeight="300px">
      <div className="p-4 space-y-2">
        {Array.from({ length: 20 }).map((_, i) => (
          <div key={i} className="p-3 bg-background-700 rounded-md">
            Item {i + 1}
          </div>
        ))}
      </div>
    </Scroll>
  );
}`;

export const scrollDetail: ComponentDetail = {
  id: "scroll",
  name: "Scroll",
  description: "A custom scrollable container with styled scrollbars for both vertical and horizontal overflow",

  overview: (
    <div className="space-y-4 text-foreground-300" >
      <p>
        Scroll is a container component that provides custom scrollbars for handling overflowing content.It supports both vertical and horizontal scrolling with a consistent visual style that matches your design system.
      </p>
      <p>
        Use Scroll when you need to display a large amount of content in a fixed- size container, ensuring a smooth scrolling experience with styled scrollbars that integrate seamlessly with your UI.
      </p>
    </div>
  ),

  examples: [],

  variants: [
    {
      id: "default",
      name: "Default",
      description: "Scroll with standard 300px height for typical content",
      code: `<Scroll maxHeight="300px">
  <div className="p-4 space-y-2">
    {Array.from({ length: 20 }).map((_, i) => (
      <div key={i} className="p-3 bg-background-700 rounded-md">
        Item {i + 1}
      </div>
    ))}
  </div>
</Scroll>`,
      preview: (
        <Scroll maxHeight="300px" >
          <div className="p-4 space-y-2">
            {
              Array.from({ length: 20 }).map((_, i) => (
                <div key={i} className="p-3 bg-background-700 rounded-md" >
                  Item {i + 1}
                </div>
              ))
            }
          </div>
        </Scroll>
      ),
    },
  ],
};
