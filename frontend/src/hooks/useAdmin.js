import { QueryClient, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import client from "../api/client";

export function useDashboardStats (){
    return useQuery({
    queryKey: ['admin', 'dashboard'],
    queryFn: async () => {
      const res = await client.get('/admin/dashboard/stats');
      return res.data;
    },
  });
}

export function useHostsList(params = {}) {
  return useQuery({
    queryKey: ['admin', 'hosts', params],
    queryFn: async () => {
      const res = await client.get('/admin/hosts', { params });
      return res.data;
    },
  });
}

// export function useApproveHost() {
//   const queryClient = useQueryClient();
//   return useMutation({
//     mutationFn: async (input) => {
//       const res = await client.post('/admin/hosts/approve', input);
//       return res.data;
//     },
//     onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'hosts'] }),
//   });
// }



export function useUsersList(params = {}) {
  console.log("params", params);
  return useQuery({
    queryKey: ['user', params],
    queryFn: async () => {
      const res = await client.get('/users', { params });
        console.log(res, "--res");
      return res.data;
    },
  });
}

export function useApproveHost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input) => {
      const res = await client.post("/admin/hosts/approve", input);
      return res.data;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["user"],
      });
      queryClient.invalidateQueries({
        queryKey: ["admin", "hosts"],
      });
    },
  });
}