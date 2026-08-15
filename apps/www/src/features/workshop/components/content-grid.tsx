'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Gallery, Frame, Badge } from 'ui-lab-components';
import { Blocks, LayoutPanelTop, Puzzle, Rocket, Sparkles } from 'lucide-react';
import { PreviewContainer } from '@/features/preview/components/preview-container';
import type { LayoutConfig, PricingInfo } from '@ui-lab-core/library/catalog';
import { FaWandMagicSparkles } from '@/shared/icons/fa6';

interface ContentItem {
  id: string;
  name: string;
  description: string;
  pricing?: PricingInfo;
}

/**
 * A violet accent reserved for paid/one-time-purchase content. Kept local and
 * literal rather than themed: it is a fixed product signal ("this is Premium"),
 * not the theme's accent, which can be any hue. Everything else derives from it
 * through color-mix so the tint stays coherent in light and dark.
 */
const PREMIUM_HUE = 'oklch(0.60 0.17 230)';

/**
 * True for any content behind the one-time purchase. Price is no longer shown,
 * but it still decides: the catalog gives free content a `pricing` block with a
 * null price, so the block's presence alone does not make an item paid.
 */
function isPremiumItem(item: ContentItem): boolean {
  return item.pricing?.price != null;
}

/**
 * The step cut out of a premium card's top edge, in pixels. `ease` is how far
 * the S-curve travels while it drops `depth`; the image this is drawn from runs
 * the two at roughly 1:1, which is what keeps the curve reading as a slope
 * rather than a ledge. `span` is the flat run from the bottom of the S to the
 * card's right edge, sized to hold the label, and `radius` matches the card's
 * own corner *on the border line* so the step hands the frame back a corner of
 * the same shape.
 */
const NOTCH = { ease: 45, depth: 35, span: 85, radius: 10 };

const NOTCH_WIDTH = NOTCH.ease + NOTCH.span;

/**
 * Control-point x's for the flat run of the step, held off the endpoints so the
 * notch floor stays level as it descends. Spaced off the reference shape.
 */
const NOTCH_C1 = NOTCH.ease + (NOTCH_WIDTH - NOTCH.radius - NOTCH.ease) * 0.26;
const NOTCH_C2 = NOTCH.ease + (NOTCH_WIDTH - NOTCH.radius - NOTCH.ease) * 0.7;

/**
 * The premium frame's fixed top-edge step. Its geometry never changes on
 * interaction; hover only changes the surface treatment.
 */
function notchPath(): string {
  return [
    `M 0 0`,
    `C ${NOTCH.ease * 0.25} 0 ${NOTCH.ease * 0.75} ${-NOTCH.depth} ${NOTCH.ease} ${-NOTCH.depth}`,
    `C ${NOTCH_C1} ${-NOTCH.depth} ${NOTCH_C2} ${-NOTCH.depth} ${NOTCH_WIDTH - NOTCH.radius} ${-NOTCH.depth}`,
    `a ${NOTCH.radius} ${NOTCH.radius} 0 0 0 ${NOTCH.radius} ${-NOTCH.radius}`,
  ].join(' ');
}

const PREMIUM_NOTCH_PATH = notchPath();

/**
 * The premium surface itself, not an overlay on one: the step means the card's
 * outline is no longer the rectangle Gallery.Item paints, so the item hands its
 * fill, border and clipping to this Frame and the Frame carries the shape.
 * Children are clipped to that outline, so the label that sits *in* the cut-out
 * is a sibling of the Frame rather than a child of it.
 */
function PremiumFrame({
  active,
  children,
}: {
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Frame
      edges="all"
      strokeAlign="outside"
      side="top"
      shapeAlign="end"
      shapeMode="indent"
      path={PREMIUM_NOTCH_PATH}
      pathWidth={NOTCH_WIDTH}
      className="h-full [&_rect]:transition-[fill] [&_rect]:duration-300 [&_rect]:ease-out"
      style={
        {
          // The stroke sits *outside* the frame's bounds so it lands in the
          // ring the item's own (now transparent) border still occupies, which
          // is where every other card draws its border. Bounds shrunk by that
          // ring, so a premium card's outer corner comes out the same size and
          // shape as its neighbours'.
          '--frame-radius': 'calc(var(--radius-sm) - 1px)',
          '--fill': 'var(--background)',
          '--stroke-color': active
            ? `color-mix(in oklch, ${PREMIUM_HUE} 70%, transparent)`
            : 'var(--background-border)',
        } as React.CSSProperties
      }
    >
      <div className="relative flex h-full flex-col">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-10"
          style={{
            opacity: active ? 1 : 0,
            transition: 'opacity 300ms ease-out',
            background: `radial-gradient(90% 70% at 100% ${NOTCH.depth}px, color-mix(in oklch, ${PREMIUM_HUE} 16%, transparent), transparent 60%)`,
          }}
        />
        {children}
      </div>
    </Frame>
  );
}

/**
 * The "Premium" mark, sat in the cut-out the frame leaves for it. It fades in
 * The mark remains in the fixed notch and uses the same monochrome-to-premium
 * color treatment as the frame.
 */
function PremiumLabel({ active }: { active: boolean }) {
  return (
    <div
      className="pointer-events-none absolute right-2.5 top-0 z-20 flex items-center justify-center gap-1.5 text-md font-medium"
      style={{
        width: NOTCH.span,
        height: NOTCH.depth,
        transition: 'color 300ms ease-out',
        color: active
          ? `color-mix(in oklch, ${PREMIUM_HUE} 20%, white)`
          : 'var(--foreground-300)',
      }}
    >
      Premium
    </div>
  );
}

