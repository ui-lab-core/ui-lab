'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { usePrefetchOnHover } from '@/shared/hooks/use-prefetch-on-hover';

interface SidebarItemLinkProps {
  href: string;
  className: string;
  children: React.ReactNode;
}

export function SidebarItemLink({ href, className, children }: SidebarItemLinkProps) {
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
      <div
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
      </div>
    </>
  );
}
