'use client';

import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { Badge, Button, Input, Popover, Select } from 'ui-lab-components';
import { getAllCategories, getAllTags } from '@ui-lab-core/library/catalog';
import {
  FaArrowDownAZ,
  FaArrowUpZA,
  FaClock,
  FaFire,
  FaMagnifyingGlass,
  FaSort,
  FaX,
} from '@/shared/icons/fa6';
import { cn } from '@/shared/lib/utils';
import { X } from 'lucide-react';

const SORT_OPTIONS = [
  { label: 'Default Order', value: 'default', icon: <FaSort /> },
  { label: 'Newest First', value: 'newest', icon: <FaClock /> },
  { label: 'Most Popular', value: 'popular', icon: <FaFire /> },
  { label: 'Name (A-Z)', value: 'az', icon: <FaArrowDownAZ /> },
  { label: 'Name (Z-A)', value: 'za', icon: <FaArrowUpZA /> },
];

const EMPTY_TAGS: string[] = [];

interface ToolbarProps {
  searchQuery?: string;
  searchPlaceholder?: string;
  sortBy?: string;
  selectedCategory?: string | null;
  selectedTags?: string[];
  actions?: ReactNode;
  onSearch: (query: string) => void;
  onSortChange: (sort: string) => void;
  onCategoryChange: (category: string | null) => void;
  onTagsChange: (tags: string[]) => void;
  onClearAll: () => void;
}

