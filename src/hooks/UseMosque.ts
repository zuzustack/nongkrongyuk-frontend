import { useQuery } from "@tanstack/react-query";
import { fetchMosques } from "@/src/services/PlaceService";

export function useMosques() {
  return useQuery({
    queryKey: ["mosques"],
    queryFn: fetchMosques,
  });
}