import { Metadata } from "next";
import { generateMetadata as buildMetadata } from "@/shared/lib/metadata";
import IconsPageClient from "./client";

export const metadata: Metadata = buildMetadata({
  pathname: "/library/icons",
  title: "Icons",
  description: "Search the Lumen duo-tone icon set and copy icons for the UI Lab Icon component.",
});

export default function IconsPage() {
  return <IconsPageClient />;
}
