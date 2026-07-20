'use client';

import { useState, useMemo } from 'react';
import { Badge, Button, Flex, Grid, Popover } from 'ui-lab-components';
import { FaX } from '@/shared/icons/fa6';
import { getAllCategories, getAllTags } from '@ui-lab-core/library/catalog';
import { cn } from '@/shared/lib/utils';

// ElementsFilterPopover

interface ElementsFilterPopoverProps {
  className?: string;
  selectedCategory?: string | null;
  selectedTags?: string[];
  onCategoryChange: (category: string | null) => void;
  onTagsChange: (tags: string[]) => void;
  onClearAll: () => void;
}

const EMPTY_TAGS: string[] = [];

export function ElementsFilterPopover({
  className,
  selectedCategory = null,
  selectedTags = EMPTY_TAGS,
  onCategoryChange,
  onTagsChange,
  onClearAll,
}: ElementsFilterPopoverProps) {
  const [isOpen, setIsOpen] = useState(false);

  const categories = useMemo(() => getAllCategories(), []);
  const tags = useMemo(() => getAllTags(), []);

  const activeFilterCount = (selectedCategory ? 1 : 0) + selectedTags.length;

  const toggleTag = (tag: string) => {
    onTagsChange(
      selectedTags.includes(tag)
        ? selectedTags.filter((selectedTag) => selectedTag !== tag)
        : [...selectedTags, tag]
    );
  };

  return (
    <Popover
      isOpen={isOpen}
      onOpenChange={setIsOpen}
      position="bottom"
      styles={{
        content: 'w-[20rem] max-w-[calc(100vw-1rem)]',
        frame: 'block max-h-[70vh] overflow-y-auto p-3',
      }}
      content={
        <Flex direction="column" gap="md">
          <Flex align-center justify-between className="gap-3">
            <div>
              <h3 className="text-sm font-semibold text-foreground-50">Filters</h3>
              {activeFilterCount > 0 && (
                <p className="mt-0.5 text-xs font-normal text-foreground-400">
                  {activeFilterCount} active
                </p>
              )}
            </div>
            <Flex align-center gap="xs">
              {activeFilterCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onPress={onClearAll}
                  className="text-foreground-400 hover:text-foreground-100"
                >
                  Clear
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                onPress={() => setIsOpen(false)}
                aria-label="Close filters"
                className="min-h-11 min-w-11 px-0 text-foreground-400 hover:bg-background-800 hover:text-foreground-100"
              >
                <FaX className="size-3" />
              </Button>
            </Flex>
          </Flex>

          <Flex direction="column" gap="xs">
            <p className="text-xs font-medium text-foreground-400">
              Category
            </p>
            <Grid columns={1} gap="xs" role="radiogroup" aria-label="Category">
              <Button
                variant={selectedCategory === null ? 'secondary' : 'ghost'}
                size="sm"
                onPress={() => onCategoryChange(null)}
                aria-pressed={selectedCategory === null}
                styles={{ root: cn(
                  'w-full justify-start text-left',
                  selectedCategory === null
                    ? 'bg-background-700 text-foreground-200'
                    : 'text-foreground-400 hover:bg-background-800 hover:text-foreground-100',
                ) }}
              >
                All
              </Button>
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? 'secondary' : 'ghost'}
                  size="sm"
                  onPress={() => onCategoryChange(category)}
                  aria-pressed={selectedCategory === category}
                  styles={{ root: cn(
                    'w-full justify-start text-left',
                    selectedCategory === category
                      ? 'bg-background-700 text-foreground-200'
                      : 'text-foreground-400 hover:text-foreground-100',
                  ) }}
                >
                  {category}
                </Button>
              ))}
            </Grid>
          </Flex>

          <Flex direction="column" gap="xs" className="border-t border-background-700 pt-4">
            <p className="text-xs font-medium text-foreground-400">
              Tags
            </p>
            <Flex wrap="wrap" gap="xs" role="group" aria-label="Tags">
              {tags.map((tag) => {
                const isSelected = selectedTags.includes(tag);

                return (
                  <Button
                    key={tag}
                    variant={isSelected ? 'secondary' : 'ghost'}
                    size="sm"
                    onPress={() => toggleTag(tag)}
                    aria-pressed={isSelected}
                    styles={{ root: cn(
                      'border text-xs',
                      isSelected
                        ? 'border-background-600 bg-background-700 text-foreground-200'
                        : 'border-background-700 text-foreground-400 hover:border-background-600 hover:bg-background-700 hover:text-foreground-200',
                    ) }}
                  >
                    {tag}
                  </Button>
                );
              })}
            </Flex>
          </Flex>
        </Flex>
      }
    >
      <Button
        variant='secondary'
        size="sm"
        styles={{ root: cn(
          'border',
          activeFilterCount > 0
            ? 'bg-background-700 bg-background-800 text-foreground-300 hover:border-accent-400'
            : 'border-background-700 bg-background-900 text-foreground-300 hover:border-background-600 hover:bg-background-800',
          className
        ) }}
      >
        <span className="text-sm font-medium">Filters</span>
        {activeFilterCount > 0 && (
          <Badge variant="default" count={activeFilterCount} pill className="ml-1 bg-background-600 text-foreground-50" />
        )}
      </Button>
    </Popover>
  );
}
