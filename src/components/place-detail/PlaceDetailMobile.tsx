"use client";

import { useRef, useState } from "react";
import { X, Wifi, Plug, ChurchIcon, GripHorizontal } from "lucide-react";
import { motion, AnimatePresence, useDragControls } from "framer-motion";
import { useSelectedPlace } from "@/src/providers/SelectedPlaceProvider";

const PRICE_LABEL: Record<number, string> = {
  0: "Gratis",
  1: "Murah",
  2: "Sedang",
  3: "Mahal",
};

type SheetState = "peek" | "full";

export default function PlaceDetailMobile() {
  const { selectedPlace, setSelectedPlace } = useSelectedPlace();
  const [sheetState, setSheetState] = useState<SheetState>("peek");
  const constraintsRef = useRef(null);

  // Height values for each sheet state
  const PEEK_HEIGHT = "50vh";
  const FULL_HEIGHT = "90vh";

  function handleClose() {
    setSheetState("peek");
    setSelectedPlace(null);
  }

  // Expand to full on scroll up / tap expand
  function handleDragEnd(_: unknown, info: { offset: { y: number }; velocity: { y: number } }) {
    if (info.offset.y < -60 || info.velocity.y < -300) {
      setSheetState("full");
    } else if (info.offset.y > 60 || info.velocity.y > 300) {
      if (sheetState === "full") {
        setSheetState("peek");
      } else {
        handleClose();
      }
    }
  }

  return (
    <AnimatePresence>
      {selectedPlace && (
        <>
          {/* Scrim overlay */}
          <motion.div
            key="scrim"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.15 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden fixed inset-0 bg-black z-40"
            onClick={handleClose}
          />

          {/* Bottom sheet */}
          <motion.div
            key="sheet"
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={0.15}
            onDragEnd={handleDragEnd}
            initial={{ y: "100%" }}
            animate={{ height: sheetState === "full" ? FULL_HEIGHT : PEEK_HEIGHT, y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="
              md:hidden
              fixed bottom-0 left-0 right-0 z-50
              bg-white rounded-t-2xl shadow-2xl
              flex flex-col
              overflow-hidden
            "
            style={{ touchAction: "none" }}
          >
            {/* Drag handle + close row */}
            <div className="flex items-center justify-between px-4 pt-3 pb-2 shrink-0">
              <div className="flex-1" />
              {/* Drag handle pill (centered) */}
              <div className="flex-1 flex justify-center">
                <button
                  className="w-10 h-1.5 bg-border rounded-full cursor-grab active:cursor-grabbing"
                  aria-label="Seret untuk memperluas"
                  onClick={() =>
                    setSheetState((s) => (s === "peek" ? "full" : "peek"))
                  }
                />
              </div>
              {/* Close button (right) */}
              <div className="flex-1 flex justify-end">
                <button
                  id="place-detail-mobile-close"
                  onClick={handleClose}
                  className="
                    w-8 h-8 flex items-center justify-center
                    rounded-full bg-surface text-muted
                    hover:bg-surface-hover transition-colors cursor-pointer
                  "
                  aria-label="Tutup detail"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Scrollable content */}
            <div
              className="flex-1 overflow-y-auto overscroll-contain"
              style={{ touchAction: "pan-y" }}
            >
              {/* Place Header */}
              <div
                className="px-5 pt-2 pb-5 shrink-0"
                style={{
                  background:
                    "linear-gradient(160deg, #112D4E 0%, #3F72AF 100%)",
                }}
              >
                <span className="inline-block text-[11px] font-semibold tracking-wide uppercase text-white/70 mb-1">
                  {selectedPlace.category}
                </span>
                <h2 className="text-xl font-bold text-white leading-tight">
                  {selectedPlace.name}
                </h2>
                <p className="text-[12px] text-white/70 mt-1 leading-snug">
                  📍 {selectedPlace.address}
                </p>
              </div>

              {/* Detail Content */}
              <div className="flex flex-col gap-5 p-5 pb-10">
                {/* Price & Vibes */}
                <div className="flex items-center gap-2 flex-wrap">
                  <PriceBadge level={selectedPlace.price_level} />
                  {selectedPlace.vibe_tag.map((tag) => (
                    <span
                      key={tag}
                      className="text-[11px] px-2.5 py-1 rounded-full bg-accent/10 text-accent font-medium italic"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>

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
                      active
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
                  {new Date(selectedPlace.last_updated).toLocaleDateString(
                    "id-ID",
                    { day: "numeric", month: "long", year: "numeric" }
                  )}
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
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
      className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${
        colors[level] ?? colors[0]
      }`}
    >
      {labels[level] ?? "Rp"} · {PRICE_LABEL[level] ?? "-"}
    </span>
  );
}
