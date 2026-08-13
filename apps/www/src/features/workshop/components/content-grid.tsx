'use client';
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
const PREMIUM_HUE = 'oklch(0.62 0.19 300)';

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
 * The step, authored along the top edge as Frame wants it: starting on the edge
 * at `0 0` and bulging *outwards*, to be mirrored into a cut by
 * `shapeMode="indent"`. It eases down to the notch floor, runs flat to the
 * corner, and turns into the right edge — so it ends deep in the adjoining edge
 * rather than back on the top one, which is what `shapeAlign="end"` is for.
 *
 * The cubic's handles are horizontal at both ends, so the curve leaves the top
 * edge and meets the notch floor tangentially and the step has no visible
 * joints. They sit a quarter of the run in, traced off the reference shape.
 */
const NOTCH_PATH = [
  `M 0 0`,
  `c ${NOTCH.ease * 0.25} 0 ${NOTCH.ease * 0.75} ${-NOTCH.depth} ${NOTCH.ease} ${-NOTCH.depth}`,
  `L ${NOTCH_WIDTH - NOTCH.radius} ${-NOTCH.depth}`,
  `a ${NOTCH.radius} ${NOTCH.radius} 0 0 0 ${NOTCH.radius} ${-NOTCH.radius}`,
].join(' ');

/**
 * The premium surface itself, not an overlay on one: the step means the card's
 * outline is no longer the rectangle Gallery.Item paints, so the item hands its
 * fill, border and clipping to this Frame and the Frame carries the shape.
 * Children are clipped to that outline, so the label that sits *in* the cut-out
 * is a sibling of the Frame rather than a child of it.
 */
function PremiumFrame({ children }: { children: React.ReactNode }) {
  return (
    <Frame
      edges="all"
      strokeAlign="outside"
      side="top"
      shapeAlign="end"
      shapeMode="indent"
      path={NOTCH_PATH}
      pathWidth={NOTCH_WIDTH}
      className="h-full"
      style={
        {
          // The stroke sits *outside* the frame's bounds so it lands in the
          // ring the item's own (now transparent) border still occupies, which
          // is where every other card draws its border. Bounds shrunk by that
          // ring, so a premium card's outer corner comes out the same size and
          // shape as its neighbours'.
          '--frame-radius': 'calc(var(--radius-sm) - 1px)',
          '--fill': 'var(--background)',
          '--stroke-color': `color-mix(in oklch, ${PREMIUM_HUE} 70%, transparent)`,
        } as React.CSSProperties
      }
    >
      <div className="relative flex h-full flex-col">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-10"
          style={{
            background: `radial-gradient(90% 70% at 100% ${NOTCH.depth}px, color-mix(in oklch, ${PREMIUM_HUE} 16%, transparent), transparent 60%)`,
          }}
        />
        {children}
      </div>
    </Frame>
  );
}

/**
 * The "Premium" mark, sat in the cut-out the frame leaves for it. Left readable
 * rather than aria-hidden: it is the only thing that says the card is paid, and
 * Gallery.Item names itself from its contents.
 */
function PremiumLabel() {
  return (
    <div
      className="pointer-events-none absolute right-2.5 top-0 z-20 flex items-center justify-center gap-1.5 text-md font-medium"
      style={{
        width: NOTCH.span,
        height: NOTCH.depth,
        color: 'white'
      }}
    >
      Premium
    </div>
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

    return (
      <Gallery.Item
        key={item.id}
        href={onItemClick ? undefined : href}
        onPress={handlePress}
        columnSpan={columnSpan}
        rowSpan={layoutConfig.rowSpan}
        className={premium ? 'relative overflow-visible' : 'relative overflow-hidden'}
        style={premium ? { background: `color-mix(in oklch, ${PREMIUM_HUE} 100%, transparent)`, borderColor: 'transparent' } : undefined}
        data-premium={premium ? 'true' : undefined}
      >
        {premium ? (
          <>
            <PremiumFrame>{content}</PremiumFrame>
            <PremiumLabel />
          </>
        ) : (
          content
        )}
      </Gallery.Item>
    );
  };

  const galleryColumns = fullWidth ? { sm: 1, md: 1, xl: 1 } : { sm: 1, md: 2, xl: 3 };

  // If no categorization, render flat grid
  if (!getCategory) {
    return (
      <div className="flex flex-col gap-12">
        <Gallery columns={{ sm: 1, md: 2, lg: 3 }} gap="sm" className='p-1'>
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
