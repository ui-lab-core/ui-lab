import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Confirm } from '../Confirm';

describe('Confirm styles', () => {
  it('applies its declared slots and consumes the styles prop', () => {
    const { container } = render(
      <Confirm
        open
        mode="inline"
        labels={{
          trigger: 'Delete',
          confirming: { title: 'Delete item', body: 'This cannot be undone' },
        }}
        onConfirm={vi.fn()}
        styles={{
          root: 'slot-root',
          container: 'slot-container',
          actions: 'slot-actions',
          title: 'slot-title',
          description: 'slot-description',
        }}
      />
    );

    const root = container.firstElementChild;
    expect(root).toHaveClass('slot-root', 'slot-container');
    expect(root).not.toHaveAttribute('styles');
    expect(container.querySelector('.slot-actions')).toBeInTheDocument();
    expect(screen.getByText('Delete item')).toHaveClass('slot-title');
    expect(screen.getByText('This cannot be undone')).toHaveClass('slot-description');
  });
});
