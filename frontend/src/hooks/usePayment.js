import client from "../api/client";
import { useMutation } from "@tanstack/react-query";

// export function usePayment() {
//     return useMutation({
//         mutationFn: (payload) => client.post("/payments/createOrder", payload),
//     });
// }

export function usePayment() {
    return useMutation({
        mutationFn: (payload) =>
            client.post("/payments/createOrder", payload),
    });
}

export function useVerifyPayment() {
    return useMutation({
        mutationFn: (payload) =>
            client.post("/payments/verify", payload),
    });
}