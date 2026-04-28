"use client";

import { useEffect, useState, type ReactNode } from "react";
import Sidebar from "@/src/components/sidebar/Sidebar";
import BottomNav from "@/src/components/bottom-nav/BottomNav";
import PlaceDetailDesktop from "@/src/components/place-detail/PlaceDetailDesktop";
import PlaceDetailMobile from "@/src/components/place-detail/PlaceDetailMobile";
import SearchBar from "@/src/components/search/SearchBar";
import FilterPanelDesktop from "@/src/components/filter/FilterPanelDesktop";
import FilterPanelMobile from "@/src/components/filter/FilterPanelMobile";
import { useSelectedPlace } from "@/src/providers/SelectedPlaceProvider";
import { useFilter } from "@/src/providers/FilterProvider";

function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    setIsDesktop(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);
  return isDesktop;
}

interface AppLayoutProps {
  children: ReactNode;
}

function AppLayoutInner({ children }: AppLayoutProps) {
  const [activeMenu, setActiveMenu] = useState("explore");
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { selectedPlace } = useSelectedPlace();
  const { activeFilterCount } = useFilter();
  const isDesktop = useIsDesktop();

  const sidebarW = isCollapsed ? 72 : 260;
  const detailW = 320;

  const isFilterOpen = activeMenu === "filter";

  // If filter panel is open on desktop, it occupies the same slot as detail panel
  const rightPanelOpen = selectedPlace || isFilterOpen;
  const mainMarginLeft = isDesktop
    ? sidebarW + (rightPanelOpen ? detailW : 0)
    : 0;

  function handleMenuChange(id: string) {
    // If clicking an already-active non-explore menu, toggle it off
    if (id === activeMenu && id !== "explore") {
      setActiveMenu("explore");
    } else {
      setActiveMenu(id);
    }

    // When a place is selected and user clicks explore, keep place detail open
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden">
      {/* Desktop Sidebar */}
      <Sidebar
        activeMenu={activeMenu}
        onMenuChange={handleMenuChange}
        isCollapsed={isCollapsed}
        onToggleCollapse={() => setIsCollapsed((prev) => !prev)}
        filterBadgeCount={activeFilterCount}
      />

      {/* Desktop Place Detail Panel */}
      {!isFilterOpen && <PlaceDetailDesktop sidebarWidth={sidebarW} />}

      {/* Desktop Filter Panel */}
      <FilterPanelDesktop sidebarWidth={sidebarW} isOpen={isFilterOpen} />

      {/* Search Bar */}
      <SearchBar desktopLeft={sidebarW} desktopWidth={detailW} />

      {/* Main content */}
      <main
        className="flex-1 h-screen pb-[60px] md:pb-0 transition-all duration-300 ease-in-out"
        style={{ marginLeft: mainMarginLeft }}
      >
        {children}
      </main>

      {/* Mobile Bottom Nav — hidden when a place is selected */}
      {!selectedPlace && (
        <BottomNav
          activeMenu={activeMenu}
          onMenuChange={handleMenuChange}
          filterBadgeCount={activeFilterCount}
        />
      )}

      {/* Mobile Filter Bottom Sheet */}
      <FilterPanelMobile
        isOpen={isFilterOpen && !isDesktop}
        onClose={() => setActiveMenu("explore")}
      />

      {/* Mobile Bottom Sheet Detail */}
      <PlaceDetailMobile />
    </div>
  );
}

export default function AppLayout({ children }: AppLayoutProps) {
  return <AppLayoutInner>{children}</AppLayoutInner>;
}
