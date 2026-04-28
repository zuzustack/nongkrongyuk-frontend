"use client";

import { useMemo } from "react";
import { Wifi, Plug, ChurchIcon, RotateCcw, SlidersHorizontal } from "lucide-react";
import { useFilter, type FilterState } from "@/src/providers/FilterProvider";
import { usePlaces } from "@/src/hooks/UsePlace";
import type { Place } from "@/src/providers/SelectedPlaceProvider";

const PRICE_OPTIONS = [
  { level: 0, label: "Gratis", color: "text-green-600 bg-green-50 border-green-200" },
  { level: 1, label: "Murah", color: "text-emerald-600 bg-emerald-50 border-emerald-200" },
  { level: 2, label: "Sedang", color: "text-amber-600 bg-amber-50 border-amber-200" },
  { level: 3, label: "Mahal", color: "text-red-600 bg-red-50 border-red-200" },
];

interface FilterPanelProps {
  onClose?: () => void;
}

export default function FilterPanel({ onClose }: FilterPanelProps) {
  const { filters, setFilters, resetFilters, activeFilterCount } = useFilter();
  const { data: places } = usePlaces();

  // Derive unique categories & vibe tags dynamically from data
  const { categories, vibeTags } = useMemo(() => {
    if (!places) return { categories: [], vibeTags: [] };
    const cats = Array.from(
      new Set((places as Place[]).map((p) => p.category).filter(Boolean))
    ).sort();
    const tags = Array.from(
      new Set((places as Place[]).flatMap((p) => p.vibe_tag ?? []))
    ).sort();
    return { categories: cats, vibeTags: tags };
  }, [places]);

  function toggleItem<T>(arr: T[], item: T): T[] {
    return arr.includes(item) ? arr.filter((x) => x !== item) : [...arr, item];
  }

  function toggleCategory(cat: string) {
    setFilters({ ...filters, categories: toggleItem(filters.categories, cat) });
  }

  function togglePrice(level: number) {
    setFilters({ ...filters, priceLevels: toggleItem(filters.priceLevels, level) });
  }

  function toggleVibeTag(tag: string) {
    setFilters({ ...filters, vibeTags: toggleItem(filters.vibeTags, tag) });
  }

  function toggleFacility(key: keyof FilterState["facilities"]) {
    setFilters({
      ...filters,
      facilities: { ...filters.facilities, [key]: !filters.facilities[key] },
    });
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-border shrink-0">
        <div className="flex items-center gap-2.5">
          <span
            className="w-8 h-8 rounded-lg flex items-center justify-center text-white"
            style={{ background: "linear-gradient(135deg, #112D4E 0%, #3F72AF 100%)" }}
          >
            <SlidersHorizontal size={15} />
          </span>
          <div>
            <h2 className="text-[14px] font-bold text-primary leading-tight">
              Filter Tempat
            </h2>
            {activeFilterCount > 0 && (
              <p className="text-[11px] text-accent font-medium">
                {activeFilterCount} filter aktif
              </p>
            )}
          </div>
        </div>
        <button
          onClick={resetFilters}
          className="flex items-center gap-1.5 text-[12px] text-muted hover:text-primary transition-colors px-2.5 py-1.5 rounded-lg hover:bg-surface cursor-pointer"
          title="Reset semua filter"
        >
          <RotateCcw size={13} />
          Reset
        </button>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-6">

        {/* Kategori */}
        <section>
          <h3 className="text-[11px] font-semibold text-muted uppercase tracking-widest mb-3">
            Kategori
          </h3>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => {
              const active = filters.categories.includes(cat);
              return (
                <button
                  key={cat}
                  onClick={() => toggleCategory(cat)}
                  className={`
                    text-[12px] font-medium px-3 py-1.5 rounded-full border
                    transition-all duration-150 cursor-pointer
                    ${active
                      ? "bg-accent text-white border-accent shadow-sm"
                      : "bg-surface text-primary/70 border-border hover:border-accent/40 hover:text-accent"
                    }
                  `}
                >
                  {cat}
                </button>
              );
            })}
            {categories.length === 0 && (
              <p className="text-[12px] text-muted italic">Memuat kategori...</p>
            )}
          </div>
        </section>

        {/* Fasilitas */}
        <section>
          <h3 className="text-[11px] font-semibold text-muted uppercase tracking-widest mb-3">
            Fasilitas
          </h3>
          <div className="flex flex-col gap-2.5">
            <FacilityToggle
              icon={<Wifi size={15} />}
              label="WiFi"
              description="Ada koneksi internet"
              active={filters.facilities.wifi}
              onClick={() => toggleFacility("wifi")}
            />
            <FacilityToggle
              icon={<Plug size={15} />}
              label="Colokan Listrik"
              description="Tersedia stop kontak"
              active={filters.facilities.outlets}
              onClick={() => toggleFacility("outlets")}
            />
            <FacilityToggle
              icon={<ChurchIcon size={15} />}
              label="Musholla"
              description="Ada tempat sholat"
              active={filters.facilities.musholla}
              onClick={() => toggleFacility("musholla")}
            />
          </div>
        </section>

        {/* Harga */}
        <section>
          <h3 className="text-[11px] font-semibold text-muted uppercase tracking-widest mb-3">
            Kisaran Harga
          </h3>
          <div className="flex flex-wrap gap-2">
            {PRICE_OPTIONS.map(({ level, label, color }) => {
              const active = filters.priceLevels.includes(level);
              return (
                <button
                  key={level}
                  onClick={() => togglePrice(level)}
                  className={`
                    text-[12px] font-semibold px-3 py-1.5 rounded-full border
                    transition-all duration-150 cursor-pointer
                    ${active ? `${color} shadow-sm` : "bg-surface text-primary/70 border-border hover:border-accent/40 hover:text-accent"}
                  `}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </section>

        {/* Vibe Tags */}
        {vibeTags.length > 0 && (
          <section>
            <h3 className="text-[11px] font-semibold text-muted uppercase tracking-widest mb-3">
              Vibe
            </h3>
            <div className="flex flex-wrap gap-2">
              {vibeTags.map((tag) => {
                const active = filters.vibeTags.includes(tag);
                return (
                  <button
                    key={tag}
                    onClick={() => toggleVibeTag(tag)}
                    className={`
                      text-[12px] font-medium px-3 py-1.5 rounded-full border italic
                      transition-all duration-150 cursor-pointer
                      ${active
                        ? "bg-accent/10 text-accent border-accent/30"
                        : "bg-surface text-muted border-border hover:border-accent/30 hover:text-accent"
                      }
                    `}
                  >
                    #{tag}
                  </button>
                );
              })}
            </div>
          </section>
        )}
      </div>

      {/* Footer — result count hint */}
      <div className="shrink-0 px-5 py-4 border-t border-border bg-surface/50">
        <p className="text-[11px] text-muted text-center">
          {activeFilterCount === 0
            ? "Menampilkan semua tempat"
            : `Filter aktif — marker di peta diperbarui otomatis`}
        </p>
      </div>
    </div>
  );
}

/* ── Sub-component: FacilityToggle ── */

interface FacilityToggleProps {
  icon: React.ReactNode;
  label: string;
  description: string;
  active: boolean;
  onClick: () => void;
}

function FacilityToggle({ icon, label, description, active, onClick }: FacilityToggleProps) {
  return (
    <button
      onClick={onClick}
      className={`
        flex items-center gap-3 w-full
        px-4 py-3 rounded-xl border
        transition-all duration-150 cursor-pointer text-left
        ${active
          ? "bg-accent/8 border-accent/30"
          : "bg-white border-border hover:border-accent/20 hover:bg-surface"
        }
      `}
    >
      <span
        className={`
          w-9 h-9 rounded-lg flex items-center justify-center shrink-0
          transition-colors duration-150
          ${active ? "bg-accent/15 text-accent" : "bg-surface text-muted"}
        `}
      >
        {icon}
      </span>
      <div className="flex-1">
        <p className={`text-[13px] font-semibold ${active ? "text-accent" : "text-primary"}`}>
          {label}
        </p>
        <p className="text-[11px] text-muted">{description}</p>
      </div>
      {/* Toggle switch visual */}
      <div
        className={`
          w-9 h-5 rounded-full relative transition-colors duration-200 shrink-0
          ${active ? "bg-accent" : "bg-border"}
        `}
      >
        <span
          className={`
            absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm
            transition-transform duration-200
            ${active ? "translate-x-4" : "translate-x-0.5"}
          `}
        />
      </div>
    </button>
  );
}
