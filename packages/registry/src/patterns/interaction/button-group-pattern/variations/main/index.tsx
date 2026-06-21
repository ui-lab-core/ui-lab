'use client';
import { Button } from 'ui-lab-components/button'
import { Group } from 'ui-lab-components/group';

export function ButtonGroupPatternDemo() {
  return (
    <div className="p-6">
      <Group spacing="none">
        <Button variant="secondary" size="sm">Bold</Button>
        <Button variant="secondary" size="sm">Italic</Button>
        <Button variant="secondary" size="sm">Underline</Button>
      </Group>
    </div>
  );
}
