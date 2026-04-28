"use client";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import { usePlaces } from "@/src/hooks/UsePlace";
import { useSelectedPlace } from "@/src/providers/SelectedPlaceProvider";
import { useFilter } from "@/src/providers/FilterProvider";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Perbaikan icon default Leaflet untuk Next.js
const defaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

// Icon aktif saat marker dipilih
const activeIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [30, 49],
  iconAnchor: [15, 49],
  className: "marker-selected",
});

export default function Map() {
  const { data: places, isLoading, isError } = usePlaces();
  const { selectedPlace, setSelectedPlace } = useSelectedPlace();
  const { applyFilters } = useFilter();

  // Apply active filters — only filtered markers are rendered
  const visiblePlaces = places ? applyFilters(places as any) : [];

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

  return (
    <MapContainer
      center={[-7.2575, 112.7521]}
      zoom={13}
      style={{ height: "100%", width: "100%" }}
      zoomControl={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {visiblePlaces.map((place: any) => {
        const isSelected = selectedPlace?.id === place.id;
        return (
          <Marker
            key={place.id}
            position={place.position}
            icon={isSelected ? activeIcon : defaultIcon}
            eventHandlers={{
              click: () => {
                setSelectedPlace(place);
              },
            }}
          />
        );
      })}
    </MapContainer>
  );
}
