"use client";

import { Trash2 } from "lucide-react";
import type { CartItem } from "@/types/global";
import { useRemoveCartsItemMutation } from "@/apis/cart-api";
import { useAppToasts } from "@/hooks/use-app-toast";
import { Button } from "@/components/ui/button";

interface ProductCardProps {
  item: CartItem;
}

export default function ProductCard({ item }: ProductCardProps) {
  const [removeItem, { isLoading }] = useRemoveCartsItemMutation();
  const { ErrorToast, SuccessToast } = useAppToasts();

  const onRemoveItem = async (productId: string) => {
    try {
      await removeItem({ productId }).unwrap();
      SuccessToast({ title: "Item removed from cart" });
    } catch (err) {
      ErrorToast({
        title: "Failed to remove item",
      });
    }
  };

  const totalPrice = item.selectedSizes.reduce(
    (sum, sizeItem) => sum + item.price * sizeItem.quantity,
    0,
  );

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    }).format(price);
  };

  const formatSize = (size: string) => {
    return size
      .split("_")
      .map((part) => part.charAt(0))
      .join("");
  };

  return (
    <div className="group relative overflow-hidden p-6 transition-all">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 overflow-hidden rounded-lg border-2 border-indigo-100">
          <img
            src={item.image}
            alt={item.name}
            className="h-24 w-24 object-cover transition-transform group-hover:scale-105"
            loading="lazy"
          />
        </div>

        {/* Product Details */}
        <div className="flex-1">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="mb-1 line-clamp-1 text-lg font-semibold text-gray-900">
                {item.name}
              </h3>
              <p className="max-w-max rounded-full bg-yellow-300 px-2 py-1 text-sm font-medium text-black capitalize">
                {item.material.toLowerCase()}
              </p>
            </div>

            <button
              onClick={() => onRemoveItem(item.productId)}
              disabled={isLoading}
              className="bg-red-5 rounded-full p-2 text-red-500 transition-colors disabled:opacity-50"
              title="Remove item"
              aria-label="Remove item"
            >
              <Trash2 className="h-5 w-5" />
            </button>
          </div>

          {/* Size Variants and Prices */}
          <div className="mt-4 space-y-3">
            {item.selectedSizes.map((sizeItem) => (
              <div
                key={sizeItem.size}
                className="flex items-center justify-between rounded-lg bg-white px-3 py-2"
              >
                <div className="flex items-center gap-2">
                  <span className="rounded bg-green-100 px-2 py-1 text-xs font-bold text-gray-800">
                    {formatSize(sizeItem.size)}
                  </span>
                  <span className="text-sm text-gray-900">
                    × <span className="font-medium">{sizeItem.quantity}</span>
                  </span>
                </div>
                <span className="text-sm font-semibold text-gray-900">
                  {formatPrice(item.price * sizeItem.quantity)}
                </span>
              </div>
            ))}
          </div>

          {/* Price Summary */}
          <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-3">
            <div className="text-sm font-bold text-gray-900">
              Subtotal: {formatPrice(totalPrice)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
