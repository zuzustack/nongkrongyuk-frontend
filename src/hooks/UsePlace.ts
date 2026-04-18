import { useQuery } from "@tanstack/react-query";
import { fetchPlaces } from "@/src/services/PlaceService";

export function usePlaces() {
  return useQuery({
    queryKey: ["places"],
    queryFn: fetchPlaces,
  });
}