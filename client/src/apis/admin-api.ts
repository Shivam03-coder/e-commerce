import ApiServices from "@/store/api-service";
import type { ApiResponse } from "./types/api";
import type { AddProductSchemaType } from "@/schema/product.schema";
import type {
  CustomerListType,
  OrdersListType,
  ProductFeaturedType,
  ProductImageUrlType,
  ProductListType,
} from "./types/admin";

const AdminServices = ApiServices.injectEndpoints({
  endpoints: (build) => ({
    addProducts: build.mutation<ApiResponse, AddProductSchemaType>({
      query: (productData) => ({
        url: "/admin/product",
        method: "POST",
        body: productData,
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
      invalidatesTags: (_result, _error, { productId }) => [
        { type: "Product", id: productId },
      ],
    }),

    deleteProducts: build.mutation<ApiResponse, { id: string }>({
      query: ({ id }) => ({
        url: `/admin/product/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Product", id },
        { type: "Product", id: "LIST" },
      ],
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
      providesTags: (result) =>
        result
          ? [
              ...result.result.products.map((product) => ({
                type: "Product" as const,
                id: product.id,
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

    createFeaturedProduct: build.mutation<
      ApiResponse,
      { featuredProductImage: string }
    >({
      query: ({ featuredProductImage }) => ({
        url: "/admin/featured/product",
        method: "POST",
        body: { featuredProductImage },
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
        url: `/admin/featured/product/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Featured", id: "LIST" }],
    }),

    getOrdersDetails: build.query<OrdersListType, void>({
      query: () => ({
        url: "/admin/orders/details",
        method: "GET",
      }),
      providesTags: [{ type: "Orders", id: "LIST" }],
    }),
  }),
});

export const {
  useAddProductsMutation,
  useUpdateProductsMutation,
  useDeleteProductsMutation,
  useGetProductImageUrlMutation,
  useGetProductsQuery,
  useGetCustomerListQuery,
  useDeleteCustomerMutation,
  useCreateFeaturedProductMutation,
  useGetFeaturedProductQuery,
  useDeleteFeaturedProductMutation,
  useGetOrdersDetailsQuery,
} = AdminServices;
