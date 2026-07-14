import { elementsList, getAllStarters, getAllPackages, getElementsInPackage, elementRegistry } from '@ui-lab-core/library/catalog';

function getElementsListForSidebar() {
  return elementsList;
}

function getPackagesForSidebar() {
  return getAllPackages();
}

function getPackageElementsForSidebar(packageId: string) {
  const elementIds = getElementsInPackage(packageId);
  return elementIds.map(id => elementRegistry[id]).filter(Boolean);
}

type ElementsNavType = 'packages' | 'sections' | 'starters' | 'patterns';

export function getActiveElementsNavFromPathname(pathname: string): ElementsNavType {
  if (pathname.startsWith('/workshop/sections')) return 'sections';
  if (pathname.startsWith('/workshop/starters')) return 'starters';
  if (pathname.startsWith('/workshop/patterns')) return 'patterns';
  return 'packages';
}
