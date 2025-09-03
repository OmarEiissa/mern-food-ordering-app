import type { Restaurant } from "@/types";
import { useAuth0 } from "@auth0/auth0-react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const useGetRestaurant = () => {
  const { getAccessTokenSilently } = useAuth0();

  const getRestaurantRequest = async (): Promise<Restaurant> => {
    const accessToken = await getAccessTokenSilently();

    const response = await fetch(`${API_BASE_URL}/api/my/restaurant`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch restaurant");
    }

    return response.json();
  };

  const { data: restaurant, isPending: isLoading } = useQuery({
    queryKey: ["fetchMyRestaurant"],
    queryFn: getRestaurantRequest,
  });

  return { restaurant, isLoading };
};

export const useCreateRestaurant = () => {
  const { getAccessTokenSilently } = useAuth0();

  const createRestaurantRequest = async (
    restaurantFormData: FormData
  ): Promise<Restaurant[]> => {
    const accessToken = await getAccessTokenSilently();

    const response = await fetch(`${API_BASE_URL}/api/my/restaurant`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body: restaurantFormData,
    });

    if (!response.ok) {
      throw new Error(
        response.status === 409
          ? "Restaurant already exists"
          : "Failed to create restaurant"
      );
    }

    return response.json();
  };

  const {
    mutate: createRestaurant,
    isPending: isLoading,
    isSuccess,
    error,
  } = useMutation({
    mutationFn: createRestaurantRequest,
  });

  if (isSuccess) {
    toast.success("Restaurant created successfully!");
  }

  if (error) {
    toast.error((error as Error).message);
  }

  return {
    createRestaurant,
    isLoading,
  };
};

export const useUpdateRestaurant = () => {
  const { getAccessTokenSilently } = useAuth0();

  const updateRestaurantRequest = async (
    restaurantFormData: FormData
  ): Promise<Restaurant> => {
    const accessToken = await getAccessTokenSilently();

    const response = await fetch(`${API_BASE_URL}/api/my/restaurant`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body: restaurantFormData,
    });

    if (!response.ok) {
      throw new Error("Failed to update restaurant");
    }

    return response.json();
  };

  const {
    mutate: updateRestaurant,
    isPending: isLoading,
    isSuccess,
    error,
  } = useMutation({
    mutationFn: updateRestaurantRequest,
  });

  if (isSuccess) {
    toast.success("Restaurant updated successfully!");
  }

  if (error) {
    toast.error((error as Error).message);
  }

  return {
    updateRestaurant,
    isLoading,
  };
};
