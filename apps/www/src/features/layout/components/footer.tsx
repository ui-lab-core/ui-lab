"use client";

import Link from "next/link";
import { Logo } from "@/features/layout/components/logo";
import { FaGithub } from "@/shared/icons/fa6";

const GITHUB_URL = "https://github.com/ui-lab-core/ui-lab";
const CURRENT_YEAR = new Date().getFullYear();

interface FooterLink {
  label: string;
  href: string;
  external?: boolean;
}

const footerColumns: { title: string; links: FooterLink[] }[] = [
  {
    title: "Product",
    links: [
      { label: "Components", href: "/components" },
      { label: "Workshop", href: "/workshop" },
      { label: "Documentation", href: "/docs" },
      { label: "Changelog", href: "/changelog" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Overview", href: "/docs" },
      { label: "Installation", href: "/docs/installation" },
      { label: "Usage", href: "/docs/usage" },
    ],
  },
  {
    title: "Connect",
    links: [
      { label: "Contact", href: "/contact" },
      { label: "GitHub", href: GITHUB_URL, external: true },
    ],
  },
];

const legalLinks: FooterLink[] = [
  { label: "Privacy", href: "/privacy" },
  { label: "Terms", href: "/terms" },
];

function FooterLinkItem({ link }: { link: FooterLink }) {
  const className = "text-sm text-foreground-400 transition-colors hover:text-foreground-200";

  if (link.external) {
    return (
      <a href={link.href} target="_blank" rel="noreferrer" className={className}>
        {link.label}
      </a>
    );
  }

  return (
    <Link href={link.href} className={className}>
      {link.label}
    </Link>
  );
}

export function Footer() {
  return (
    <footer className="relative border-t border-background-700 overflow-hidden">
      <div className="absolute inset-0 bg-background-950/80 -z-10" />

      <div className="max-w-(--page-width) mx-auto relative z-10">
        <div className="flex px-8 flex-col gap-x-16 gap-y-10 py-12 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex items-center gap-2.5">
            <Logo className="w-7 h-7 text-foreground-300" />
            <span className="text-sm font-semibold text-foreground-300">UI Lab</span>
          </div>

          <div className="grid grid-cols-2 gap-x-28 gap-y-10 sm:grid-cols-3">
            {footerColumns.map((column) => (
              <div key={column.title} className="flex flex-col gap-3">
                <h3 className="text-sm font-semibold text-foreground-200">{column.title}</h3>
                <ul className="flex flex-col gap-2.5">
                  {column.links.map((link) => (
                    <li key={link.label}>
                      <FooterLinkItem link={link} />
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="px-8 flex flex-col gap-4 py-6 sm:flex-row sm:items-center sm:justify-between">
          <span className="text-sm text-foreground-500">© {CURRENT_YEAR} UI Lab</span>

          <div className="flex items-center gap-6">
            {legalLinks.map((link) => (
              <FooterLinkItem key={link.label} link={link} />
            ))}
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noreferrer"
              aria-label="GitHub"
              className="text-foreground-400 transition-colors hover:text-foreground-200"
            >
              <FaGithub size={16} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
