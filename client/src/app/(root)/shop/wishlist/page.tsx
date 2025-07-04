"use client";
import {
  useToggleFavoriteMutation,
  useUserFavoritesQuery,
} from "@/apis/shop-api";
import Image from "next/image";
import { Link } from "next-view-transitions";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import BackButton from "@/components/global/back-button";
import { useAppToasts } from "@/hooks/use-app-toast";

const WishListPage = () => {
  const { data, refetch } = useUserFavoritesQuery(null);
  const [toggleFavorite] = useToggleFavoriteMutation();
  const { ErrorToast, SuccessToast } = useAppToasts();

  const handleRemoveFromWishlist = async (
    productId: number,
    e: React.MouseEvent,
  ) => {
    e.stopPropagation();
    try {
      const res = await toggleFavorite({ productId }).unwrap();
      SuccessToast({
        title: res.message || "Removed from wishlist",
      });
      refetch();
    } catch (error) {
      ErrorToast({
        title: "Failed to update favorites",
        description: "There was an error while updating your wishlist",
      });
      console.error("Error updating favorites:", error);
    }
  };

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <BackButton />
      <h1 className="mb-8 text-3xl font-bold text-green-800">Your Wishlist</h1>

      {data?.result?.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16">
          <div className="mb-4 rounded-full bg-green-100 p-6">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 text-green-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
          </div>
          <p className="mb-4 text-lg text-gray-600">Your wishlist is empty</p>
          <Link href="/shop">
            <Button className="bg-green-600 hover:bg-green-700">
              Browse Products
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {data?.result?.map(({ product }) => (
            <div
              key={product.id}
              className="overflow-hidden rounded-lg border border-green-100 bg-white shadow-sm transition-all hover:shadow-lg"
            >
              <div className="relative h-60 w-full">
                <Image
                  src={product.productImage}
                  alt={product.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                {product.salePrice && (
                  <div className="absolute top-2 left-2 rounded-full bg-green-600 px-2 py-1 text-xs font-bold text-white">
                    SALE
                  </div>
                )}
              </div>

              <div className="p-4">
                <h3 className="mb-2 line-clamp-1 text-lg font-semibold text-gray-800">
                  {product.title}
                </h3>

                <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                  <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-800">
                    {product.material}
                  </span>
                  <span
                    className={`text-sm font-medium ${
                      product.inventory > 10
                        ? "text-green-600"
                        : "text-orange-500"
                    }`}
                  >
                    {product.inventory > 10
                      ? `${product.inventory} in stock`
                      : "Low stock"}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="font-bold text-green-700">
                      ₹{product.salePrice || product.price}
                    </span>
                    {product.salePrice && (
                      <span className="text-xs text-gray-500 line-through">
                        ₹{product.price}
                      </span>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-red-100 text-red-600 hover:bg-red-50 hover:text-red-700"
                      onClick={(e) => handleRemoveFromWishlist(product.id, e)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>

                    <Link href={`/shop/${product.id}`}>
                      <Button
                        size="sm"
                        className="bg-green-600 hover:bg-green-700"
                      >
                        View
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WishListPage;
