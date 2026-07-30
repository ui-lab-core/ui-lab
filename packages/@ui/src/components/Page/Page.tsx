"use client"

import * as React from 'react';
import { cn } from '@/lib/utils';
import { createStylesResolver } from '@/lib/styles';
import { resolveGapStep } from '@/lib/gap';
import {
  PageProps,
  PagePadding,
  PageGap,
  PageHeaderProps,
  PageBodyProps,
  PageFooterProps,
  PageStyleSlots,
} from './page.types';
import css from './Page.module.css';

const slots = ['root', 'header', 'body', 'footer'] as const satisfies readonly (keyof PageStyleSlots)[];
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

function gapMultiplier(gap: PageGap): number {
  if (gap === 'none') return 0;
  if (typeof gap === 'number') return gap;
  return resolveGapStep(gap) * 0.5;
}

const PageRoot = React.forwardRef<HTMLDivElement, PageProps>(
  (
    {
      'max-width': maxWidth = '1400px',
      padding = 'md',
      gap = 'lg',
      centered = true,
      fullscreen = false,
      seo,
      className,
      style,
      children,
      styles: stylesProp,
      ...props
    },
    ref
  ) => {
    const paddingClass = paddingMap[padding];
    const resolved = React.useMemo(() => resolveStyles(stylesProp), [stylesProp]);

    return (
      <StylesContext.Provider value={resolved}>
        {seo && (
          <>
            {seo.title && <title>{seo.title}</title>}
            {seo.description && <meta name="description" content={seo.description} />}
            {seo.canonical && <link rel="canonical" href={seo.canonical} />}
          </>
        )}
        <div
          ref={ref}
          className={cn(css.page, paddingClass, className, resolved.root)}
          data-centered={centered}
          data-fullscreen={fullscreen}
          data-gap={gap}
          style={
            {
              ...style,
              '--max-width': fullscreen ? undefined : toSize(maxWidth),
              '--gap': `calc(var(--spacing, 0.25rem) * ${gapMultiplier(gap)})`,
            } as React.CSSProperties
          }
          {...props}
        >
          {children}
        </div>
      </StylesContext.Provider>
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

const PageBody = React.forwardRef<HTMLElement, PageBodyProps>(
  ({ className, ...props }, ref) => {
    const styles = React.useContext(StylesContext);
    return <main ref={ref} className={cn(css.body, styles.body, className)} {...props} />;
  }
);
PageBody.displayName = 'Page.Body';

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
  Body: PageBody,
  Footer: PageFooter,
});
