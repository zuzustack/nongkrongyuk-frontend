"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import FilterPanel from "@/src/components/filter/FilterPanel";

interface FilterPanelMobileProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function FilterPanelMobile({ isOpen, onClose }: FilterPanelMobileProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="filter-mobile-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="md:hidden fixed inset-0 z-40 bg-black/30 backdrop-blur-sm"
          />

          {/* Bottom Sheet */}
          <motion.div
            key="filter-mobile-sheet"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="
              md:hidden
              fixed bottom-0 left-0 right-0 z-50
              bg-white rounded-t-3xl
              shadow-2xl
              flex flex-col
              max-h-[85vh]
            "
          >
            {/* Drag handle */}
            <div className="flex justify-center pt-3 pb-1 shrink-0">
              <div className="w-10 h-1 rounded-full bg-border" />
            </div>

            {/* Close button */}
            <button
              onClick={onClose}
              className="
                absolute top-4 right-4
                w-8 h-8 flex items-center justify-center
                rounded-full bg-surface text-muted
                hover:bg-surface-hover hover:text-primary
                transition-colors cursor-pointer
              "
              aria-label="Tutup filter"
            >
              <X size={16} />
            </button>

            {/* Panel content */}
            <div className="flex-1 overflow-hidden">
              <FilterPanel onClose={onClose} />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
