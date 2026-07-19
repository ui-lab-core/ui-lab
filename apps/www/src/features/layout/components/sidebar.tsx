'use client';

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useMemo, memo, useState, type ComponentType } from 'react';
import { Divider } from 'ui-lab-components/divider';
import { Scroll } from 'ui-lab-components/scroll';
import { usePrefetchOnHover } from '@/shared/hooks/use-prefetch-on-hover';
import { cn } from '@/shared/lib/utils';
import { useSidebarToggle } from '@/features/layout/hooks/sidebar-context';
import {
  getActiveDomainForPathname,
  getActiveNavItemForDomain,
  getMainNavItemsForDomain,
} from '@/app/lib/sidebar-config';
import { getSectionsForNav, getHrefForNavItem, isNavItemActive } from '@/features/navigation/lib/sidebar-sections';
import { useDocsNavigationData } from '@/features/navigation/lib/docs-navigation-context';

type ElementsNavType = 'packages' | 'sections' | 'starters' | 'patterns';

type ElementsProps = {
  activeNav: ElementsNavType;
  pathname: string;
  activeCategory?: null;
};

function getElementsNav(pathname: string): ElementsNavType {
  if (pathname.startsWith('/workshop/sections')) return 'sections';
  if (pathname.startsWith('/workshop/starters')) return 'starters';
  if (pathname.startsWith('/workshop/patterns')) return 'patterns';
  return 'packages';
}

const SidebarItemLink = memo(function SidebarItemLink({
  href,
  className,
  children,
}: {
  href: string;
  className: string;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { onMouseEnter, onFocus } = usePrefetchOnHover(href);

  return (
    <>
      <Link
        href={href}
        prefetch={false}
        onMouseEnter={onMouseEnter}
        onFocus={onFocus}
        style={{ display: 'none' }}
        aria-hidden
      />
      <p
        role="button"
        tabIndex={0}
        onClick={() => router.push(href)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            router.push(href);
          }
        }}
        onMouseEnter={onMouseEnter}
        onFocus={onFocus}
        className={className}
      >
        {children}
      </p>
    </>
  );
});

