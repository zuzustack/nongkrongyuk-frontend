import { useQuery } from "@tanstack/react-query";
import { fetchPlaces } from "@/src/services/PlaceService";

export function useCafes() {
  return useQuery({
    queryKey: ["cafes"],
    queryFn: fetchPlaces,
  });
}