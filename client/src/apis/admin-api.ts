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
    }),

    getProductImageUrl: build.mutation<ProductImageUrlType, FormData>({
      query: (formData) => ({
        url: "/admin/product/url",
        method: "POST",
        body: formData,
      }),
    }),

    getProducts: build.mutation<ProductListType, void>({
      query: () => ({
        url: "/admin/product",
        method: "POST",
      }),
    }),
  }),
});

export const {
  useAddProductsMutation,
  useGetProductImageUrlMutation,
  useGetProductsMutation,
} = AdminServices;
