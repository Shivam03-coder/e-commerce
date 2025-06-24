"use client";
import {
  useAddToCartMutation,
  useGetProductDetailsByIdQuery,
} from "@/apis/shop-api";
import React, { use } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  ArrowUpLeftFromSquareIcon,
  ShoppingCart,
} from "lucide-react";
import { useAppToasts } from "@/hooks/use-app-toast";
import Spinner from "@/components/global/spinner";
import Review from "./review";
import { Link } from "next-view-transitions";

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
  const tags = product?.tags.split(",");

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

  return (
    <div className="container mx-auto px-4 py-8">
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

          <div className="flex items-center gap-4">
            <span className="text-2xl font-semibold">${product.salePrice}</span>
            {product?.salePrice! < product.price && (
              <span className="text-lg text-gray-500 line-through">
                ${product.price}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <span
              className={`inline-block h-3 w-3 rounded-full ${product.inStock ? "bg-green-500" : "bg-red-500"}`}
            ></span>
            <span>{product.inStock ? "In Stock" : "Out of Stock"}</span>
            {product.inStock && <span>({product.inventory} available)</span>}
          </div>

          <p className="text-gray-700">{product.description}</p>

          <div className="space-y-2">
            <h3 className="font-semibold">Details:</h3>
            <ul className="space-y-1">
              <li>
                <strong>Category:</strong> {product.category.replace(/_/g, " ")}
              </li>
              <li>
                <strong>Material:</strong> {product.material.replace(/_/g, " ")}
              </li>
              <li>
                <strong>Size:</strong> {product.size.replace(/_/g, " ")}
              </li>
            </ul>
          </div>

          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {tags.map((tag, index) => (
                <span
                  key={index}
                  className="rounded-full bg-yellow-300 px-3 py-1 text-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          <Button
            onClick={() => handleAddToCart(productid.toString(), "1")}
            disabled={!product.inStock}
            className="bg-primary hover:bg-primary-dark flex w-full items-center gap-2 rounded-lg px-6 py-3 text-white md:w-auto"
          >
            <ShoppingCart className="h-5 w-5" />
            {product.inStock ? "Add to Cart" : "Out of Stock"}
          </Button>
        </div>
      </div>

      {/* Reviews Section - You can implement this later */}
      <div className="mt-12">
        <Review productId={parseInt(product.id)} />
      </div>
    </div>
  );
};

export default ProductDetails;
