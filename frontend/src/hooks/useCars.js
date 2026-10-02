
import { QueryClient, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import client from "../api/client";

export function useCars() {
  return useQuery({
    queryKey: ["cars"],
    queryFn: async () => {
      const { data } = await client.get("/cars/mine");
      console.log("datamut",data);
      
      return data; // <-- this is important
    },
  });
}

export function useCreateCar() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload) => client.post("/cars/", payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cars"] })
    }
  })
}

export function useDeleteCar() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (carId) => client.delete(`/cars/${carId}`),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["cars"],
      });
    },
  });
}