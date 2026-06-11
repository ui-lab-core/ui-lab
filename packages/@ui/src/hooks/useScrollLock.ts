import { useEffect } from "react"

/**
 * Layout-based body scroll lock.
 *
 * Approach: lock the actual browser scroll container rather than intercepting
 * input events (which races user input and misses vectors like drag-scroll,
 * middle-click autoscroll, and focus-driven scroll-into-view).
 *
 * - Desktop: `overflow: hidden` on <html> (documentElement), which is the
 *   real scroll container in all modern browsers. Setting it only on <body>
 *   is insufficient — wheel events on non-scrollable overlay regions propagate
 *   up past body and still scroll the html element. paddingRight compensation
 *   is applied to <body> so content does not shift when the scrollbar disappears.
 * - iOS Safari: `overflow: hidden` on html is not reliably honored, so we
 *   additionally apply the `position: fixed` + negative-top technique to
 *   <body> and restore window.scrollTo on unlock. Rubber-band overscroll at
 *   the very edges of an inner scroll region can still occur; accepted caveat.
 *
 * Internal component scroll regions (Select listbox, Modal panel, etc.) are
 * nested elements with their own overflow — they are not affected by locking
 * the document-level scroll container.
 *
 * Stacked overlays are handled with a module-level reference count: the
 * original inline styles are captured by the first locker and restored
 * exactly once when the last locker releases.
 */

interface SavedStyles {
  htmlOverflow: string
  bodyPaddingRight: string
  bodyPosition: string
  bodyTop: string
  bodyLeft: string
  bodyWidth: string
}

let lockCount = 0
let savedStyles: SavedStyles | null = null
let savedScrollY = 0
let usedFixedBody = false

function isIOS(): boolean {
  if (typeof navigator === "undefined") return false
  return /iP(ad|hone|od)/.test(navigator.userAgent)
    || (navigator.userAgent.includes("Mac") && navigator.maxTouchPoints > 1)
}

function lockBodyScroll(): void {
  lockCount++
  if (lockCount > 1) return

  const html = document.documentElement
  const body = document.body
  savedStyles = {
    htmlOverflow: html.style.overflow,
    bodyPaddingRight: body.style.paddingRight,
    bodyPosition: body.style.position,
    bodyTop: body.style.top,
    bodyLeft: body.style.left,
    bodyWidth: body.style.width,
  }
  savedScrollY = window.scrollY

  // Only compensate when a scrollbar was actually present, to avoid a jump.
  const scrollbarWidth = window.innerWidth - html.clientWidth
  if (scrollbarWidth > 0) {
    const currentPadding = parseFloat(window.getComputedStyle(body).paddingRight) || 0
    body.style.paddingRight = `${currentPadding + scrollbarWidth}px`
  }

  // Lock on <html> — the real scroll container. Locking only <body> is not
  // enough: wheel events on non-scrollable overlay regions propagate past body
  // and still scroll the html element.
  html.style.overflow = "hidden"

  usedFixedBody = isIOS()
  if (usedFixedBody) {
    body.style.position = "fixed"
    body.style.top = `-${savedScrollY}px`
    body.style.left = "0"
    body.style.width = "100%"
  }
}

function unlockBodyScroll(): void {
  if (lockCount === 0) return
  lockCount--
  if (lockCount > 0 || !savedStyles) return

  const html = document.documentElement
  const body = document.body
  html.style.overflow = savedStyles.htmlOverflow
  body.style.paddingRight = savedStyles.bodyPaddingRight
  body.style.position = savedStyles.bodyPosition
  body.style.top = savedStyles.bodyTop
  body.style.left = savedStyles.bodyLeft
  body.style.width = savedStyles.bodyWidth
  savedStyles = null

  if (usedFixedBody) {
    usedFixedBody = false
    window.scrollTo(0, savedScrollY)
  }
}

/**
 * Locks document/body scrolling while `enabled` is true.
 *
 * `scrollableElement` is accepted for call-site compatibility but is no
 * longer needed: the lock is layout-based, so nested scroll regions inside
 * portaled overlays keep scrolling naturally.
 */
export function useScrollLock(enabled: boolean, scrollableElement?: Element | null): void {
  void scrollableElement
  useEffect(() => {
    if (!enabled || typeof document === "undefined") return

    lockBodyScroll()
    return () => {
      unlockBodyScroll()
    }
  }, [enabled])
}
