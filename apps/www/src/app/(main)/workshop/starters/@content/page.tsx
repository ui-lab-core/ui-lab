import type { Metadata } from "next";
import ClientPage from "./client";
import { getWorkshopStarterSummaries } from "@/features/workshop/lib/workshop-content";

export const metadata: Metadata = {
  title: "Starters | UI Lab",
  description: "Browse UI Lab starters",
};

export default function Page() {
  // Summaries only: a starter's files never enter a listing payload.
  return <ClientPage starters={getWorkshopStarterSummaries()} />;
}
