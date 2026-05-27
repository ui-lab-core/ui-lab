import { transformerRenderIndentGuides } from '@shikijs/transformers'
import { themes, DEFAULT_THEME_NAME } from '@/features/theme/constants/themes'
import { DEFAULT_CODE_THEME } from '@/features/theme/lib/themes/shiki/code-theme-options'
import { ensureSemanticColorIntegrity } from '@/features/theme/lib/color/semantic'
import { resolveCodeThemeSelection } from '@/features/theme/lib/themes/shiki/resolve-code-theme'
import { resolveShikiLanguage } from '@/features/docs/lib/shiki-language'

// Shiki theme object type is complex to import directly from Shiki 3.x
type ShikiTheme = unknown

// Cache the precomputed themes globally/module-level.
let precomputedThemes: Record<'light' | 'dark', ShikiTheme> | null = null

function addCodePadding(html: string): string {
  return html.replace(/<code([^>]*)>/, (match, attrs: string) => {
    if (!attrs.includes('style=')) {
      return `<code${attrs} style="display: block; padding: 1rem;">`
    }

    return match.replace(/style="([^"]*)"/, (_, style: string) => {
      const normalized = style.trim()
      const suffix = normalized && !normalized.endsWith(';') ? ';' : ''
      return `style="${normalized}${suffix} display: block; padding: 1rem;"`
    })
  })
}

function removePreBackgroundOnly(html: string): string {
  return html.replace(/<pre([^>]*)style="([^"]*)"([^>]*)>/, (_, before: string, style: string, after: string) => {
    const cleanedStyle = style
      .split(';')
      .map((declaration) => declaration.trim())
      .filter(Boolean)
      .filter((declaration) => {
        const property = declaration.split(':')[0]?.trim().toLowerCase()
        return property !== 'background' && property !== 'background-color'
      })
      .join('; ')

    const styleAttr = cleanedStyle
      ? ` style="${cleanedStyle}${cleanedStyle.endsWith(';') ? '' : ';'}"`
      : ''

    return `<pre${before}${styleAttr}${after}>`
  })
}

function removePreTabIndex(html: string): string {
  return html.replace(/<pre([^>]*)\s+tabindex="[^"]*"([^>]*)>/gi, '<pre$1$2>')
}

function normalizeShikiHtml(html: string): string {
  return removePreTabIndex(removePreBackgroundOnly(addCodePadding(html)))
}

function getPrecomputedThemes() {
  if (precomputedThemes) return precomputedThemes

  const modes: ('light' | 'dark')[] = ['light', 'dark']
  const result = {} as Record<'light' | 'dark', ShikiTheme>

  for (const mode of modes) {
    const preset = themes[DEFAULT_THEME_NAME][mode]
    const colors = {
      ...preset,
      codeTheme: preset.codeTheme ?? DEFAULT_CODE_THEME,
      semantic: preset.semantic ? ensureSemanticColorIntegrity(preset.semantic) : undefined,
    }
    result[mode] = resolveCodeThemeSelection(colors, mode, `server-${mode}`)
  }

  precomputedThemes = result
  return precomputedThemes
}

export async function highlightCode(code: string, lang: string) {
  'use cache'
  const { bundledLanguages, bundledLanguagesAlias, codeToHtml } = await import('shiki')
  const modes: ('light' | 'dark')[] = ['light', 'dark']
  const results: Record<string, string> = {}
  const resolvedLanguage = resolveShikiLanguage(lang, bundledLanguages, bundledLanguagesAlias)

  const currentThemes = getPrecomputedThemes()

  await Promise.all(modes.map(async (mode) => {
    const shikiTheme = currentThemes[mode]

    try {
      const html = await codeToHtml(code, {
        lang: resolvedLanguage,
        theme: shikiTheme as any,
        transformers: [transformerRenderIndentGuides()],
      })

      results[mode] = normalizeShikiHtml(html)
    } catch (error) {
      console.error(`Failed to highlight code for ${mode}:`, error)
      results[mode] = ''
    }
  }))

  return results
}
