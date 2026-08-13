import Link from 'next/link'
import type { DocsAdjacentPages } from '../lib/docs-source'
import { FaChevronLeft, FaChevronRight } from '@/shared/icons/fa6'
import { Divider } from 'ui-lab-components'

interface DocsPaginationProps {
  adjacent: DocsAdjacentPages
}

export function DocsPagination({ adjacent }: DocsPaginationProps) {
  const { prev, next } = adjacent

  if (!prev && !next) return null

  return (
    <div className="mt-16 p-0.5 flex items-stretch border border-background-700 rounded-sm overflow-hidden gap-0.5">
      {prev && (
        <Link
          href={prev.url}
          className="rounded-sm flex items-center gap-3 px-4 py-3.5 text-foreground-300 hover:text-foreground-50 hover:bg-background-800 transition-colors text-sm"
        >
          <FaChevronLeft size={12} />
          <span className='text-md font-medium'>Previous</span>
        </Link>
      )}

      {next && (
        <Link
          href={next.url}
          className="rounded-sm w-full flex items-start hover:bg-background-800 transition-colors"
        >
          <div className="px-4 py-3.5">
            <div className="text-sm font-medium text-foreground-50">{next.title}</div>
            {next.description && (
              <div className="text-mdo verflow-hidden text-ellipsis max-w-[90ch] font-medium text-foreground-400 mt-0.5">{next.description}</div>
            )}
          </div>
          <Divider className='my-3' orientation='vertical' />
          <div className="flex my-auto items-center gap-3 px-5 py-4 text-foreground-300 text-sm">
            <span className='text-md font-medium'>Next</span>
            <FaChevronRight size={12} />
          </div>
        </Link>
      )}
    </div>
  )
}
