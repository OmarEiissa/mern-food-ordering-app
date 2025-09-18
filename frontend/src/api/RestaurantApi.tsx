import type { SearchState } from "@/pages/SearchPage";
import type { RestaurantSearchResponse } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const useSearchRestaurants = (
  searchState: SearchState,
  cityOrCountry?: string
) => {
  const createSearchRequest = async (): Promise<RestaurantSearchResponse> => {
    const params = new URLSearchParams();
    params.set("searchQuery", searchState.searchQuery);
    params.set("page", searchState.page.toString());
    params.set("selectedCuisines", searchState.selectedCuisines.join(","));
    params.set("sortOption", searchState.sortOption);

    const response = await fetch(
      `${API_BASE_URL}/api/restaurant/search/${cityOrCountry}?${params.toString()}`
    );

    if (response.status === 404) {
      return response.json();
    }

    if (!response.ok) {
      toast.error("Failed to fetch restaurants");
      throw new Error("Failed to fetch restaurants");
    }

    return response.json();
  };

  const { data: results, isPending: isLoading } = useQuery({
    queryKey: ["searchRestaurants", searchState],
    queryFn: createSearchRequest,
    enabled: !!cityOrCountry,
  });

  return { results, isLoading };
};
