"use client";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  Circle,
  useMapEvents,
} from "react-leaflet";
import { useCafes } from "@/src/hooks/UseCafe";
import { useMosques } from "@/src/hooks/UseMosque";
import { useSelectedPlace } from "@/src/providers/SelectedPlaceProvider";
import { useFilter } from "@/src/providers/FilterProvider";
import { useEffect, useRef } from "react";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import MapService from "@/src/services/MapService";

// Perbaikan icon default Leaflet untuk Next.js
const defaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

// Icon untuk cafe (Google Maps style pin)
const cafeIcon = L.divIcon({
  className: "bg-transparent",
  html: `
    <div class="flex flex-col items-center">
      <div class="bg-[#003985] w-10 h-10 rounded-2xl flex items-center justify-center border-r-2 border-l-2 border-t-2 border-white relative z-10">
        <img src="/cafe.png" style="width: 24px; height: 24px;" />
      </div>
      <div class="bg-[#003985] w-5 h-5 rotate-45 -mt-3 border-r-2 border-b-2 border-white shadow-lg"></div>
    </div>
  `,
  iconSize: [40, 50],
  iconAnchor: [20, 45],
});

// Icon untuk masjid (Google Maps style pin)
const mosqueIcon = L.divIcon({
  className: "bg-transparent",
  html: `
    <div class="flex flex-col items-center">
      <div class="bg-[#003985] w-10 h-10 rounded-2xl flex items-center justify-center border-r-2 border-l-2 border-t-2 border-white relative z-10">
        <img src="/mosque.png" style="width: 24px; height: 24px;" />
      </div>
      <div class="bg-[#003985] w-5 h-5 rotate-45 -mt-3 border-r-2 border-b-2 border-white shadow-lg"></div>
    </div>
  `,
  iconSize: [40, 50],
  iconAnchor: [20, 45],
});

// Custom popup card cafe
function PopupCafe({ cafe }: { cafe: any }) {
  return (
    <div
      className="p-3 shadow rounded-lg"
      style={{
        background: "linear-gradient(135deg, #112D4E 0%, #3F72AF 100%)",
      }}
    >
      <h3 className="text-white text-sm font-semibold">{cafe.name}</h3>
    </div>
  );
}

// Custom popup card masjid
function PopupMosque({ mosque }: { mosque: any }) {
  return (
    <div
      className="p-3 shadow rounded-lg"
      style={{
        background: "linear-gradient(135deg, #112D4E 0%, #3F72AF 100%)",
      }}
    >
      <h3 className="text-white text-sm font-semibold">{mosque.name}</h3>
    </div>
  );
}

// Marker untuk masjid
function MosqueMarker({ mosque }: any) {
  return (
    <Marker position={mosque.position} icon={mosqueIcon}>
      <Popup className="custom-popup" closeButton={false} offset={[0, -50]}>
        <PopupMosque mosque={mosque} />
      </Popup>
    </Marker>
  );
}

// Marker untuk cafe
function CafeMarker({ cafe, isSelected, setSelectedPlace, markerRefs }: any) {
  const map = useMap();

  // Watch SelectedPlace
  useEffect(() => {
    if (isSelected) {
      map.flyTo(cafe.position, 17, {
        duration: 0.5,
      });
    }
  }, [isSelected]);

  return (
    <Marker
      position={cafe.position}
      icon={isSelected ? cafeIcon : defaultIcon}
      ref={(ref) => {
        if (ref && markerRefs) markerRefs.current[cafe.id] = ref;
      }}
      eventHandlers={{
        click: () => {
          setSelectedPlace(cafe);

          // zoom ke marker
          map.flyTo(cafe.position, 17, {
            duration: 0.5,
          });

          // buka popup
          setTimeout(() => {
            if (markerRefs && markerRefs.current[cafe.id]) {
              markerRefs.current[cafe.id]?.openPopup();
            }
          }, 0);
        },
      }}
    >
      <Popup className="custom-popup" closeButton={false} offset={[0, -50]}>
        <PopupCafe cafe={cafe} />
      </Popup>
    </Marker>
  );
}

