'use client';
import { Button } from 'ui-lab-components/button'
import { Group } from 'ui-lab-components/group'
import { Divider } from 'ui-lab-components/divider';

export function ButtonGroupHorizontalDemo() {
  return (
    <div className="p-6">
      <Group spacing="sm">
        <Button variant="secondary" size="sm">Save</Button>
        <Button variant="secondary" size="sm">Duplicate</Button>
        <Divider orientation="vertical" />
        <Button variant="secondary" size="sm">Delete</Button>
      </Group>
    </div>
  );
}
