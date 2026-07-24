import { MDXRemote } from 'next-mdx-remote-client/rsc'
import remarkGfm from 'remark-gfm'
import Image from 'next/image'
import * as LucideIcons from 'lucide-react'

import { Code } from './code-display/code'
import { CodeWithPackageManager } from './code-display/code-with-package-manager'
import { InstallCommand } from './code-display/install-command'
import { InstallationFlow } from './code-display/installation-flow'
import Timeline from './timeline'
import ColorPaletteGrid from '@/features/theme/components/color-palette-grid'
import { Banner, BannerTitle, BannerBody } from './mdx/client-banner'
import { Anchor } from './mdx/client-anchor'
import { Divider } from './mdx/client-divider'
import { MermaidDiagramWrapper as MermaidDiagram } from './mdx/mermaid-diagram-wrapper'
import { SkillFiles } from './mdx/skill-files'
import {
  MarkdownTable,
  MarkdownTableBody,
  MarkdownTableCell,
  MarkdownTableHeader,
  MarkdownTableHeaderCell,
  MarkdownTableRow,
} from './mdx/client-table'
import Icon from '@/shared/components/Icon'
import { highlightCode } from '../lib/shiki-server'
import rehypeSlug from 'rehype-slug'

const options = {
  mdxOptions: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [rehypeSlug],
  },
}

const components = {
  h1: ({ children, id }: any) => <h1 id={id}>{children}</h1>,
  h2: ({ children, id }: any) => <h2 id={id}>{children}</h2>,
  h3: ({ children, id }: any) => <h3 id={id}>{children}</h3>,
  h4: ({ children, id }: any) => <h4 id={id}>{children}</h4>,
  p: ({ children }: any) => <p>{children}</p>,
  a: ({ children, href }: any) => <Anchor href={href} target={href?.startsWith('http') ? '_blank' : '_self'}>{children}</Anchor>,
  ul: ({ children }: any) => <ul>{children}</ul>,
  ol: ({ children }: any) => <ol>{children}</ol>,
  li: ({ children }: any) => <li>{children}</li>,
  hr: () => <hr />,
  thead: MarkdownTableHeader,
  tbody: MarkdownTableBody,
  tr: MarkdownTableRow,
  th: MarkdownTableHeaderCell,
  td: MarkdownTableCell,
  table: MarkdownTable,
  blockquote: ({ children }: any) => (
    <blockquote>
      {children}
    </blockquote>
  ),
  Code,
  CodeWithPackageManager,
  InstallCommand,
  InstallationFlow,
  Timeline,
  ColorPaletteGrid,
  Banner: Object.assign(Banner, { Title: BannerTitle, Body: BannerBody }),
  Divider,
  MermaidDiagram,
  SkillFiles,
  pre: async ({ children }: any) => {
    if (typeof children === 'object' && children !== null && 'props' in children) {
      const code = children.props?.children as string || ''
      const language = children.props?.className?.replace('language-', '') || 'text'
      const highlighted = await highlightCode(code, language)
      return (
        <Code className='mb-4' language={language} preHighlightedLight={highlighted.light} preHighlightedDark={highlighted.dark}>
          {code}
        </Code>
      )
    }
    return <pre>{children}</pre>
  },
  code: ({ children, className }: any) => {
    const isInline = !className
    return isInline ? (
      <code>
        {children}
      </code>
    ) : (
      <code className={className}>{children}</code>
    )
  },
  img: (props: any) => (
    <Image
      {...props}
      width={800}
      height={600}
      sizes="100vw"
      style={{ width: '100%', height: 'auto' }}
      alt={props.alt || ''}
    />
  ),
  Icon: ({ name, ...props }: any) => {
    const IconComponent = (LucideIcons as any)[name]
    if (!IconComponent) return null
    return <Icon IconComponent={IconComponent} {...props} />
  },
}

export async function DocsMDX({ source }: { source: string }) {
  'use cache'
  return <MDXRemote source={source} components={components} options={options} />
}
