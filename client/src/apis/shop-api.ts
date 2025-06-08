import ApiServices from "@/store/api-service";
import type { ProductListType } from "./types/admin";
import type { ApiResponse } from "./types/api";

const ShopServices = ApiServices.injectEndpoints({
  endpoints: (build) => ({
    getProductDetails: build.query<ProductListType, void>({
      query: () => ({
        url: "/shop/product/details",
        method: "GET",
      }),
      providesTags: (res) =>
        res
          ? [
              ...res.result.products.map(({ id }) => ({
                type: "Product" as const,
                id,
              })),
              { type: "Product", id: "LIST" },
            ]
          : [{ type: "Product", id: "LIST" }],
    }),

    // addToCart: build.mutation<
    //   ApiResponse,
    //   { productId: string; quantity: string }
    // >({
    //   query: () => ({
    //     url: "/shop/product/cart",
    //     method: "POST",
    //   }),
    // }),
  }),
});

export const { useGetProductDetailsQuery } = ShopServices;
