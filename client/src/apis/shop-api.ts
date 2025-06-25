import ApiServices from "@/store/api-service";
import type { ProductListType, ProductType } from "./types/admin";
import type { ApiResponse } from "./types/api";
import type { ReviewListItemType } from "./types/shop";

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

    getProductDetailsById: build.query<ProductType, { productId: number }>({
      query: ({ productId }) => ({
        url: `/shop/product/details/${productId}`,
        method: "GET",
      }),
      providesTags: [{ type: "Product", id: "LIST" }],
    }),

    addToCart: build.mutation<
      ApiResponse,
      { productId: string; quantity: string }
    >({
      query: ({ productId, quantity }) => ({
        url: `/shop/product/cart?productId=${productId}&quantity=${quantity}`,
        method: "POST",
      }),
      invalidatesTags: () => [
        { type: "Carts", id: "LIST" },
        { type: "Product", id: "LIST" },
      ],
    }),

    addReview: build.mutation<
      ApiResponse,
      { productId: number; message: string; stars: number }
    >({
      query: ({ productId, message, stars }) => ({
        url: `/shop/product/review/${productId}`,
        method: "POST",
        body: {
          message,
          stars,
        },
      }),
      invalidatesTags: [{ type: "Review", id: "LIST" }],
    }),

    getReview: build.query<ReviewListItemType, { productId: number }>({
      query: ({ productId }) => ({
        url: `/shop/product/review/${productId}`,
        method: "GET",
      }),
      providesTags: [{ type: "Review", id: "LIST" }],
    }),

    userFavorites: build.query<ReviewListItemType, { productId: number }>({
      query: ({ productId }) => ({
        url: `/shop/product/review/${productId}`,
        method: "GET",
      }),
      providesTags: [{ type: "Review", id: "LIST" }],
    }),
    
    toggleFavorite: build.mutation<ApiResponse, { productId: number }>({
      query: ({ productId }) => ({
        url: `/shop/favourite/${productId}`,
        method: "POST",
      }),
      invalidatesTags: (_result, _error, { productId }) => [
        { type: "Product", id: productId },
      ],
    }),
  }),
});

export const {
  useGetProductDetailsQuery,
  useAddToCartMutation,
  useGetProductDetailsByIdQuery,
  useAddReviewMutation,
  useGetReviewQuery,
} = ShopServices;
