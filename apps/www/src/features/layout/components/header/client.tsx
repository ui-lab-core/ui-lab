'use client';

import { usePathname } from 'next/navigation';
import Header from './header';

export function HeaderClient({ showNavigation = false }: { showNavigation?: boolean }) {
  const pathname = usePathname();

  return (
    <Header pathname={pathname} showNavigation={showNavigation} />
  );
}
