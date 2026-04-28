"use client";

import { motion, AnimatePresence } from "framer-motion";
import FilterPanel from "@/src/components/filter/FilterPanel";

interface FilterPanelDesktopProps {
  sidebarWidth: number;
  isOpen: boolean;
}

export default function FilterPanelDesktop({ sidebarWidth, isOpen }: FilterPanelDesktopProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.aside
          key="filter-desktop"
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -16 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="
            hidden md:flex md:flex-col
            fixed top-0 h-screen z-30
            bg-white border-r border-border
            overflow-hidden
            w-[320px]
            shadow-xl
          "
          style={{ left: sidebarWidth }}
        >
          <FilterPanel />
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
