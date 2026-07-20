import { describe, expect, it } from 'vitest'
import { Grid } from '../'
import { renderGrid, getGridRoot } from './Grid.test-utils'
import styles from '../Grid.module.css'
import { testRefForwarding } from '@/tests/utils'

describe('Grid.core', () => {
  it('renders children with default grid variables on the root element', () => {
    const container = renderGrid()
    const grid = getGridRoot(container)

    expect(grid).toBeInTheDocument()
    expect(grid).toHaveTextContent('Cell 1')
    expect(grid).toHaveTextContent('Cell 2')
    expect(grid).toHaveStyle({
      '--grid-tpl': 'repeat(3, 1fr)',
      '--grid-rows': 'auto',
      '--grid-gap-step': '4',
      '--grid-ji': 'stretch',
      '--grid-ai': 'stretch',
      '--grid-jc': 'start',
      '--grid-ac': 'start',
      '--grid-flow': 'row',
    })
  })

  it('maps layout props to CSS custom properties', () => {
    const container = renderGrid({
      columns: 'auto-fit',
      rows: '6',
      gap: 'lg',
      rowGap: 'xs',
      columnGap: 'xl',
      justifyItems: 'center',
      'align-baseline': true,
      'justify-between': true,
      alignContent: 'space-evenly',
      autoFlow: 'column-dense',
    })
    const grid = getGridRoot(container)

    expect(grid).toHaveStyle({
      '--grid-tpl': 'repeat(auto-fit, minmax(200px, 1fr))',
      '--grid-rows': 'repeat(6, auto)',
      '--grid-gap-step': '6',
      '--grid-row-gap-step': '1',
      '--grid-col-gap-step': '8',
      '--grid-ji': 'center',
      '--grid-ai': 'baseline',
      '--grid-jc': 'space-between',
      '--grid-ac': 'space-evenly',
      '--grid-flow': 'column dense',
    })
    expect(grid).toHaveClass(styles['has-row-gap'])
    expect(grid).toHaveClass(styles['has-col-gap'])
    expect(grid).toHaveAttribute('data-justify', 'justify-between')
    expect(grid).toHaveAttribute('data-align', 'align-baseline')
    expect(grid).toHaveAttribute('data-flow', 'column-dense')
  })

  it('supports zero and none gap overrides', () => {
    const container = renderGrid({
      gap: 'none',
      rowGap: 0,
      columnGap: 0,
    })
    const grid = getGridRoot(container)

    expect(grid).toHaveStyle({
      '--grid-gap-step': '0',
      '--grid-row-gap-step': '0',
      '--grid-col-gap-step': '0',
    })
    expect(grid).toHaveClass(styles['has-row-gap'])
    expect(grid).toHaveClass(styles['has-col-gap'])
  })

  it('preserves responsive zero gap values', () => {
    const container = renderGrid({
      gap: { sm: 0, md: 'md' },
    })
    const grid = getGridRoot(container)

    expect(grid).toHaveStyle({
      '--grid-gap-step-sm': '0',
      '--grid-gap-step-md': '4',
    })
  })

  it('maps numeric gaps directly to the spacing scale', () => {
    const container = renderGrid({ gap: 6, rowGap: 2 })
    const grid = getGridRoot(container)

    expect(grid).toHaveStyle({
      '--grid-gap-step': '6',
      '--grid-row-gap-step': '2',
    })
    expect(grid).toHaveAttribute('data-gap', '6')
  })

  it('maps numeric height and width to the Tailwind spacing scale', () => {
    const container = renderGrid({ h: 24, w: 64 })
    const grid = getGridRoot(container)

    expect(grid).toHaveStyle({
      height: 'calc(var(--spacing, 0.25rem) * 24)',
      width: 'calc(var(--spacing, 0.25rem) * 64)',
    })
  })

  it('supports named and arbitrary CSS dimensions with explicit props taking precedence', () => {
    const container = renderGrid({
      h: 'screen',
      w: 'calc(100% - 2rem)',
      style: { height: '100px', width: '320px' },
      className: 'w-full',
    })
    const grid = getGridRoot(container)

    expect(grid).toHaveClass('w-full')
    expect(grid).toHaveStyle({
      height: '100vh',
      width: 'calc(100% - 2rem)',
    })
  })

  it('passes custom grid-template-columns values through unchanged', () => {
    const container = renderGrid({
      columns: '760px 1fr',
    })
    const grid = getGridRoot(container)

    expect(grid).toHaveStyle({
      '--grid-tpl': '760px 1fr',
    })
  })

  it('supports non-numeric row templates like masonry', () => {
    const container = renderGrid({ rows: 'masonry' })
    const grid = getGridRoot(container)

    expect(grid).toHaveStyle({
      '--grid-rows': 'masonry',
    })
  })

  it('supports fixed-width masonry tracks', () => {
    const container = renderGrid({
      rows: 'masonry',
      columns: 7,
      masonryColumnWidth: 'max(22rem, 40vw)',
      masonryColumnFill: 'auto',
      masonryItemGap: false,
    })
    const grid = getGridRoot(container)

    expect(grid).toHaveClass(styles.masonry)
    expect(grid).toHaveClass(styles['masonry-fixed-width'])
    expect(grid).toHaveClass(styles['masonry-column-fill'])
    expect(grid).toHaveClass(styles['masonry-no-item-gap'])
    expect(grid).toHaveStyle({
      '--grid-col-count': '7',
      '--grid-masonry-col-width': 'max(22rem, 40vw)',
      '--grid-masonry-col-fill': 'auto',
    })
  })

  it('applies className, inline style, styles.root, and native HTML attributes to the root grid', () => {
    const container = renderGrid({
      className: 'custom-grid',
      style: { marginTop: '12px' },
      styles: { root: 'slot-root' },
      id: 'grid-id',
      title: 'Grid title',
    })
    const grid = getGridRoot(container)

    expect(grid).toHaveClass(styles.grid)
    expect(grid).toHaveClass('custom-grid')
    expect(grid).toHaveClass('slot-root')
    expect(grid).toHaveAttribute('id', 'grid-id')
    expect(grid).toHaveAttribute('title', 'Grid title')
    expect(grid).toHaveStyle({ marginTop: '12px' })
  })

  testRefForwarding({
    component: Grid,
    expectedElement: HTMLDivElement,
  })
})