export function Sidebar({
  activeDomain: activeDomainProp,
  activeElementsNav: activeElementsNavProp,
}: {
  activeDomain?: 'docs' | 'components' | 'packages' | 'sections' | 'starters' | 'patterns' | 'design-system';
  activeElementsNav?: ElementsNavType;
} = {}) {
  const { isOpen, closeSidebar } = useSidebarToggle();
  const docsNavigationData = useDocsNavigationData();
  const pathname = usePathname();
  const [Elements, setElements] = useState<ComponentType<ElementsProps> | null>(null);
  const activeDomain = activeDomainProp ?? getActiveDomainForPathname(pathname);
  const activeNavItem = getActiveNavItemForDomain(activeDomain);
  const mainNavItems = useMemo(() => getMainNavItemsForDomain(activeDomain), [activeDomain]);
  const sections = useMemo(() => {
    if (activeDomain === 'packages' || activeDomain === 'sections' || activeDomain === 'starters' || activeDomain === 'patterns') {
      return [];
    }
    return getSectionsForNav(activeNavItem, docsNavigationData);
  }, [activeDomain, activeNavItem, docsNavigationData]);

  const isElementsOrSectionsOrStarters = activeDomain === 'packages' || activeDomain === 'sections' || activeDomain === 'starters' || activeDomain === 'patterns';
  const activeElementsNav = useMemo(
    () => (isElementsOrSectionsOrStarters ? activeElementsNavProp ?? getElementsNav(pathname) : 'packages'),
    [activeElementsNavProp, isElementsOrSectionsOrStarters, pathname]
  );
  const scrollStorageKey = useMemo(
    () => (isElementsOrSectionsOrStarters ? `sidebar-scroll-${activeElementsNav}` : `sidebar-scroll-${activeNavItem}`),
    [activeElementsNav, activeNavItem, isElementsOrSectionsOrStarters]
  );
  useEffect(() => {
    if (!isElementsOrSectionsOrStarters || Elements) return;
    let active = true;
    import('@/features/workshop/components/sidebar-content').then((module) => {
      if (active) setElements(() => module.ElementsList as ComponentType<ElementsProps>);
    });
    return () => { active = false; };
  }, [Elements, isElementsOrSectionsOrStarters]);

  const sidebarWidth = isElementsOrSectionsOrStarters ? 'w-78 md:w-66 lg:w-52 xl:w-62' : 'w-76 md:w-60 lg:w-46 xl:w-62';

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-50 lg:hidden"
          onClick={closeSidebar}
          onKeyDown={(e) => {
            if (e.key === 'Escape') closeSidebar();
          }}
          role="button"
          tabIndex={0}
        />
      )}

      <aside className={cn(
        sidebarWidth, 'flex flex-col',
        'fixed lg:static left-0 top-0 h-screen lg:h-auto',
        'z-[55] lg:z-20',
        'transition-transform duration-300 ease-out',
        'lg:transition-none lg:transform-none',
        isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      )}>
        <div className="flex border-r border-background-700 flex-col h-screen lg:h-[calc(100vh-var(--header-height))] sticky top-0 lg:top-[var(--header-height)]">
          {mainNavItems.length > 0 && (
            <div className="z-10">
              <nav className="py-3 px-2 space-y-1">
                {mainNavItems.map((navItem) => {
                  const isActive = activeNavItem === navItem.id;
                  const Icon = navItem.icon;

                  return (
                    <Link
                      key={navItem.id}
                      href={navItem.href}
                      prefetch={false}
                      className={cn(
                        'flex items-center gap-3 rounded-[6px] border px-4 py-3 text-md leading-[20px] font-medium tracking-normal',
                        isActive
                          ? 'border-background-700 text-foreground-50 bg-background-800'
                          : 'border-transparent text-foreground-400 hover:text-foreground-200 hover:bg-background-800/60'
                      )}
                    >
                      {/*
                      {Icon && <div
                        className={cn(
                          '-ml-4 w-10 rounded-sm flex items-center justify-center',
                          isActive ? 'bg-transparent text-foreground-300' : 'text-foreground-400 opacity-80'
                        )}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                      }
                     */}
                      <span>{navItem.label}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>
          )}

          <Scroll
            className="flex-1"
            maxHeight="100%"
            fade-y
            storageKey={scrollStorageKey}
          >
            {isElementsOrSectionsOrStarters ? (
              <div className="px-4">
                {Elements ? <Elements
                  activeNav={activeElementsNav}
                  pathname={pathname}
                  activeCategory={null}
                /> : null}
              </div>
            ) : (
              <div className="py-5 px-5 space-y-10">
                {sections.map((section) => (
                  <div key={section.label}>
                    <h2 className="font-medium text-md leading-[20px] tracking-normal text-foreground-400">{section.label}</h2>
                    <div className="relative mt-2.5">
                      <Divider orientation='vertical' size="sm" variant='dashed' spacing='none' className="absolute left-0.5 top-0 bottom-0 bg-foreground-400" />
                      <div className="pl-3">
                        {section.items.map((item) => {
                          const active = isNavItemActive(item.id, pathname, activeNavItem);
                          const href = getHrefForNavItem(activeNavItem, item.id);
                          return (
                            <SidebarItemLink
                              key={item.id}
                              href={href}
                              className={cn(
                                'block relative px-[8px] py-2.5 font-medium text-md leading-[20px] tracking-normal rounded-[6px] cursor-pointer',
                                'transition-colors duration-300 ease-out',
                                'hover:duration-0  hover:bg-background-800/50',
                                active
                                  ? 'text-foreground-100 font-medium after:content-[""] after:absolute after:-left-2.5 after:top-0 after:bg-foreground-300 after:w-0.5 after:h-full'
                                  : cn('text-foreground-300', 'hover:text-foreground-200')
                              )}
                            >
                              {item.label}
                            </SidebarItemLink>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Scroll>
        </div>
      </aside>
    </>
  );
}
