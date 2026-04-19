"use client";

import { useEffect, useState, type ReactNode } from "react";
import Sidebar from "@/src/components/sidebar/Sidebar";
import BottomNav from "@/src/components/bottom-nav/BottomNav";
import PlaceDetailDesktop from "@/src/components/place-detail/PlaceDetailDesktop";
import PlaceDetailMobile from "@/src/components/place-detail/PlaceDetailMobile";
import SearchBar from "@/src/components/search/SearchBar";
import { useSelectedPlace } from "@/src/providers/SelectedPlaceProvider";

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
  const isDesktop = useIsDesktop();

  const sidebarW = isCollapsed ? 72 : 260;
  const detailW = 320;

  // Compute left margin only on desktop (sidebar + detail panel are fixed positioned)
  const mainMarginLeft = isDesktop
    ? sidebarW + (selectedPlace ? detailW : 0)
    : 0;

  return (
    <div className="flex h-screen w-screen overflow-hidden">
      {/* Desktop Sidebar — hidden on mobile (handled inside Sidebar component) */}
      <Sidebar
        activeMenu={activeMenu}
        onMenuChange={setActiveMenu}
        isCollapsed={isCollapsed}
        onToggleCollapse={() => setIsCollapsed((prev) => !prev)}
      />

      {/* Desktop Place Detail Panel — sits next to the sidebar */}
      <PlaceDetailDesktop sidebarWidth={sidebarW} />

      {/* Search Bar — floats on top of map (mobile) / next to sidebar (desktop) */}
      <SearchBar desktopLeft={sidebarW} desktopWidth={detailW} />

      {/* Main content — full width on mobile, offset on desktop */}
      <main
        className="flex-1 h-screen pb-[60px] md:pb-0 transition-all duration-300 ease-in-out"
        style={{ marginLeft: mainMarginLeft }}
      >
        {children}
      </main>

      {/* Mobile Bottom Nav — hidden when a place is selected */}
      {!selectedPlace && (
        <BottomNav activeMenu={activeMenu} onMenuChange={setActiveMenu} />
      )}

      {/* Mobile Bottom Sheet Detail */}
      <PlaceDetailMobile />
    </div>
  );
}

export default function AppLayout({ children }: AppLayoutProps) {
  return <AppLayoutInner>{children}</AppLayoutInner>;
}