export function Toolbar({
  searchQuery = '',
  searchPlaceholder = 'Search elements...',
  sortBy = 'default',
  selectedCategory = null,
  selectedTags = EMPTY_TAGS,
  actions,
  onSearch,
  onSortChange,
  onCategoryChange,
  onTagsChange,
  onClearAll,
}: ToolbarProps) {
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [searchValue, setSearchValue] = useState(searchQuery);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const categories = useMemo(() => getAllCategories(), []);
  const tags = useMemo(() => getAllTags(), []);
  const activeFilterCount = (selectedCategory ? 1 : 0) + selectedTags.length;
  const selectedSort = SORT_OPTIONS.find((option) => option.value === sortBy);

  useEffect(() => {
    setSearchValue(searchQuery);
  }, [searchQuery]);

  useEffect(() => () => {
    if (debounceTimeoutRef.current) clearTimeout(debounceTimeoutRef.current);
  }, []);

  const handleSearchChange = useCallback((value: string) => {
    setSearchValue(value);
    if (debounceTimeoutRef.current) clearTimeout(debounceTimeoutRef.current);
    debounceTimeoutRef.current = setTimeout(() => onSearch(value), 300);
  }, [onSearch]);

  const handleSearchClear = useCallback(() => {
    if (debounceTimeoutRef.current) clearTimeout(debounceTimeoutRef.current);
    setSearchValue('');
    onSearch('');
  }, [onSearch]);

  const toggleTag = (tag: string) => {
    onTagsChange(
      selectedTags.includes(tag)
        ? selectedTags.filter((selectedTag) => selectedTag !== tag)
        : [...selectedTags, tag],
    );
  };

  return (
    <>
      <Input
        type="text"
        icon={<FaMagnifyingGlass className="size-3.5 text-foreground-400" />}
        actions={searchValue ? [{
          icon: <FaX size={12} />,
          title: 'Clear search',
          onClick: handleSearchClear,
        }] : undefined}
        placeholder={searchPlaceholder}
        value={searchValue}
        onChange={(event) => handleSearchChange(event.target.value)}
        className="w-full"
      />

      <div className="flex items-center justify-end gap-2">
        <Select
          selectedKey={sortBy}
          onSelectionChange={(key) => {
            if (key !== null) onSortChange(String(key));
          }}
          className="w-fit"
        >
          <Select.Trigger icon={{ prefix: <FaSort className="text-foreground-400" /> }}>
            <span className="hidden lg:inline">{selectedSort?.label ?? 'Sort by'}</span>
          </Select.Trigger>
          <Select.Content>
            <Select.List>
              {SORT_OPTIONS.map((option) => (
                <Select.Item
                  key={option.value}
                  value={option.value}
                  icon={option.icon}
                  className="text-sm"
                >
                  {option.label}
                </Select.Item>
              ))}
            </Select.List>
          </Select.Content>
        </Select>

        {actions}

        <Popover
          isOpen={filtersOpen}
          onOpenChange={setFiltersOpen}
          position="bottom"
          align="end"
          styles={{
            frame: 'block overflow-hidden p-0',
          }}
          content={
            <div
              className="flex max-h-[min(36rem,calc(100vh-2rem))] flex-col"
              style={{ width: 'min(24rem, calc(100vw - 1rem))' }}
            >
              <div className="flex shrink-0 items-center justify-between gap-3 border-b border-background-700 px-4 py-1">
                <div>
                  <h3 className="text-sm font-semibold text-foreground-50">Filters</h3>
                  {activeFilterCount > 0 && (
                    <p className="mt-0.5 text-xs font-normal text-foreground-400">
                      {activeFilterCount} active
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  {activeFilterCount > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onPress={onClearAll}
                      className="text-xs text-foreground-400 hover:text-foreground-100"
                    >
                      Clear all
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onPress={() => setFiltersOpen(false)}
                    aria-label="Close filters"
                    className="min-h-7 min-w-7 px-0 text-foreground-400 hover:bg-background-800 hover:text-foreground-100"
                  >
                    <X className="size-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-5 overflow-y-auto p-4">
                <fieldset>
                  <legend className="mb-2 text-xs font-medium text-foreground-400">Category</legend>
                  <div className="grid grid-cols-2 gap-1" role="radiogroup" aria-label="Category">
                    <Button
                      variant={selectedCategory === null ? 'secondary' : 'ghost'}
                      size="sm"
                      onPress={() => onCategoryChange(null)}
                      aria-pressed={selectedCategory === null}
                      styles={{
                        root: cn(
                          'col-span-2 w-full justify-start text-left',
                          selectedCategory === null
                            ? 'bg-background-700 text-foreground-200'
                            : 'text-foreground-400 hover:bg-background-800 hover:text-foreground-100',
                        ),
                      }}
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
                        styles={{
                          root: cn(
                            'w-full justify-start overflow-hidden text-left',
                            selectedCategory === category
                              ? 'bg-background-700 text-foreground-200'
                              : 'text-foreground-400 hover:bg-background-800 hover:text-foreground-100',
                          ),
                        }}
                      >
                        <span className="truncate">{category}</span>
                      </Button>
                    ))}
                  </div>
                </fieldset>

                <fieldset className="border-t border-background-700 pt-4">
                  <legend className="mb-2 pr-2 text-xs font-medium text-foreground-400">Tags</legend>
                  <div className="flex flex-wrap gap-1.5" role="group" aria-label="Tags">
                    {tags.map((tag) => {
                      const isSelected = selectedTags.includes(tag);

                      return (
                        <Button
                          key={tag}
                          variant={isSelected ? 'secondary' : 'ghost'}
                          size="sm"
                          onPress={() => toggleTag(tag)}
                          aria-pressed={isSelected}
                          styles={{
                            root: cn(
                              'h-7 rounded-full border px-2.5 text-xs',
                              isSelected
                                ? 'border-accent-500/40 bg-accent-500/10 text-accent-200'
                                : 'border-background-700 bg-transparent text-foreground-400 hover:border-background-600 hover:bg-background-800 hover:text-foreground-200',
                            ),
                          }}
                        >
                          {tag}
                        </Button>
                      );
                    })}
                  </div>
                </fieldset>
              </div>
            </div>
          }
        >
          <Button
            variant="secondary"
            size="sm"
            styles={{
              root: cn(
                'border',
                activeFilterCount > 0
                  ? 'border-accent-500/40 bg-accent-500/10 text-accent-200 hover:border-accent-400'
                  : 'border-background-700 bg-background-900 text-foreground-300 hover:border-background-600 hover:bg-background-800',
              ),
            }}
          >
            <span className="text-sm font-medium">Filters</span>
            {activeFilterCount > 0 && (
              <Badge
                variant="default"
                count={activeFilterCount}
                pill
                className="ml-1 bg-accent-500/20 text-accent-100"
              />
            )}
          </Button>
        </Popover>
      </div>
    </>
  );
}
