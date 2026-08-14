import { elementsList, getAllStarters, getAllPackages, getElementsInPackage, elementRegistry } from '@ui-lab-core/library/catalog';

type ElementsNavType = 'packages' | 'sections' | 'starters' | 'patterns';

export function getActiveElementsNavFromPathname(pathname: string): ElementsNavType {
  if (pathname.startsWith('/workshop/sections')) return 'sections';
  if (pathname.startsWith('/workshop/starters')) return 'starters';
  if (pathname.startsWith('/workshop/patterns')) return 'patterns';
  return 'packages';
}
