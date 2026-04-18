import { collection, getDocs } from "firebase/firestore";
import { db } from "@/src/services/FirebaseService";

export const fetchPlaces = async () => {
  const querySnapshot = await getDocs(collection(db, "places"));
  return querySnapshot.docs.map(doc => {
    const data = doc.data();
    return {
        id: doc.id,
        name: data.name || "Unknown Location",
        address: data.address || "",
        category: data.category || "General",
        price_level: data.price_level ?? 0,
        
        // 1. Konversi GeoPoint ke Array [lat, lng]
        position: data.location 
          ? [data.location.latitude, data.location.longitude] 
          : [-7.2575, 112.7521], // fallback ke Surabaya jika kosong
        
        // 2. Konversi Firebase Timestamp ke ISO String / Date
        last_updated: data.last_updated?.toDate().toISOString() || new Date().toISOString(),

        // 3. Map & Array tetap dipertahankan
        facilities: {
          has_musholla: data.facilities?.has_musholla ?? false,
          has_power_outlets: data.facilities?.has_power_outlets ?? false,
          wifi_speed: data.facilities?.wifi_speed || "None"
        },
        vibe_tag: data.vibe_tag || []
      };
  });
};