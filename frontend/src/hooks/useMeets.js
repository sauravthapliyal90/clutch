import {
    useMutation,
    useQuery,
    useQueryClient,
} from "@tanstack/react-query";

import client from "../api/client";

export function useMeet({ page = 1, limit = 10 } = {}) {
    console.log("useMeet called with page:", page, "limit:", limit);
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
        queryKey: ["meet", meetId],

        queryFn: async () => {
            const res = await client.get(`/meets/${meetId}`, {
                withCredentials: true,
            });
        
            return res.data;
        },

        enabled: !!meetId,
    });
}

export function useUpload() {
    return useMutation({
        mutationFn: (metaData) =>
            client.post("/upload/request-url", metaData),
    });
}

export function useCreateMeet() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload) =>
            client.post("/meets", payload),

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["meets","hostMeets"],
            });
        },
    });
}

// export function useUpdateMeet() {
//     const queryClient = useQueryClient();
//     console.log("useUpdateMeet called");

//     return useMutation({
//         mutationFn: async({ id, payload }) =>{
//             console.log("id,pay",id, payload);
//             const data = await client.patch(`/meets/${id}`, payload);
//             console.log("PATCH SUCCESS", data);
//             return data;
//         },
//         onSuccess: () => {
//             queryClient.invalidateQueries({
//                 queryKey: ["meets"],
//             });
//         },
//     });
// }

export function useUpdateMeet() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, payload }) => {
      console.log("PATCH START");
      console.log("id:", id);
      console.log("payload:", payload);

      const response = await client.patch(
        `/meets/${id}`,
        payload
      );

      console.log("PATCH SUCCESS:", response);

      return response.data;
    },

    onSuccess: (data) => {
      console.log("UPDATE SUCCESS:", data);

      queryClient.invalidateQueries({
        queryKey: ["meets"],
      });
    },

    onError: (error) => {
      console.error("UPDATE ERROR:", error);
    },
  });
}

export function useResgistration(){
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id) => client.post(`/meets/${id}/register`),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["meet",]
            })
        }
    })
}


export function useDeleteMeet() {
    const queryClient = useQueryClient();
console.log("useDeleteMeet called");
    return useMutation({
        mutationFn: (id) => client.delete(`/meets/${id}`),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["meets"],
            });
        },
    });
}

export function useHostMeets(hostId) {
    return useQuery({
        queryKey: ["hostMeets", hostId],
        queryFn: async () => {
            const { data } = await client.get(`/meets/host/${hostId}`);
            return data;
        },
        enabled: !!hostId,
    });
}