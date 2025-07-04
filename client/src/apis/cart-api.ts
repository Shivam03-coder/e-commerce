// carts-service.ts
import ApiServices from "@/store/api-service";
import type { ApiResponse } from "./types/api";
import type { AddCartItemTypeRes, CartsItemTypeRes } from "./types/cart";
import type { AddCartItemType, SockSize } from "@/types/global";

export const CartsServices = ApiServices.injectEndpoints({
  endpoints: (build) => ({
    getCartsItems: build.query<CartsItemTypeRes, void>({
      query: () => ({
        url: "/cart/details",
        method: "GET",
      }),
      providesTags: (result) =>
        result?.result
          ? [
              ...result.result.map((item) => ({
                type: "Carts" as const,
                id: item.productId,
              })),
              { type: "Carts", id: "LIST" },
            ]
          : [{ type: "Carts", id: "LIST" }],
    }),

    increaseCartsItem: build.mutation<ApiResponse, { productId: string }>({
      query: ({ productId }) => ({
        url: `/cart/increase/${productId}`,
        method: "POST",
      }),
      invalidatesTags: (_, __, { productId }) => [
        { type: "Carts", id: productId },
        { type: "Carts", id: "LIST" },
        { type: "UserInfo" },
      ],
    }),

    removeCartsItem: build.mutation<ApiResponse, { productId: string }>({
      query: ({ productId }) => ({
        url: `/cart/remove/${productId}`,
        method: "POST",
      }),
      invalidatesTags: (_, __, { productId }) => [
        { type: "Carts", id: productId },
        { type: "Carts", id: "LIST" },
        { type: "UserInfo" },
      ],
    }),

    addToCart: build.mutation<
      AddCartItemTypeRes,
      { productId: string; orders: Array<{ size: SockSize; quantity: number }> }
    >({
      query: ({ productId, orders }) => ({
        url: `/cart/add`,
        method: "POST",
        body: {
          productId,
          orders,
        },
      }),
      invalidatesTags: (_res, _err, { productId }) => [
        { type: "Carts", id: "LIST" },
        { type: "UserInfo" },
        { type: "Product", id: productId },
      ],
    }),
  }),
});

export const {
  useGetCartsItemsQuery,
  useIncreaseCartsItemMutation,
  useRemoveCartsItemMutation,
  useAddToCartMutation,
} = CartsServices;
