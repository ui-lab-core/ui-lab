'use client'

import { useColorVariables } from '../hooks/use-color-variables'
import {
  CHROMA_BOUNDARIES,
  getShadesForRole,
  oklchToHex,
  oklchToCss,
  type ColorRole,
  type OklchColor,
  type ShadeScale,
} from '../lib/color-utils'
import { Divider, Table, type Column } from 'ui-lab-components'
import { ColorPreviewCell, CopyableCell } from './color-table-cells'

interface ColorScaleProps {
  family: ColorRole
}

interface ColorRow {
  shade: number
  color: OklchColor
  hex: string
  cssVariable: string
  oklch: string
}

export function ColorScale({ family }: ColorScaleProps) {
  const colors = useColorVariables(family)
  const chromaBounds = CHROMA_BOUNDARIES[family]
  const shadesForFamily = getShadesForRole(family)
  const isLoading = shadesForFamily.some(shade => colors[shade] === undefined)
  const hasAnyColor = Object.values(colors).some(c => c !== null)

  if (isLoading) {
    return null
  }

  if (!hasAnyColor) {
    return <div className="text-foreground-400">No color data available</div>
  }

  const colorRows = shadesForFamily
    .map(shade => ({ shade, color: colors[shade] }))
    .filter(
      (item): item is { shade: ShadeScale; color: OklchColor } =>
        item.color !== null && item.color !== undefined
    )
    .map(({ shade, color }) => ({
      shade,
      color,
      hex: oklchToHex(color),
      cssVariable: `--${family}-${shade}`,
      oklch: oklchToCss(color),
    }))

  const columns: Column<ColorRow>[] = [
    {
      key: 'color',
      header: <span className="sr-only">Color preview</span>,
      cell: ({ row }) => (
        <ColorPreviewCell
          oklch={row.color}
          family={family}
          shade={String(row.shade)}
        />
      ),
    },
    {
      key: 'shade',
      header: 'Shade',
      cell: ({ row }) => (
        <span className="font-semibold text-foreground-200">{row.shade}</span>
      ),
    },
    {
      key: 'hex',
      header: 'Hex',
      cell: ({ row }) => <CopyableCell value={row.hex} label="hex" />,
    },
    {
      key: 'cssVariable',
      header: 'CSS Variable',
      cell: ({ row }) => <CopyableCell value={row.cssVariable} label="CSS variable" />,
    },
    {
      key: 'oklch',
      header: 'OKLCH',
      cell: ({ row }) => <CopyableCell value={row.oklch} label="OKLCH" />,
    },
  ]

  return (
    <div>
      <div className='mb-8'>
        <h3 className="text-md font-semibold text-foreground-100 capitalize">
          {family} Colors ({shadesForFamily.length} shades: {shadesForFamily[0]}–{shadesForFamily[shadesForFamily.length - 1]})
        </h3>
        <p className="text-sm text-foreground-400 mt-0!">
          Chroma range: {chromaBounds.min.toFixed(3)} – {chromaBounds.max.toFixed(3)}
        </p>
      </div>

      <Table className="my-6" data={colorRows} columns={columns} />
      <Divider variant='dashed' className='my-24' />
    </div>
  )
}
