import { Sidebar } from "@/features/layout/components/sidebar";
import { getWorkshopNavigation } from "@/features/workshop/lib/workshop-navigation";

export default function SidebarSlot() {
  return (
    <Sidebar
      activeDomain="patterns"
      activeElementsNav="patterns"
      workshopNavigation={getWorkshopNavigation()}
    />
  );
}
