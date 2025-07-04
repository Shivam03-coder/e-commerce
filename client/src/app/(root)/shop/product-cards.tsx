"use client";
import React from "react";
import { ShoppingCart, Star, Heart } from "lucide-react";
import type { ProductsDataType } from "@/types/global";
import {
  useToggleFavoriteMutation,
  useUserFavoritesQuery,
} from "@/apis/shop-api";
import { useAppToasts } from "@/hooks/use-app-toast";
import { Link, useTransitionRouter } from "next-view-transitions";
import useAppLinks from "@/navigations";

interface ProductCardProps {
  product: ProductsDataType;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const hasDiscount = product.price !== product.salePrice;
  const router = useTransitionRouter();
  const discountPercentage = hasDiscount
    ? Math.round(((product.price - product.salePrice!) / product.price) * 100)
    : 0;

  const [addToFavourite] = useToggleFavoriteMutation();
  const { data: favorites } = useUserFavoritesQuery(null) ?? [];
  const { ErrorToast, SuccessToast } = useAppToasts();
  const links = useAppLinks();

  const isFavorite =
    favorites?.result.some((fav) => fav.product.id === product.id) || false;

  const handleNavigate = (id: number) => {
    router.push(`${links.shop}/${id}`);
  };

  const toggleWishlist = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const res = await addToFavourite({ productId: product.id }).unwrap();
      SuccessToast({
        title: res.message,
      });
    } catch (error) {
      ErrorToast({
        title: "Failed to update favorites",
        description: "There was an error while updating your favorites",
      });
      console.log("Error updating favorites:", error);
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "ANKLE_SOCKS":
        return "bg-blue-100 text-blue-800";
      case "NO_SHOW_SOCKS":
        return "bg-green-100 text-green-800";
      case "HALF_SOCKS":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };
  return (
    <div className="group relative overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:shadow-lg">
      {/* Wishlist Button */}
      <button
        onClick={toggleWishlist}
        className="absolute top-3 right-3 z-10 rounded-full bg-white/80 p-2 backdrop-blur-sm transition hover:scale-110"
        aria-label="Add to wishlist"
      >
        <Heart
          className={`h-5 w-5 ${isFavorite ? "fill-red-500 text-red-500" : "text-gray-400"}`}
        />
      </button>
      {/* Discount Badge */}
      {hasDiscount && (
        <div className="absolute top-3 left-3 z-10 rounded-full bg-gradient-to-r from-red-500 to-pink-500 px-3 py-1 text-xs font-bold text-white shadow-md">
          -{discountPercentage}%
        </div>
      )}

      {/* Image Section */}
      <div
        onClick={() => handleNavigate(product.id)}
        className="relative aspect-square overflow-hidden"
      >
        <img
          src={product.productImage}
          alt={product.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        {!product.inStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
            <span className="rounded-lg bg-white/90 px-3 py-1 text-sm font-semibold text-gray-900 backdrop-blur-sm">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-4">
        {/* Category */}
        <div className="mb-1">
          <span
            className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${getCategoryColor(product.category)}`}
          >
            {product.category.replace("_", " ")}
          </span>
        </div>

        {/* Title */}
        <h3
          onClick={() => handleNavigate(product.id)}
          className="mb-1 line-clamp-2 text-lg font-semibold text-gray-900 transition-colors hover:text-blue-600"
        >
          {product.title}
        </h3>

        {/* Rating */}
        <div className="mb-2 flex items-center gap-1">
          <div className="flex text-yellow-400">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${i < 4 ? "fill-current" : ""}`} // Assuming 4-star rating
              />
            ))}
          </div>
          <span className="text-xs text-gray-500">
            ({product._count?.Review || 0})
          </span>
        </div>

        {/* Price */}
        <div className="mb-3 flex items-center gap-2">
          <span className="text-xl font-bold text-gray-900">
            ₹{product.salePrice!}
          </span>
          {hasDiscount && (
            <span className="text-sm text-gray-500 line-through">
              ₹{product.price}
            </span>
          )}
        </div>

        {/* Sizes */}
        <div className="mb-4">
          <p className="mb-1 text-xs font-medium text-gray-500">
            Available Sizes
          </p>
          <div className="flex flex-wrap gap-1">
            {product.sizeStocks
              .filter((size) => size.stock > 0)
              .map((size) => (
                <span
                  key={size.size}
                  className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                    size.stock < 5
                      ? "bg-amber-100 text-amber-800"
                      : "bg-green-100 text-green-800"
                  }`}
                >
                  {size.size.split("_").join("-")}
                </span>
              ))}
          </div>
        </div>

        {/* Stock Progress */}
        <div className="mb-4">
          <div className="mb-1 flex justify-between text-xs">
            <span className="text-gray-500">Available</span>
            <span className="font-medium text-gray-700">
              {product.inventory} left
            </span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-200">
            <div
              className={`h-full ${
                product.inventory > 50
                  ? "bg-green-500"
                  : product.inventory > 20
                    ? "bg-amber-500"
                    : "bg-red-500"
              }`}
              style={{
                width: `${Math.min((product.inventory / 100) * 100, 100)}%`,
              }}
            ></div>
          </div>
        </div>

        <Link
          href={`${links.shop}/${product.id}`}
          className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-green-300 px-4 py-2 font-medium text-black shadow-md transition-all hover:shadow-lg"
          onClick={(e) => e.stopPropagation()}
        >
          <ShoppingCart className="h-4 w-4" />
          View Product
        </Link>
      </div>
    </div>
  );
};

export default ProductCard;
