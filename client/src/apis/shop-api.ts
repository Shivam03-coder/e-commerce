import ApiServices from "@/store/api-service";
import type { ProductListType, ProductType } from "./types/admin";
import type { ApiResponse } from "./types/api";
import type { FavouriteListType, ReviewListItemType } from "./types/shop";

const ShopServices = ApiServices.injectEndpoints({
  endpoints: (build) => ({
    // 🔹 All products list
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

    // 🔹 Single product by ID
    getProductDetailsById: build.query<ProductType, { productId: number }>({
      query: ({ productId }) => ({
        url: `/shop/product/details/${productId}`,
        method: "GET",
      }),
      providesTags: (result, error, { productId }) => [
        { type: "Product", id: productId },
      ],
    }),

    addReview: build.mutation<
      ApiResponse,
      { productId: number; message: string; stars: number }
    >({
      query: ({ productId, message, stars }) => ({
        url: `/shop/product/review/${productId}`,
        method: "POST",
        body: { message, stars },
      }),
      invalidatesTags: (_res, _err, { productId }) => [
        { type: "Review", id: productId },
        { type: "Product", id: productId },
      ],
    }),

    // 🔹 Get reviews by product
    getReview: build.query<ReviewListItemType, { productId: number }>({
      query: ({ productId }) => ({
        url: `/shop/product/review/${productId}`,
        method: "GET",
      }),
      providesTags: (res, err, { productId }) => [
        { type: "Review", id: productId },
      ],
    }),

    // 🔹 Get all user favorites
    userFavorites: build.query<FavouriteListType, null>({
      query: () => ({
        url: `/shop/favourite`,
        method: "GET",
      }),
      providesTags: (res) =>
        res
          ? [
              ...res.result.map(({ product }) => ({
                type: "Favourite" as const,
                id: product.id,
              })),
              { type: "Favourite", id: "LIST" },
            ]
          : [{ type: "Favourite", id: "LIST" }],
    }),

    // 🔹 Toggle favorite product
    toggleFavorite: build.mutation<ApiResponse, { productId: number }>({
      query: ({ productId }) => ({
        url: `/shop/favourite/${productId}`,
        method: "POST",
      }),
      invalidatesTags: (_res, _err, { productId }) => [
        { type: "Product", id: productId },
        { type: "UserInfo" },
        { type: "Favourite", id: productId },
      ],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetProductDetailsQuery,
  useGetProductDetailsByIdQuery,
  useAddReviewMutation,
  useGetReviewQuery,
  useToggleFavoriteMutation,
  useUserFavoritesQuery,
} = ShopServices;
