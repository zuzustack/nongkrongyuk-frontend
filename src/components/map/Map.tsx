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
      <div className="h-[500px] flex items-center justify-center bg-gray-100 italic">
        Memuat data tempat...
      </div>
    );
  if (isError)
    return (
      <div className="h-[500px] flex items-center justify-center text-red-500">
        Gagal memuat data.
      </div>
    );

  return (
    <MapContainer
      center={[-7.2575, 112.7521]}
      zoom={13}
      style={{ height: "600px", width: "100%", borderRadius: "12px" }}
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
            <div className="min-w-[150px]">
              <h3 className="font-bold text-lg">{place.name}</h3>
              <p className="text-sm text-gray-600 mb-1">📍 {place.address}</p>
              <div className="flex gap-1 flex-wrap mb-2">
                <span className="bg-orange-100 text-orange-700 text-[10px] px-2 py-0.5 rounded">
                  {place.category}
                </span>
                {place.vibe_tag?.map((tag: string) => (
                  <span
                    key={tag}
                    className="bg-blue-50 text-blue-600 text-[10px] px-2 py-0.5 rounded italic"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
              <div className="text-[11px] border-t pt-2">
                <p>
                  Wi-Fi:{" "}
                  <span className="font-semibold">
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
