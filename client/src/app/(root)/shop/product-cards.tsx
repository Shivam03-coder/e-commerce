"use client";
import React from "react";
import { ShoppingCart, Star, Package } from "lucide-react";
import type { ProductsDataType } from "@/types/global";
import { useAddToCartMutation } from "@/apis/shop-api";
import { useAppToasts } from "@/hooks/use-app-toast";
import { Button } from "@/components/ui/button";
import Spinner from "@/components/global/spinner";
import { useTransitionRouter } from "next-view-transitions";
import useAppLinks from "@/navigations";

interface ProductCardProps {
  product: ProductsDataType;
}
const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const parsedTags = JSON.parse(product.tags as string);
  const hasDiscount = product.price !== product.salePrice;
  const router = useTransitionRouter();
  const discountPercentage = hasDiscount
    ? Math.round(((product.price - product.salePrice!) / product.price) * 100)
    : 0;

  const [addToCart, { isLoading }] = useAddToCartMutation();
  const { ErrorToast, SuccessToast } = useAppToasts();
  const links = useAppLinks();
  const handleAddToCart = async (productId: string, quantity: string) => {
    try {
      const resp = await addToCart({ productId, quantity }).unwrap();
      SuccessToast({
        title: "Item added to cart",
        description:
          "The product has been successfully added to your shopping cart",
      });
    } catch (error) {
      ErrorToast({
        title: "Failed to add item to cart",
        description: "There was an error while adding the product to your cart",
      });
      console.log("Error adding to cart:", error);
      throw error;
    }
  };

  const handleNaviagte = (id: number) => {
    router.push(`${links.shop}/${id}`);
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

  const getTagColor = (tag: string) => {
    switch (tag.toLowerCase()) {
      case "best":
        return "bg-red-100 text-red-700";
      case "new":
        return "bg-emerald-100 text-emerald-700";
      case "bamboo":
        return "bg-amber-100 text-amber-700";
      case "cotton":
        return "bg-indigo-100 text-indigo-700";
      case "amazing":
        return "bg-pink-100 text-pink-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="group bg-background overflow-hidden rounded-xl border border-gray-100 shadow-md transition-all duration-300 hover:shadow-xl">
      {/* Image Section */}
      <div className="relative overflow-hidden">
        <img
          src={product.productImage}
          alt={product.title}
          className="h-64 w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {hasDiscount && (
          <div className="absolute top-3 left-3 rounded-full bg-red-500 px-2 py-1 text-sm font-semibold text-white">
            -{discountPercentage}%
          </div>
        )}
        {!product.inStock && (
          <div className="bg-opacity-50 absolute inset-0 flex items-center justify-center bg-black">
            <span className="text-lg font-semibold text-white">
              Out of Stock
            </span>
          </div>
        )}
        <div className="absolute top-3 right-3">
          <span
            className={`rounded-full px-2 py-1 text-xs font-medium ${getCategoryColor(product.category)}`}
          >
            {product.category.replace("_", " ")}
          </span>
        </div>
      </div>

      {/* Content Section */}
      <div
        onClick={() => handleNaviagte(parseInt(product.id))}
        className="cursor-pointer p-5"
      >
        {/* Title */}
        <h3 className="mb-2 line-clamp-2 text-lg font-semibold text-gray-900">
          {product.title}
        </h3>

        {/* Description */}
        <p className="mb-3 line-clamp-2 text-sm text-gray-600">
          {product.description}
        </p>

        {/* Tags */}
        <div className="mb-3 flex flex-wrap gap-1">
          {parsedTags.slice(0, 3).map((tag: string, index: number) => (
            <span
              key={index}
              className={`rounded-full px-2 py-1 text-xs font-medium ${getTagColor(tag)}`}
            >
              {tag}
            </span>
          ))}
          {parsedTags.length > 3 && (
            <span className="rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-700">
              +{parsedTags.length - 3}
            </span>
          )}
        </div>

        {/* Product Details */}
        <div className="mb-3 flex items-center gap-4 text-sm text-gray-500">
          <div className="flex items-center gap-1">
            <Package className="h-4 w-4" />
            <span>{product.material}</span>
          </div>
          <div>Size: {product.size.replace("_", "-")}</div>
        </div>

        {/* Price Section */}
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-gray-900">
              ₹ {product.salePrice!}
            </span>
            {hasDiscount && (
              <span className="text-lg text-gray-500 line-through">
                ₹ {product.price}
              </span>
            )}
          </div>
          <div className="flex items-center gap-1 text-yellow-500">
            <Star className="h-4 w-4 fill-current" />
            <span className="text-sm text-gray-600">
              ({product._count.Review})
            </span>
          </div>
        </div>

        {/* Stock Info */}
        <div className="mb-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Stock</span>
            <span
              className={`font-medium ${product.inventory > 50 ? "text-green-600" : product.inventory > 20 ? "text-yellow-600" : "text-red-600"}`}
            >
              {product.inventory} left
            </span>
          </div>
          <div className="mt-1 h-2 w-full rounded-full bg-gray-200">
            <div
              className={`h-2 rounded-full ${product.inventory > 50 ? "bg-green-500" : product.inventory > 20 ? "bg-yellow-500" : "bg-red-500"}`}
              style={{
                width: `${Math.min((product.inventory / 200) * 100, 100)}%`,
              }}
            ></div>
          </div>
        </div>

        {/* Add to Cart Button */}
        <Button
          disabled={!product.inStock || isLoading}
          onClick={(e) => {
            e.stopPropagation();
            handleAddToCart(product.id, "1");
          }}
          className="bg-primary/70 hover:bg-primary flex w-full items-center justify-center gap-2 rounded-lg px-4 py-3 font-medium text-black transition-colors duration-200 disabled:cursor-not-allowed disabled:bg-gray-400"
        >
          {isLoading ? (
            <Spinner />
          ) : (
            <>
              <ShoppingCart className="h-5 w-5" />
              {product.inStock ? "Add to Cart" : "Out of Stock"}
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default ProductCard;
