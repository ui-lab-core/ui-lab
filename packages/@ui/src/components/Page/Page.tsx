"use client"

import * as React from 'react';
import { cn } from '@/lib/utils';
import { createStylesResolver } from '@/lib/styles';
import { useMergeRefs } from '@/hooks/useMergeRefs';
import { PageContext } from './page.context';
import { resolveGapStep } from '@/lib/gap';
import {
  PageProps,
  PageContextValue,
  PagePadding,
  PageGap,
  PageHeaderProps,
  PageTitleProps,
  PageDescriptionProps,
  PageActionsProps,
  PageContentProps,
  PageFooterProps,
  PageStyleSlots,
} from './page.types';
import css from './Page.module.css';

const slots = [
  'root',
  'header',
  'title',
  'description',
  'actions',
  'content',
  'footer',
] as const satisfies readonly (keyof PageStyleSlots)[];
const resolveStyles = createStylesResolver(slots);
type ResolvedStyles = ReturnType<typeof resolveStyles>;
const StylesContext = React.createContext<ResolvedStyles>(resolveStyles(undefined));

const paddingMap: Record<PagePadding, string> = {
  none: css['padding-none'],
  sm: css['padding-sm'],
  md: css['padding-md'],
  lg: css['padding-lg'],
  xl: css['padding-xl'],
};

function toSize(value: string | number) {
  return typeof value === 'number' ? `${value}px` : value;
}

const PageRoot = React.forwardRef<HTMLDivElement, PageProps>(
  (
    {
      maxWidth = '1400px',
      padding = 'md',
      gap,
      spacing,
      centered = true,
      fullscreen = false,
      collapseAt = 768,
      className,
      style,
      children,
      styles: stylesProp,
      ...props
    },
    ref
  ) => {
    const containerRef = React.useRef<HTMLDivElement>(null);
    const mergedRef = useMergeRefs(containerRef, ref);
    const [pageWidth, setPageWidth] = React.useState<number>();
    const [isMobile, setIsMobile] = React.useState(false);

    React.useEffect(() => {
      const container = containerRef.current;
      if (!container) return;

      const update = (width: number) => {
        setPageWidth(width);
        setIsMobile(width < collapseAt);
      };
      update(container.getBoundingClientRect().width || container.clientWidth);

      if (typeof ResizeObserver === 'undefined') return;
      const observer = new ResizeObserver(([entry]) => {
        update(entry?.contentRect.width ?? container.clientWidth);
      });
      observer.observe(container);
      return () => observer.disconnect();
    }, [collapseAt]);

    const paddingClass = paddingMap[padding];
    const effectiveGap: PageGap = gap ?? spacing ?? 'lg';
    const gapStep = effectiveGap === 'none' ? 0 : typeof effectiveGap === 'number' ? effectiveGap : resolveGapStep(effectiveGap);
    const gapScale = typeof effectiveGap === 'number' ? 1 : 0.5;
    const resolved = React.useMemo(() => resolveStyles(stylesProp), [stylesProp]);
    const contextValue = React.useMemo<PageContextValue>(
      () => ({
        pageWidth,
        isMobile,
        pageMaxWidth: fullscreen ? undefined : maxWidth,
        pagePadding: padding,
        pageSpacing: effectiveGap,
      }),
      [fullscreen, isMobile, maxWidth, padding, pageWidth, effectiveGap]
    );

    return (
      <PageContext.Provider value={contextValue}>
        <StylesContext.Provider value={resolved}>
          <div
            ref={mergedRef}
            className={cn(css.page, paddingClass, className, resolved.root)}
            data-centered={centered}
            data-fullscreen={fullscreen}
            data-mobile={isMobile}
            style={
              {
                ...style,
                '--max-width': fullscreen ? undefined : toSize(maxWidth),
                '--page-gap-step': gapStep,
                '--page-gap-scale': gapScale,
              } as React.CSSProperties
            }
            {...props}
            data-gap={effectiveGap}
            data-spacing={spacing !== undefined ? spacing : undefined}
          >
            {children}
          </div>
        </StylesContext.Provider>
      </PageContext.Provider>
    );
  }
);

PageRoot.displayName = 'Page';

const PageHeader = React.forwardRef<HTMLElement, PageHeaderProps>(
  ({ sticky = false, divided = false, className, ...props }, ref) => {
    const styles = React.useContext(StylesContext);
    return (
      <header
        ref={ref}
        className={cn(css.header, sticky && css.sticky, divided && css.divided, styles.header, className)}
        {...props}
      />
    );
  }
);
PageHeader.displayName = 'Page.Header';

const PageTitle = React.forwardRef<HTMLHeadingElement, PageTitleProps>(
  ({ className, ...props }, ref) => {
    const styles = React.useContext(StylesContext);
    return <h1 ref={ref} className={cn(css.title, styles.title, className)} {...props} />;
  }
);
PageTitle.displayName = 'Page.Title';

const PageDescription = React.forwardRef<HTMLParagraphElement, PageDescriptionProps>(
  ({ className, ...props }, ref) => {
    const styles = React.useContext(StylesContext);
    return <p ref={ref} className={cn(css.description, styles.description, className)} {...props} />;
  }
);
PageDescription.displayName = 'Page.Description';

const PageActions = React.forwardRef<HTMLDivElement, PageActionsProps>(
  ({ className, ...props }, ref) => {
    const styles = React.useContext(StylesContext);
    return <div ref={ref} className={cn(css.actions, styles.actions, className)} {...props} />;
  }
);
PageActions.displayName = 'Page.Actions';

const PageContent = React.forwardRef<HTMLElement, PageContentProps>(
  ({ className, ...props }, ref) => {
    const styles = React.useContext(StylesContext);
    return <main ref={ref} className={cn(css.content, styles.content, className)} {...props} />;
  }
);
PageContent.displayName = 'Page.Content';

const PageFooter = React.forwardRef<HTMLElement, PageFooterProps>(
  ({ sticky = false, divided = false, className, ...props }, ref) => {
    const styles = React.useContext(StylesContext);
    return (
      <footer
        ref={ref}
        className={cn(css.footer, sticky && css.sticky, divided && css.divided, styles.footer, className)}
        {...props}
      />
    );
  }
);
PageFooter.displayName = 'Page.Footer';

export const Page = Object.assign(PageRoot, {
  Header: PageHeader,
  Title: PageTitle,
  Description: PageDescription,
  Actions: PageActions,
  Content: PageContent,
  Footer: PageFooter,
});
