import ApiServices from "@/store/api-service";
import type { ApiResponse } from "./types/api";

const OrderServices = ApiServices.injectEndpoints({
  endpoints: (build) => ({
    createOrder: build.mutation<
      ApiResponse,
      { cartId: string; totalAmount: number }
    >({
      query: ({ cartId, totalAmount }) => ({
        url: `/orders/${cartId}`,
        method: "POST",
        body: { totalAmount },
      }),
    }),
  }),
});

export const { useCreateOrderMutation } = OrderServices;
