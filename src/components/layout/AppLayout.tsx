"use client";

import { useState, type ReactNode } from "react";
import Sidebar from "@/src/components/sidebar/Sidebar";
import BottomNav from "@/src/components/bottom-nav/BottomNav";

interface AppLayoutProps {
  children: ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  const [activeMenu, setActiveMenu] = useState("explore");
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="flex h-screen w-screen overflow-hidden">
      {/* Desktop Sidebar */}
      <Sidebar
        activeMenu={activeMenu}
        onMenuChange={setActiveMenu}
        isCollapsed={isCollapsed}
        onToggleCollapse={() => setIsCollapsed((prev) => !prev)}
      />

      {/* Main Content Area */}
      <main
        className={`
          flex-1 h-screen
          transition-all duration-300 ease-in-out
          pb-[60px] md:pb-0
          ${isCollapsed ? "md:ml-[72px]" : "md:ml-[260px]"}
        `}
      >
        {children}
      </main>

      {/* Mobile Bottom Nav */}
      <BottomNav activeMenu={activeMenu} onMenuChange={setActiveMenu} />
    </div>
  );
}