/**
 * A premium card with fixed geometry. Hover/focus changes its monochrome
 * surface to the premium hue and gradient without moving the frame.
 */
function PremiumGalleryItem({
  itemProps,
  children,
}: {
  itemProps: React.ComponentProps<typeof Gallery.Item>;
  children: React.ReactNode;
}) {
  const [active, setActive] = useState(false);

  return (
    <Gallery.Item
      {...itemProps}
      className="relative overflow-visible"
      // The item's border is handed to the Frame. The stable notch background
      // stays monochrome until interaction reveals the premium hue.
      style={{
        backgroundColor: active ? PREMIUM_HUE : 'var(--background-border)',
        borderColor: 'transparent',
        transition: 'background-color 300ms ease-out',
      }}
      data-premium="true"
      onPointerEnter={() => setActive(true)}
      onPointerLeave={() => setActive(false)}
      onFocus={() => setActive(true)}
      onBlur={() => setActive(false)}
    >
      <PremiumFrame active={active}>{children}</PremiumFrame>
      <PremiumLabel active={active} />
    </Gallery.Item>
  );
}

type PreviewKind = 'element' | 'package' | 'pattern' | 'section' | 'starter';

interface GenericContentGridProps<T extends ContentItem> {
  items: T[];
  basePath: string;
  layoutConfigs: Record<string, LayoutConfig>;
  previews: Record<string, React.ReactNode>;
  onItemClick?: (item: T) => boolean | void;
  getCategory?: (item: T) => string;
  categoryLabels?: Record<string, string>;
  fullWidth?: boolean;
  hideGroupHeaders?: boolean;
  previewKind?: PreviewKind;
}

const previewIcons = {
  element: Blocks,
  package: Blocks,
  pattern: Puzzle,
  section: LayoutPanelTop,
  starter: Rocket,
} as const;

function FallbackPreview({ kind }: { kind: PreviewKind }) {
  const Icon = previewIcons[kind];

  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="flex size-16 items-center justify-center rounded-xl border border-background-700 bg-background-900">
        <Icon className="size-7 text-foreground-400" aria-hidden="true" />
      </div>
    </div>
  );
}

export function GenericContentGrid<T extends ContentItem>({
  items,
  basePath,
  layoutConfigs,
  previews,
  onItemClick,
  getCategory,
  categoryLabels,
  fullWidth = false,
  hideGroupHeaders = false,
  previewKind = 'element',
}: GenericContentGridProps<T>) {
  const router = useRouter();

  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-foreground-400">No items found matching your filters.</p>
      </div>
    );
  }

  const renderItem = (item: T) => {
    const layoutConfig = layoutConfigs[item.id];
    const preview = previews[item.id] ?? <FallbackPreview kind={previewKind} />;
    const href = `${basePath}/${item.id}`;

    const handlePress = (passedHref?: string) => {
      if (onItemClick) {
        const handled = onItemClick(item);
        if (handled !== false) {
          return;
        }
      }
      router.push(passedHref || href);
    };

    const columnSpan = fullWidth ? 1 : Math.min(layoutConfig.columnSpan || 1, 3);
    const premium = isPremiumItem(item);

    const content = (
      <>
        <PreviewContainer layoutConfig={layoutConfig}>
          {preview}
        </PreviewContainer>
        <Gallery.Body className="p-3 w-full">
          <div className="flex flex-col gap-2">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1">
                <strong className="font-semibold text-foreground-50">{item.name}</strong>
                <p className="text-sm text-foreground-400 mt-0.5 line-clamp-2">{item.description}</p>
              </div>
            </div>
          </div>
        </Gallery.Body>
      </>
    );

    const itemProps = {
      href: onItemClick ? undefined : href,
      onPress: handlePress,
      columnSpan,
      rowSpan: layoutConfig.rowSpan,
    };

    if (premium) {
      return (
        <PremiumGalleryItem key={item.id} itemProps={itemProps}>
          {content}
        </PremiumGalleryItem>
      );
    }

    return (
      <Gallery.Item
        key={item.id}
        {...itemProps}
        className="relative overflow-hidden"
      >
        {content}
      </Gallery.Item>
    );
  };

  const galleryColumns = fullWidth ? { sm: 1, md: 1, xl: 1 } : { sm: 1, md: 2, xl: 3 };

  // If no categorization, render flat grid
  if (!getCategory) {
    return (
      <div className="flex flex-col gap-12">
        <Gallery columns={{ sm: 1, md: 2, lg: 3 }} gap="lg" className='p-1'>
          {items.map(renderItem)}
        </Gallery>
      </div>
    );
  }

  // Group items by category
  const grouped = items.reduce((acc, item) => {
    const category = getCategory(item);
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(item);
    return acc;
  }, {} as Record<string, T[]>);

  return (
    <div className="flex flex-col gap-16">
      {Object.entries(grouped).map(([categoryId, categoryItems]) => (
        <div key={categoryId} className="flex flex-col gap-2">
          {!hideGroupHeaders && (
            <h2 className="ml-2 text-md font-semibold text-foreground-50">
              {categoryLabels?.[categoryId] || categoryId}
            </h2>
          )}
          <Gallery columns={galleryColumns} gap="sm" className='p-1'>
            {categoryItems.map(renderItem)}
          </Gallery>
        </div>
      ))}
    </div>
  );
}
