import { FaBook, FaShapes, FaRegWindowMaximize, FaBox, FaCube, FaSeedling, FaTableCells } from '@/shared/icons/fa6';

type DomainId = 'docs' | 'components' | 'packages' | 'sections' | 'starters' | 'patterns';

interface DomainConfig {
  id: DomainId;
  label: string;
  icon: React.ComponentType;
  headerType: 'tabs' | 'search';
  headerHeight?: string;
}

const DOMAINS: Record<DomainId, DomainConfig> = {
  docs: {
    id: 'docs',
    label: 'Documentation',
    icon: FaBook,
    headerType: 'tabs',
  },
  components: {
    id: 'components',
    label: 'Components',
    icon: FaShapes,
    headerType: 'tabs',
  },
  packages: {
    id: 'packages',
    label: 'Packages',
    icon: FaBox,
    headerType: 'search',
  },
  sections: {
    id: 'sections',
    label: 'Sections',
    icon: FaRegWindowMaximize,
    headerType: 'search',
  },
  starters: {
    id: 'starters',
    label: 'Starters',
    icon: FaSeedling,
    headerType: 'search',
  },
  patterns: {
    id: 'patterns',
    label: 'Patterns',
    icon: FaTableCells,
    headerType: 'search',
  },
};

export interface TabConfig {
  id: string;
  label: string;
  icon?: React.ComponentType;
  path: string;
  isPlaceholder?: boolean;
}

interface TabGroup {
  id: string;
  tabs: TabConfig[];
}

interface RouteTabGroupConfig {
  path: string;
  tabGroupId: string;
}

const TAB_GROUPS: Record<string, TabGroup> = {
  documentation: {
    id: 'documentation',
    tabs: [
      { id: 'docs', label: 'Documentation', icon: FaBook, path: '/docs' },
      { id: 'components', label: 'Components', icon: FaShapes, path: '/components' },
      { id: 'workshop', label: 'Workshop', icon: FaCube, path: '/workshop' },
    ],
  },
};

const ROUTE_TAB_GROUPS: RouteTabGroupConfig[] = [
  { path: '/docs', tabGroupId: 'documentation' },
  { path: '/components', tabGroupId: 'documentation' },
  { path: '/design-system', tabGroupId: 'documentation' },
  { path: '/workshop', tabGroupId: 'documentation' },
  { path: '/blocks', tabGroupId: 'documentation' },
  { path: '/changelog', tabGroupId: 'documentation' },
  { path: '/config', tabGroupId: 'documentation' },
];

interface RouteConfig {
  path: string;
  domainId: DomainId;
}

const ROUTES: Record<string, RouteConfig> = {
  docs: {
    path: '/docs',
    domainId: 'docs',
  },
  components: {
    path: '/components',
    domainId: 'components',
  },
  'design-system': {
    path: '/design-system',
    domainId: 'docs',
  },
  packages: {
    path: '/workshop/elements',
    domainId: 'packages',
  },
  sections: {
    path: '/workshop/sections',
    domainId: 'sections',
  },
  patterns: {
    path: '/workshop/patterns',
    domainId: 'patterns',
  },
  blocks: {
    path: '/blocks',
    domainId: 'packages',
  },
  starters: {
    path: '/workshop/starters',
    domainId: 'starters',
  },
  changelog: {
    path: '/changelog',
    domainId: 'docs',
  },
  config: {
    path: '/config',
    domainId: 'docs',
  },
};

const ROUTES_ARRAY = Object.values(ROUTES);

const getDomainForPathname = (pathname: string): DomainId | undefined => {
  const route = ROUTES_ARRAY.find((r) => pathname.startsWith(r.path));
  return route?.domainId;
};

export const shouldApplyRevealCollapse = (pathname: string): boolean => {
  const domainId = getDomainForPathname(pathname);
  if (!domainId) return false;
  const domain = DOMAINS[domainId];
  return domain?.headerType === 'tabs' || domainId === 'packages' || domainId === 'sections' || domainId === 'starters' || domainId === 'patterns';
};

export const getTabGroupForPathname = (pathname: string): TabGroup | undefined => {
  const sortedRoutes = [...ROUTE_TAB_GROUPS].sort((a, b) => b.path.length - a.path.length);
  const routeConfig = sortedRoutes.find((r) => pathname.startsWith(r.path));
  if (!routeConfig) return undefined;
  return TAB_GROUPS[routeConfig.tabGroupId];
};

const ACTIVE_TAB_OVERRIDES: Record<string, string | undefined> = {
  '/design-system': 'docs',
  '/workshop': 'workshop',
  '/blocks': 'workshop',
  '/changelog': 'docs',
};

export const getActiveTabForPathname = (pathname: string): string | undefined => {
  for (const [pattern, tabId] of Object.entries(ACTIVE_TAB_OVERRIDES)) {
    if (pathname.startsWith(pattern)) {
      return tabId;
    }
  }

  const tabGroup = getTabGroupForPathname(pathname);
  if (!tabGroup) return undefined;
  const sortedTabs = [...tabGroup.tabs].sort((a, b) => b.path.length - a.path.length);
  const activeTab = sortedTabs.find((tab) => pathname.startsWith(tab.path));
  return activeTab?.id;
};
