"use client";

import { useGetProductDetailsByIdQuery } from "@/apis/shop-api";
import React, { use, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ShoppingCart } from "lucide-react";
import { useAppToasts } from "@/hooks/use-app-toast";
import Spinner from "@/components/global/spinner";
import Review from "./review";
import { Link } from "next-view-transitions";
import parseTags from "@/utils/parse-tags";
import type { SockSize } from "@/types/global";
import { useAddToCartMutation } from "@/apis/cart-api";
import { useLocalStorage } from "usehooks-ts";

interface ProductDetailsProps {
  params: Promise<{
    productid: number;
  }>;
}

const ProductDetails = ({ params }: ProductDetailsProps) => {
  const { productid } = use(params);
  const { data, isLoading, error } = useGetProductDetailsByIdQuery({
    productId: productid,
  });
  const [_, setLocalCurrentCartId] = useLocalStorage("user_cart_id", "");
  const [selectedSize, setSelectedSize] = useState<SockSize | null>(null);
  const [quantity, setQuantity] = useState(1);
  const { ErrorToast, SuccessToast } = useAppToasts();
  const [addToCart, { isLoading: isProductAddingToCart }] =
    useAddToCartMutation();

  if (isLoading)
    return (
      <div className="flex h-screen items-center justify-center">
        <Spinner />
      </div>
    );

  if (error) return <div>Error loading product</div>;
  if (!data?.result?.product) return <div>Product not found</div>;

  const product = data.result.product;
  const tags = parseTags(product.tags);

  const selectedSizeStock = selectedSize
    ? (product.sizeStocks?.find((size) => size.size === selectedSize)?.stock ??
      0)
    : (product.inventory ?? 0);

  const handleAddToCart = async () => {
    if (!product.inStock) return;
    if (product.sizeStocks?.length > 0 && !selectedSize) {
      ErrorToast({
        title: "Size not selected",
        description: "Please select a size before adding to cart",
      });
      return;
    }

    try {
      const res = await addToCart({
        productId: productid.toString(),
        orders: [
          {
            size: selectedSize as SockSize,
            quantity: quantity,
          },
        ],
      }).unwrap();

      setLocalCurrentCartId(res.result);
      SuccessToast({
        title: res.message,
      });
    } catch (error) {
      ErrorToast({
        title: "Failed to add item to cart",
        description: "There was an error while adding the product to your cart",
      });
      console.error("Error adding to cart:", error);
    }
  };

  const handleQuantityChange = (newQuantity: number) => {
    // Ensure quantity is at least 1 and doesn't exceed available stock
    const validatedQuantity = Math.max(
      1,
      Math.min(newQuantity, selectedSizeStock),
    );
    setQuantity(validatedQuantity);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back Button */}
      <Button asChild variant="ghost" className="my-5 gap-2 bg-green-200">
        <Link href="/shop">
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Shop</span>
        </Link>
      </Button>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        {/* Product Image */}
        <div className="overflow-hidden rounded-lg bg-white">
          <Image
            src={product.productImage}
            alt={product.title}
            width={600}
            height={600}
            className="h-auto w-full object-cover"
            priority
          />
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <h1 className="text-3xl font-bold">{product.title}</h1>

          {/* Price */}
          <div className="flex items-center gap-4">
            <span className="text-2xl font-semibold">${product.salePrice}</span>
            {product.salePrice! < product.price && (
              <span className="text-lg text-gray-500 line-through">
                ${product.price}
              </span>
            )}
          </div>

          {/* Stock Status */}
          <div className="flex items-center gap-2">
            <span
              className={`inline-block h-3 w-3 rounded-full ${
                product.inStock ? "bg-green-500" : "bg-red-500"
              }`}
            ></span>
            <span>{product.inStock ? "In Stock" : "Out of Stock"}</span>
            {product.inStock && (
              <span>
                (
                {selectedSize
                  ? `${selectedSizeStock} available in ${selectedSize.replace(/_/g, " ")}`
                  : `${product.inventory ?? 0} available`}
                )
              </span>
            )}
          </div>

          {/* Description */}
          <p className="text-gray-700">{product.description}</p>

          {/* Details */}
          <div className="space-y-2">
            <h3 className="font-semibold">Details:</h3>
            <ul className="space-y-1">
              <li>
                <strong>Category:</strong>{" "}
                {product.category?.replace(/_/g, " ") ?? "N/A"}
              </li>
              <li>
                <strong>Material:</strong>{" "}
                {product.material?.replace(/_/g, " ") ?? "N/A"}
              </li>
              {product.sizeStocks?.length > 0 && (
                <li>
                  <strong>Available Sizes:</strong>
                  <div className="mt-2 grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5">
                    {product.sizeStocks
                      .filter((sizeStock) => sizeStock.stock > 0)
                      .map((sizeStock) => (
                        <button
                          key={sizeStock.size}
                          type="button"
                          onClick={() => {
                            setSelectedSize(sizeStock.size as SockSize);
                            // Reset quantity to 1 when size changes
                            setQuantity(1);
                          }}
                          className={`flex flex-col items-center rounded border p-2 ${
                            selectedSize === sizeStock.size
                              ? "border-primary bg-primary/10"
                              : "border-gray-200"
                          }`}
                        >
                          <span className="font-medium">
                            {sizeStock.size.replace(/_/g, " ")}
                          </span>
                          <span className="text-xs text-gray-500">
                            {sizeStock.stock} in stock
                          </span>
                        </button>
                      ))}
                  </div>
                </li>
              )}
            </ul>
          </div>

          {/* Quantity Selector */}
          {product.inStock && (
            <div className="flex items-center gap-4">
              <strong>Quantity:</strong>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuantityChange(quantity - 1)}
                  disabled={quantity <= 1}
                >
                  -
                </Button>
                <span className="w-8 text-center">{quantity}</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuantityChange(quantity + 1)}
                  disabled={quantity >= selectedSizeStock}
                >
                  +
                </Button>
              </div>
              <span className="text-sm text-gray-500">
                Max: {selectedSizeStock}
              </span>
            </div>
          )}

          {/* Tags */}
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {tags.map((tag, index) => (
                <span
                  key={index}
                  className="rounded-full bg-yellow-300 px-3 py-1 text-sm"
                >
                  {tag.trim()}
                </span>
              ))}
            </div>
          )}

          {/* Add to Cart */}
          <Button
            onClick={handleAddToCart}
            disabled={
              !product.inStock ||
              isProductAddingToCart ||
              (product.sizeStocks?.length > 0 && !selectedSize)
            }
            className="bg-primary hover:bg-primary-dark flex w-full items-center gap-2 rounded-lg px-6 py-3 text-white md:w-auto"
          >
            <ShoppingCart className="h-5 w-5" />
            {isProductAddingToCart
              ? "Adding..."
              : product.inStock
                ? "Add to Cart"
                : "Out of Stock"}
          </Button>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="mt-12">
        <Review productId={product.id} />
      </div>
    </div>
  );
};

export default ProductDetails;
