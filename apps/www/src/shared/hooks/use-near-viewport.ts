'use client';

import { useEffect, useState, type RefObject } from 'react';

export function useNearViewport<T extends Element>(
  ref: RefObject<T | null>,
  { rootMargin = '500px 0px', once = true }: { rootMargin?: string; once?: boolean } = {},
) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    if (typeof IntersectionObserver === 'undefined') {
      setVisible(true);
      return;
    }

    let mounted = true;
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
    }, { rootMargin });

    observer.observe(element);

    return () => {
      mounted = false;
      observer.disconnect();
    };
  }, [once, ref, rootMargin]);

  return visible;
}
