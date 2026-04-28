"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  type ReactNode,
} from "react";
import type { Place } from "@/src/providers/SelectedPlaceProvider";

export interface FilterState {
  categories: string[];
  facilities: {
    wifi: boolean;
    outlets: boolean;
    musholla: boolean;
  };
  priceLevels: number[];
  vibeTags: string[];
}

const DEFAULT_FILTER: FilterState = {
  categories: [],
  facilities: {
    wifi: false,
    outlets: false,
    musholla: false,
  },
  priceLevels: [],
  vibeTags: [],
};

interface FilterContextValue {
  filters: FilterState;
  setFilters: (filters: FilterState) => void;
  resetFilters: () => void;
  applyFilters: (places: Place[]) => Place[];
  activeFilterCount: number;
}

const FilterContext = createContext<FilterContextValue | null>(null);

export function FilterProvider({ children }: { children: ReactNode }) {
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTER);

  const resetFilters = useCallback(() => {
    setFilters(DEFAULT_FILTER);
  }, []);

  const applyFilters = useCallback(
    (places: Place[]): Place[] => {
      return places.filter((place) => {
        // Category filter
        if (
          filters.categories.length > 0 &&
          !filters.categories.includes(place.category)
        ) {
          return false;
        }

        // Facilities filter
        if (filters.facilities.wifi && place.facilities.wifi_speed === "None") {
          return false;
        }
        if (
          filters.facilities.outlets &&
          !place.facilities.has_power_outlets
        ) {
          return false;
        }
        if (
          filters.facilities.musholla &&
          !place.facilities.has_musholla
        ) {
          return false;
        }

        // Price level filter
        if (
          filters.priceLevels.length > 0 &&
          !filters.priceLevels.includes(place.price_level)
        ) {
          return false;
        }

        // Vibe tag filter
        if (filters.vibeTags.length > 0) {
          const hasTag = filters.vibeTags.some((tag) =>
            place.vibe_tag.includes(tag)
          );
          if (!hasTag) return false;
        }

        return true;
      });
    },
    [filters]
  );

  const activeFilterCount = useMemo(() => {
    let count = 0;
    count += filters.categories.length;
    count += filters.facilities.wifi ? 1 : 0;
    count += filters.facilities.outlets ? 1 : 0;
    count += filters.facilities.musholla ? 1 : 0;
    count += filters.priceLevels.length;
    count += filters.vibeTags.length;
    return count;
  }, [filters]);

  return (
    <FilterContext.Provider
      value={{ filters, setFilters, resetFilters, applyFilters, activeFilterCount }}
    >
      {children}
    </FilterContext.Provider>
  );
}

export function useFilter() {
  const ctx = useContext(FilterContext);
  if (!ctx) {
    throw new Error("useFilter must be used within FilterProvider");
  }
  return ctx;
}
