"use client";

import { X, Wifi, Plug, ChurchIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useSelectedPlace } from "@/src/providers/SelectedPlaceProvider";

interface PlaceDetailDesktopProps {
  sidebarWidth: number;
}

const PRICE_LABEL: Record<number, string> = {
  0: "Gratis",
  1: "Murah",
  2: "Sedang",
  3: "Mahal",
};

function PriceBadge({ level }: { level: number }) {
  const labels = ["Rp", "Rp", "Rp Rp", "Rp Rp Rp"];
  const colors = [
    "text-green-600 bg-green-50",
    "text-green-600 bg-green-50",
    "text-amber-600 bg-amber-50",
    "text-red-600 bg-red-50",
  ];
  return (
    <span
      className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${colors[level] ?? colors[0]}`}
    >
      {labels[level] ?? "Rp"} · {PRICE_LABEL[level] ?? "-"}
    </span>
  );
}

function FacilityRow({
  icon,
  label,
  value,
  active,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  active: boolean;
}) {
  return (
    <div className="flex items-center gap-3">
      <span
        className={`w-8 h-8 flex items-center justify-center rounded-full shrink-0 ${
          active ? "bg-accent/10 text-accent" : "bg-surface text-muted"
        }`}
      >
        {icon}
      </span>
      <div>
        <p className="text-xs text-muted">{label}</p>
        <p className="text-[13px] font-semibold text-primary">{value}</p>
      </div>
    </div>
  );
}

export default function PlaceDetailDesktop({ sidebarWidth }: PlaceDetailDesktopProps) {
  const { selectedPlace, setSelectedPlace } = useSelectedPlace();

  return (
    <AnimatePresence>
      {selectedPlace && (
        <motion.aside
          key="detail-desktop"
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -16 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="
            hidden md:flex md:flex-col
            fixed top-0 h-screen z-30
            bg-white border-r border-border
            overflow-y-auto
            w-[320px]
            shadow-xl
          "
          style={{ left: sidebarWidth }}
        >
          {/* Gradient header */}
          <div
            className="relative shrink-0 h-[160px] flex items-end p-5"
            style={{
              background: "linear-gradient(160deg, #112D4E 0%, #3F72AF 100%)",
            }}
          >
            <button
              id="place-detail-desktop-close"
              onClick={() => setSelectedPlace(null)}
              className="
                absolute top-4 right-4
                w-8 h-8 flex items-center justify-center
                rounded-full bg-white/20 text-white
                hover:bg-white/30 transition-colors cursor-pointer
              "
              aria-label="Tutup detail"
            >
              <X size={16} />
            </button>

            <div>
              <span className="inline-block text-[11px] font-semibold tracking-wide uppercase text-white/70 mb-1">
                {selectedPlace.category}
              </span>
              <h2 className="text-xl font-bold text-white leading-tight">
                {selectedPlace.name}
              </h2>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 flex flex-col gap-5 p-5 pb-10">
            {/* Address & Price */}
            <div className="flex items-start justify-between gap-3">
              <p className="text-[13px] text-muted leading-snug flex-1">
                📍 {selectedPlace.address}
              </p>
              <PriceBadge level={selectedPlace.price_level} />
            </div>

            {/* Vibe Tags */}
            {selectedPlace.vibe_tag.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {selectedPlace.vibe_tag.map((tag) => (
                  <span
                    key={tag}
                    className="text-[11px] px-2.5 py-1 rounded-full bg-accent/10 text-accent font-medium italic"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            <hr className="border-border" />

            {/* Facilities */}
            <div>
              <h3 className="text-[12px] font-semibold text-muted uppercase tracking-wide mb-3">
                Fasilitas
              </h3>
              <div className="flex flex-col gap-3">
                <FacilityRow
                  icon={<Wifi size={15} />}
                  label="Kecepatan Wi-Fi"
                  value={
                    selectedPlace.facilities.wifi_speed === "None"
                      ? "Tidak tersedia"
                      : selectedPlace.facilities.wifi_speed
                  }
                  active={selectedPlace.facilities.wifi_speed !== "None"}
                />
                <FacilityRow
                  icon={<Plug size={15} />}
                  label="Colokan Listrik"
                  value={
                    selectedPlace.facilities.has_power_outlets
                      ? "Tersedia"
                      : "Tidak tersedia"
                  }
                  active={selectedPlace.facilities.has_power_outlets}
                />
                <FacilityRow
                  icon={<ChurchIcon size={15} />}
                  label="Musholla"
                  value={
                    selectedPlace.facilities.has_musholla
                      ? "Tersedia"
                      : "Tidak tersedia"
                  }
                  active={selectedPlace.facilities.has_musholla}
                />
              </div>
            </div>

            <hr className="border-border" />
            <p className="text-[11px] text-muted/70 text-center">
              Diperbarui:{" "}
              {new Date(selectedPlace.last_updated).toLocaleDateString("id-ID", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
