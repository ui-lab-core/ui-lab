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
 *   up past body and still scroll the html element. A stable scrollbar gutter
 *   preserves the viewport layout for normal, sticky, and fixed content. Body
 *   padding is used as a fallback in browsers without stable gutter support.
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
  htmlScrollbarGutter: string
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
    htmlScrollbarGutter: html.style.getPropertyValue("scrollbar-gutter"),
    bodyPaddingRight: body.style.paddingRight,
    bodyPosition: body.style.position,
    bodyTop: body.style.top,
    bodyLeft: body.style.left,
    bodyWidth: body.style.width,
  }
  savedScrollY = window.scrollY

  // Capture the usable width before locking, then measure how much it grows
  // when Chromium removes the scrollbar. Measuring the actual before/after
  // change is more reliable than inferring the scrollbar width from
  // window.innerWidth, especially with overlay scrollbars and browser chrome.
  const width = html.clientWidth

  // Unlike body padding, a stable gutter is part of the viewport and therefore
  // also constrains fixed and sticky elements such as application headers.
  const hasStableGutter = typeof CSS !== "undefined"
    && typeof CSS.supports === "function"
    && CSS.supports("scrollbar-gutter", "stable")
  if (hasStableGutter) {
    html.style.setProperty("scrollbar-gutter", "stable")
  }

  // Lock on <html> — the real scroll container. Locking only <body> is not
  // enough: wheel events on non-scrollable overlay regions propagate past body
  // and still scroll the html element.
  html.style.overflow = "hidden"

  // Apply this before the browser has a chance to paint the locked state, so
  // the body's content width remains unchanged while the scrollbar is hidden.
  const compensation = html.clientWidth - width
  if (!hasStableGutter && compensation > 0) {
    const padding = parseFloat(window.getComputedStyle(body).paddingRight) || 0
    body.style.paddingRight = `${padding + compensation}px`
  }

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
  if (savedStyles.htmlScrollbarGutter) {
    html.style.setProperty("scrollbar-gutter", savedStyles.htmlScrollbarGutter)
  } else {
    html.style.removeProperty("scrollbar-gutter")
  }
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
