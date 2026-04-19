"use client";

import { Map, SlidersHorizontal, Bookmark, User } from "lucide-react";

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
}

const NAV_ITEMS: NavItem[] = [
  { id: "explore", label: "Eksplor", icon: <Map size={22} /> },
  { id: "filter", label: "Filter", icon: <SlidersHorizontal size={22} /> },
  { id: "saved", label: "Tersimpan", icon: <Bookmark size={22} /> },
  { id: "profile", label: "Profil", icon: <User size={22} /> },
];

interface BottomNavProps {
  activeMenu: string;
  onMenuChange: (id: string) => void;
}

export default function BottomNav({ activeMenu, onMenuChange }: BottomNavProps) {
  return (
    <nav
      className="
        flex md:hidden
        fixed bottom-0 left-0 right-0 z-50
        bg-white/95 backdrop-blur-xl
        border-t border-border
        px-2 pb-[env(safe-area-inset-bottom)]
      "
    >
      {NAV_ITEMS.map((item) => {
        const isActive = activeMenu === item.id;
        return (
          <button
            key={item.id}
            onClick={() => onMenuChange(item.id)}
            className={`
              flex-1 flex flex-col items-center justify-center
              gap-0.5 py-2.5 relative
              transition-colors duration-200 cursor-pointer
              ${isActive ? "text-accent" : "text-primary/40"}
            `}
          >
            {/* Active pill indicator */}
            {isActive && (
              <span
                className="
                  absolute top-0 left-1/2 -translate-x-1/2
                  w-12 h-[3px] bg-accent rounded-b-full
                "
              />
            )}

            <span
              className={`
                flex items-center justify-center
                w-10 h-7 rounded-full
                transition-all duration-200
                ${isActive ? "bg-accent/10 scale-105" : ""}
              `}
            >
              {item.icon}
            </span>

            <span
              className={`
                text-[10.5px] leading-tight
                ${isActive ? "font-semibold text-accent" : "font-medium text-primary/40"}
              `}
            >
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