// Event handler untuk set selectedMarker null saat klik di luar marker
function MapClickHandler({ setSelectedPlace }: { setSelectedPlace: any }) {
  useMapEvents({
    click: () => {
      setSelectedPlace(null);
    },
  });
  return null;
}

// helper sederhana (Haversine)
function getDistance(a: [number, number], b: [number, number]) {
  const R = 6371000; // meter
  const toRad = (v: number) => (v * Math.PI) / 180;

  const dLat = toRad(b[0] - a[0]);
  const dLng = toRad(b[1] - a[1]);

  const lat1 = toRad(a[0]);
  const lat2 = toRad(b[0]);

  const x =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLng / 2) * Math.sin(dLng / 2) * Math.cos(lat1) * Math.cos(lat2);

  const y = 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));

  return R * y;
}

export default function Map() {
  const {
    data: cafes,
    isLoading: cafesLoading,
    isError: cafesError,
  } = useCafes();
  const {
    data: mosques,
    isLoading: mosquesLoading,
    isError: mosquesError,
  } = useMosques();
  const isLoading = cafesLoading || mosquesLoading;
  const isError = cafesError || mosquesError;
  const { selectedPlace, setSelectedPlace } = useSelectedPlace();
  const { applyFilters } = useFilter();

  // Apply active filters — only filtered markers are rendered
  const filteredCafes = cafes ? applyFilters(cafes as any) : [];
  const markerRefs = useRef<Record<string, any>>({});

  if (isLoading)
    return (
      <div className="w-full h-full flex items-center justify-center bg-surface">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-3 border-accent/30 border-t-accent rounded-full animate-spin" />
          <span className="text-sm text-muted font-medium">Memuat peta...</span>
        </div>
      </div>
    );

  if (isError)
    return (
      <div className="w-full h-full flex items-center justify-center bg-surface">
        <div className="flex flex-col items-center gap-2 text-center px-6">
          <span className="text-3xl">⚠️</span>
          <p className="text-sm text-red-500 font-medium">Gagal memuat data.</p>
          <p className="text-xs text-muted">Silakan coba lagi nanti</p>
        </div>
      </div>
    );

  // Hitung radius dari titik
  const RADIUS = 500; // meter

  // Filter masjid
  const nearbyMosques = (mosques || []).filter((m: any) => {
    if (!selectedPlace || !selectedPlace.position) return false;
    if (!m.position) return false;

    return (
      getDistance(
        selectedPlace.position as [number, number],
        m.position as [number, number],
      ) <= RADIUS
    );
  });

  // Filter cafe di luar radius saat selectedMarker aktif
  const nearbyCafes = filteredCafes.filter((m: any) => {
    if (!selectedPlace || !selectedPlace.position) return true;
    if (!m.position) return false;

    return (
      getDistance(
        selectedPlace.position as [number, number],
        m.position as [number, number],
      ) <= RADIUS
    );
  });

  return (
    <MapContainer
      center={[-7.2575, 112.7521]}
      zoom={13}
      style={{ height: "100%", width: "100%" }}
      zoomControl={false}
    >
      {/* untuk handle click di luar marker (menjadikan null) */}
      <MapClickHandler setSelectedPlace={setSelectedPlace} />
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {(nearbyCafes || []).map((cafe: any) => (
        <CafeMarker
          key={`cafe-${cafe.id}`}
          cafe={cafe}
          isSelected={selectedPlace?.id === cafe.id}
          setSelectedPlace={setSelectedPlace}
          markerRefs={markerRefs}
        />
      ))}

      {selectedPlace && selectedPlace.position && (
        <Circle
          center={selectedPlace.position as [number, number]}
          radius={RADIUS}
        />
      )}

      {selectedPlace &&
        (nearbyMosques || []).map((mosque: any) => (
          <MosqueMarker key={`mosque-${mosque.id}`} mosque={mosque} />
        ))}
    </MapContainer>
  );
}
