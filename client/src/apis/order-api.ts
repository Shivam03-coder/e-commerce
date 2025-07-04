import ApiServices from "@/store/api-service";
import type { ApiResponse } from "./types/api";
import type { AddCartResponse } from "./types/order";
import type { PaymentVerification } from "@/types/global";

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
    verifyPayment: build.mutation<ApiResponse, PaymentVerification>({
      query: (payload) => ({
        url: `/orders/verify`,
        method: "POST",
        body: payload,
      }),
    }),
  }),
});

export const { useCreateOrderMutation, useVerifyPaymentMutation } =
  OrderServices;
