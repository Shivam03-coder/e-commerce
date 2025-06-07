import ApiServices from "@/store/api-service";
import type { ApiResponse } from "./types/api";
import type { AddProductSchemaType } from "@/schema/product.schema";
import type { ProductImageUrlType, ProductListType } from "./types/admin";

const AdminServices = ApiServices.injectEndpoints({
  endpoints: (build) => ({
    addProducts: build.mutation<ApiResponse, AddProductSchemaType>({
      query: (prodcutData) => ({
        url: "/admin/product",
        method: "POST",
        body: prodcutData,
      }),

      invalidatesTags: [{ type: "Product", id: "LIST" }],
    }),

    deleteProducts: build.mutation<ApiResponse, { id: string }>({
      query: ({ id }) => ({
        url: `/admin/product/${id}`,
        method: "DELETE",
      }),

      invalidatesTags: [{ type: "Product", id: "LIST" }],
    }),

    getProductImageUrl: build.mutation<ProductImageUrlType, FormData>({
      query: (formData) => ({
        url: "/admin/product/url",
        method: "POST",
        body: formData,
      }),
    }),

    getProducts: build.query<ProductListType, void>({
      query: () => ({
        url: "/admin/product/details",
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

export const {
  useAddProductsMutation,
  useGetProductImageUrlMutation,
  useGetProductsQuery,
  useDeleteProductsMutation,
} = AdminServices;
