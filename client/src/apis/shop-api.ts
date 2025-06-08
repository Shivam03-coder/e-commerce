import ApiServices from "@/store/api-service";
import type { ProductListType } from "./types/admin";

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
  }),
});

export const { useGetProductDetailsQuery } = ShopServices;
