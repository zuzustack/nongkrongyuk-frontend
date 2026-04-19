"use client";

import {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";

export interface Place {
  id: string;
  name: string;
  address: string;
  category: string;
  price_level: number;
  position: [number, number];
  last_updated: string;
  facilities: {
    has_musholla: boolean;
    has_power_outlets: boolean;
    wifi_speed: string;
  };
  vibe_tag: string[];
}

interface SelectedPlaceContextValue {
  selectedPlace: Place | null;
  setSelectedPlace: (place: Place | null) => void;
}

const SelectedPlaceContext = createContext<SelectedPlaceContextValue | null>(null);

export function SelectedPlaceProvider({ children }: { children: ReactNode }) {
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);

  return (
    <SelectedPlaceContext.Provider value={{ selectedPlace, setSelectedPlace }}>
      {children}
    </SelectedPlaceContext.Provider>
  );
}

export function useSelectedPlace() {
  const ctx = useContext(SelectedPlaceContext);
  if (!ctx) {
    throw new Error("useSelectedPlace must be used within SelectedPlaceProvider");
  }
  return ctx;
}
