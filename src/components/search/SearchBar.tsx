"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { Search, X, MapPin, Wifi, Plug } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { usePlaces } from "@/src/hooks/UsePlace";
import { useSelectedPlace, type Place } from "@/src/providers/SelectedPlaceProvider";

interface SearchBarProps {
  /** px value — left offset on desktop so bar sits right of the sidebar */
  desktopLeft: number;
  /** px value — width of the detail panel, so search bar matches it */
  desktopWidth: number;
}

export default function SearchBar({ desktopLeft, desktopWidth }: SearchBarProps) {
  const { data: places } = usePlaces();
  const { selectedPlace, setSelectedPlace } = useSelectedPlace();

  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setIsFocused(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Filter places based on query
  const filteredPlaces = useMemo(() => {
    if (!places || query.trim().length === 0) return [];
    const q = query.toLowerCase();
    return (places as Place[]).filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.address.toLowerCase().includes(q) ||
        p.vibe_tag.some((tag) => tag.toLowerCase().includes(q))
    );
  }, [places, query]);

  const showDropdown = isFocused && query.trim().length > 0;

  function handleSelect(place: Place) {
    setSelectedPlace(place);
    setQuery("");
    setIsFocused(false);
    inputRef.current?.blur();
  }

  function handleClear() {
    setQuery("");
    inputRef.current?.focus();
  }

  return (
    <>
      {/* ─── MOBILE: top floating bar ─── */}
      <div
        ref={wrapperRef}
        className="
          md:hidden
          fixed top-4 left-4 right-4 z-50
        "
      >
        <SearchInput
          ref={inputRef}
          query={query}
          onChange={setQuery}
          onFocus={() => setIsFocused(true)}
          onClear={handleClear}
          selectedPlace={!!selectedPlace}
          onCloseDetail={() => setSelectedPlace(null)}
        />
        <AnimatePresence>
          {showDropdown && (
            <ResultsDropdown
              results={filteredPlaces}
              query={query}
              onSelect={handleSelect}
            />
          )}
        </AnimatePresence>
      </div>

      {/* ─── DESKTOP: fixed next to sidebar, width matches detail panel ─── */}
      <div
        className="
          hidden md:block
          fixed top-4 z-40 px-4
        "
        style={{ left: desktopLeft, width: desktopWidth }}
      >
        <div ref={wrapperRef}>
          <SearchInput
            ref={inputRef}
            query={query}
            onChange={setQuery}
            onFocus={() => setIsFocused(true)}
            onClear={handleClear}
            selectedPlace={!!selectedPlace}
            onCloseDetail={() => setSelectedPlace(null)}
          />
          <AnimatePresence>
            {showDropdown && (
              <ResultsDropdown
                results={filteredPlaces}
                query={query}
                onSelect={handleSelect}
              />
            )}
          </AnimatePresence>
        </div>
      </div>
    </>
  );
}

/* ──────────────────────────────────────────────
   Sub-components
   ────────────────────────────────────────────── */

import { forwardRef } from "react";

interface SearchInputProps {
  query: string;
  onChange: (v: string) => void;
  onFocus: () => void;
  onClear: () => void;
  selectedPlace?: boolean;
  onCloseDetail?: () => void;
}

const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  function SearchInput({ query, onChange, onFocus, onClear, selectedPlace, onCloseDetail }, ref) {
    return (
      <div
        className="
          flex items-center gap-2.5
          bg-white/50 backdrop-blur-xl
          border border-white/50
          rounded-2xl px-4 py-3
          shadow-lg shadow-black/5
          focus-within:ring-2 focus-within:ring-accent/30
          focus-within:border-accent/40
          transition-all duration-200
        "
      >
        <Search size={18} className="text-muted shrink-0" />
        <input
          ref={ref}
          id="search-input"
          type="text"
          placeholder="Cari tempat nongkrong..."
          value={query}
          onChange={(e) => onChange(e.target.value)}
          onFocus={onFocus}
          className="
            flex-1 bg-transparent outline-none
            text-[14px] text-primary
            placeholder:text-muted/60
          "
          autoComplete="off"
        />
        {/* Tombol Close Gabungan: Hapus pencarian dan/atau tutup detail */}
        {(query.length > 0 || selectedPlace) && (
          <div className="flex items-center pl-2 border-l border-white/40">
            <button
              onClick={() => {
                onClear();
                if (onCloseDetail) onCloseDetail();
              }}
              className="
                flex items-center justify-center px-1
                text-muted hover:text-primary
                transition-colors cursor-pointer
              "
              title="Tutup detail / Hapus pencarian"
              aria-label="Tutup atau hapus"
            >
              <X size={18} />
            </button>
          </div>
        )}
      </div>
    );
  }
);

interface ResultsDropdownProps {
  results: Place[];
  query: string;
  onSelect: (place: Place) => void;
}

function ResultsDropdown({ results, query, onSelect }: ResultsDropdownProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -6, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -6, scale: 0.98 }}
      transition={{ duration: 0.15, ease: "easeOut" }}
      className="
        mt-2 rounded-2xl overflow-hidden
        bg-white/60 backdrop-blur-xl
        border border-white/40
        shadow-xl shadow-black/8
        max-h-[350px] overflow-y-auto
      "
    >
      {results.length === 0 ? (
        <div className="px-5 py-8 text-center">
          <p className="text-sm text-muted">
            Tidak ada tempat untuk &quot;<span className="font-semibold text-primary">{query}</span>&quot;
          </p>
        </div>
      ) : (
        <ul>
          {results.map((place, idx) => (
            <li key={place.id}>
              <button
                onClick={() => onSelect(place)}
                className="
                  w-full text-left px-4 py-3
                  flex items-start gap-3
                  hover:bg-accent/5 transition-colors
                  cursor-pointer
                  border-b border-border/30 last:border-b-0
                "
              >
                {/* Icon circle */}
                <span
                  className="
                    mt-0.5 shrink-0 w-9 h-9 rounded-xl
                    flex items-center justify-center
                    bg-gradient-to-br from-primary to-accent
                    text-white
                  "
                >
                  <MapPin size={16} />
                </span>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-[13.5px] font-semibold text-primary truncate">
                    {place.name}
                  </p>
                  <p className="text-[11.5px] text-muted truncate mt-0.5">
                    {place.address}
                  </p>
                  {/* Tags row */}
                  <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-accent/10 text-accent font-medium">
                      {place.category}
                    </span>
                    {place.facilities.wifi_speed !== "None" && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-green-50 text-green-600 font-medium flex items-center gap-0.5">
                        <Wifi size={9} /> WiFi
                      </span>
                    )}
                    {place.facilities.has_power_outlets && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-amber-50 text-amber-600 font-medium flex items-center gap-0.5">
                        <Plug size={9} /> Colokan
                      </span>
                    )}
                  </div>
                </div>
              </button>
            </li>
          ))}
        </ul>
      )}
    </motion.div>
  );
}
