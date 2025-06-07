import ApiServices from "@/store/api-service";
import type { ApiResponse } from "./types/api";
import type { AddProductSchemaType } from "@/schema/product.schema";
import type {
  CustomerListType,
  ProductFeaturedType,
  ProductImageUrlType,
  ProductListType,
} from "./types/admin";

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

    updateProducts: build.mutation<
      ApiResponse,
      { productId: number; product: AddProductSchemaType }
    >({
      query: ({ product, productId }) => ({
        url: `/admin/product/${productId}`,
        method: "PATCH",
        body: product,
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

    getCustomerList: build.query<CustomerListType, void>({
      query: () => ({
        url: "/admin/customer/details",
        method: "GET",
      }),
      providesTags: [{ type: "Customer", id: "LIST" }],
    }),

    deleteCustomer: build.mutation<ApiResponse, { id: string }>({
      query: ({ id }) => ({
        url: `/admin/customer/${id}`,
        method: "DELETE",
      }),

      invalidatesTags: [{ type: "Customer", id: "LIST" }],
    }),

    createFeaturedPoster: build.mutation<ApiResponse, { imageUrl: string }>({
      query: ({ imageUrl }) => ({
        url: "/admin/featured/product",
        method: "POST",
        body: imageUrl,
      }),
      invalidatesTags: [{ type: "Featured", id: "LIST" }],
    }),

    getFeaturedProduct: build.query<ProductFeaturedType, void>({
      query: () => ({
        url: "/admin/featured/product",
        method: "GET",
      }),
      providesTags: [{ type: "Featured", id: "LIST" }],
    }),

    deleteFeaturedProduct: build.mutation<ApiResponse, { id: string }>({
      query: ({ id }) => ({
        url: `/featured/product/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Featured", id: "LIST" }],
    }),
  }),
});

export const {
  useAddProductsMutation,
  useGetProductImageUrlMutation,
  useGetProductsQuery,
  useDeleteProductsMutation,
  useUpdateProductsMutation,
  useGetCustomerListQuery,
  useDeleteCustomerMutation,
  useCreateFeaturedPosterMutation,
  useDeleteFeaturedProductMutation,
  useGetFeaturedProductQuery,
} = AdminServices;
