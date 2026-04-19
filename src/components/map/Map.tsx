"use client";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { usePlaces } from "@/src/hooks/UsePlace";
import "leaflet/dist/leaflet.css";

// Perbaikan icon default Leaflet untuk Next.js
const defaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

export default function Map() {
  const { data: places, isLoading, isError } = usePlaces();

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

      {places?.map((place: any) => (
        <Marker
          eventHandlers={{
            click: (e) => {
              console.log("Marker diklik:", place.name);
            },
          }}
          key={place.id}
          position={place.position}
          icon={defaultIcon}
        >
          <Popup>
            <div className="min-w-[180px]">
              <h3 className="font-bold text-sm text-primary">{place.name}</h3>
              <p className="text-xs text-muted mt-1">📍 {place.address}</p>
              <div className="flex gap-1 flex-wrap mt-2">
                <span className="bg-accent/10 text-accent text-[10px] px-2 py-0.5 rounded-full font-medium">
                  {place.category}
                </span>
                {place.vibe_tag?.map((tag: string) => (
                  <span
                    key={tag}
                    className="bg-surface text-muted text-[10px] px-2 py-0.5 rounded-full italic"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
              <div className="text-[11px] border-t border-border mt-2 pt-2 space-y-0.5">
                <p>
                  Wi-Fi:{" "}
                  <span className="font-semibold text-primary">
                    {place.facilities?.wifi_speed}
                  </span>
                </p>
                <p>Musholla: {place.facilities?.has_musholla ? "✅" : "❌"}</p>
              </div>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
