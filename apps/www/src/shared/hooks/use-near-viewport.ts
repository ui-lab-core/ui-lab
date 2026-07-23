'use client';

import { useEffect, useState, type RefObject } from 'react';

export function useNearViewport<T extends Element>(
  ref: RefObject<T | null>,
  {
    rootMargin = '500px 0px',
    viewportMargin,
    once = true,
  }: { rootMargin?: string; viewportMargin?: number; once?: boolean } = {},
) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    if (typeof IntersectionObserver === 'undefined') {
      const frame = window.requestAnimationFrame(() => setVisible(true));
      return () => window.cancelAnimationFrame(frame);
    }

    let mounted = true;
    const resolvedRootMargin = viewportMargin === undefined
      ? rootMargin
      : `${Math.round(window.innerHeight * viewportMargin)}px 0px`;
    const observer = new IntersectionObserver((entries) => {
      if (!mounted) return;
      const entry = entries.find((candidate) => candidate.target === element);
      if (!entry) return;

      if (!once) {
        setVisible(entry.isIntersecting);
        return;
      }

      if (entry.isIntersecting) {
        setVisible(true);
        observer.disconnect();
      }
    }, { rootMargin: resolvedRootMargin });

    observer.observe(element);

    return () => {
      mounted = false;
      observer.disconnect();
    };
  }, [once, ref, rootMargin, viewportMargin]);

  return visible;
}
