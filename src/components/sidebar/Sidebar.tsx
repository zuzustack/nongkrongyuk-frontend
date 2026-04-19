"use client";

import { useState } from "react";
import { Map, SlidersHorizontal, Bookmark, User, ChevronLeft, ChevronRight } from "lucide-react";

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
}

const NAV_ITEMS: NavItem[] = [
  { id: "explore", label: "Eksplor Peta", icon: <Map size={20} /> },
  { id: "filter", label: "Filter", icon: <SlidersHorizontal size={20} /> },
  { id: "saved", label: "Tersimpan", icon: <Bookmark size={20} /> },
  { id: "profile", label: "Profil", icon: <User size={20} /> },
];

interface SidebarProps {
  activeMenu: string;
  onMenuChange: (id: string) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export default function Sidebar({
  activeMenu,
  onMenuChange,
  isCollapsed,
  onToggleCollapse,
}: SidebarProps) {
  return (
    <aside
      className={`
        hidden md:flex md:flex-col
        fixed top-0 left-0 h-screen z-40
        bg-white border-r border-border
        transition-all duration-300 ease-in-out
        ${isCollapsed ? "w-[72px]" : "w-[260px]"}
      `}
    >
      {/* Brand Header */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-border">
        <div
          className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-lg"
          style={{ background: "linear-gradient(135deg, #112D4E 0%, #3F72AF 100%)" }}
        >
          N
        </div>
        {!isCollapsed && (
          <div className="overflow-hidden transition-opacity duration-200">
            <h1 className="text-[15px] font-bold text-primary leading-tight tracking-tight">
              NongkrongYuk
            </h1>
            <p className="text-[11px] text-muted leading-tight mt-0.5">
              Temukan tempat terbaik
            </p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 flex flex-col gap-1 px-3 py-4">
        {NAV_ITEMS.map((item) => {
          const isActive = activeMenu === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onMenuChange(item.id)}
              title={isCollapsed ? item.label : undefined}
              className={`
                group relative flex items-center gap-3 rounded-xl
                transition-all duration-200 cursor-pointer
                ${isCollapsed ? "justify-center px-0 py-3" : "px-4 py-3"}
                ${
                  isActive
                    ? "bg-accent/10 text-accent font-semibold"
                    : "text-primary/60 hover:bg-surface-hover hover:text-primary"
                }
              `}
            >
              {/* Active indicator bar */}
              {isActive && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-6 bg-accent rounded-r-full" />
              )}

              <span
                className={`flex-shrink-0 transition-colors duration-200 ${
                  isActive ? "text-accent" : "text-primary/50 group-hover:text-primary/70"
                }`}
              >
                {item.icon}
              </span>

              {!isCollapsed && (
                <span className="text-[13.5px] whitespace-nowrap">{item.label}</span>
              )}

              {/* Tooltip for collapsed state */}
              {isCollapsed && (
                <span
                  className="
                    absolute left-full ml-2 px-2.5 py-1.5 rounded-lg
                    bg-primary text-white text-xs font-medium
                    opacity-0 pointer-events-none
                    group-hover:opacity-100
                    transition-opacity duration-150
                    whitespace-nowrap z-50 shadow-lg
                  "
                >
                  {item.label}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Collapse Toggle */}
      <div className="px-3 pb-4">
        <button
          onClick={onToggleCollapse}
          className="
            w-full flex items-center justify-center gap-2
            py-2.5 rounded-xl text-muted
            hover:bg-surface-hover hover:text-primary
            transition-all duration-200 cursor-pointer
          "
          title={isCollapsed ? "Perluas sidebar" : "Kecilkan sidebar"}
        >
          {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          {!isCollapsed && <span className="text-xs font-medium">Kecilkan</span>}
        </button>
      </div>
    </aside>
  );
}
