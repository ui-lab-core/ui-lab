"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Header from "./header";

export function HeaderClient({ showNavigation = false }: { showNavigation?: boolean }) {
  const pathname = usePathname();
  const [hydratedPathname, setHydratedPathname] = useState<string | null>(null);

  useEffect(() => {
    setHydratedPathname(pathname);
  }, [pathname]);

  return <Header pathname={hydratedPathname ?? ""} showNavigation={showNavigation} />;
}
