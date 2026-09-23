import { QueryClient, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import client from "../api/client";


export function useMeet({ page = 1, limit = 10 } = {}) {
  return useQuery({
    queryKey: ["meets", { page, limit }],
    queryFn: async () => {
      const { data } = await client.get("/meets", {
        params: {
          page,
          limit,
        },
      });

      return data;
    },
  });
}

export function useMeetDetail(meetId) {
  return useQuery({
    queryKey: ["meets", meetId],
    queryFn: async () => {
      const res = await client.get(`/meets/${meetId}`, { withCredentials: true });
      return res.data;
    },
    enabled: !!meetId,
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

export function useUpload (){
  return useMutation({
    mutationFn: (metaData) =>  client.post("/upload/request-url",metaData),
  })
}

// export function useCars() {
//   return useQuery({
//     queryKey: ["cars"],
//     queryFn: () => client.get("/cars/mine")
//   })
// }

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