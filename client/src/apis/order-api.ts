import ApiServices from "@/store/api-service";
import type { ApiResponse } from "./types/api";
import type { AddCartResponse } from "./types/order";

const OrderServices = ApiServices.injectEndpoints({
  endpoints: (build) => ({
    createOrder: build.mutation<
      AddCartResponse,
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
