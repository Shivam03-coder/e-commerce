"use client";
import { Trash2, Plus, Minus } from "lucide-react";
import type { CartItemType } from "@/types/global";
import {
  useIncreaseCartsItemMutation,
  useRemoveCartsItemMutation,
} from "@/apis/cart-api";
import { useAppToasts } from "@/hooks/use-app-toast";

interface ProductCardProps {
  item: CartItemType;
}

export default function ProductCard({ item }: ProductCardProps) {
  const [removeItem] = useRemoveCartsItemMutation();
  const [addToCart] = useIncreaseCartsItemMutation();
  const { ErrorToast, SuccessToast } = useAppToasts();

  const onRemoveItem = async (productId: string) => {
    try {
      await removeItem({ productId }).unwrap();
      SuccessToast({ message: "Item removed from cart" });
    } catch (err) {
      ErrorToast({
        message: "Failed to remove item",
        description: err.message || "Please try again later",
      });
    }
  };

  const onUpdateQuantity = async (id: string, change: number) => {
    const newQuantity = item.quantity + change;

    if (newQuantity < 1) return;

    try {
      await addToCart({
        productId: item.productId,
        size: item.size,
        quantity: newQuantity,
      }).unwrap();

      SuccessToast({ title: "Cart updated successfully" });
    } catch (err) {
      ErrorToast({
        title: "Failed to update quantity",
      });
    }
  };

  return (
    <div className="p-6 transition-colors hover:bg-gray-50">
      <div className="flex items-start space-x-4">
        <div className="flex-shrink-0">
          <img
            src={item.image}
            alt={item.name}
            className="h-20 w-20 rounded-xl border border-gray-200 object-cover"
          />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="mb-1 text-lg font-semibold text-gray-900">
                {item.name}
              </h3>
              <div className="flex flex-wrap gap-3 text-sm text-gray-600">
                <span>Size: {item.size}</span>
              </div>
            </div>

            <button
              onClick={() => onRemoveItem(item.id)}
              className="p-2 text-gray-400 transition-colors hover:text-red-500"
              title="Remove item"
            >
              <Trash2 className="h-5 w-5" />
            </button>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => onUpdateQuantity(item.id, -1)}
                disabled={item.quantity <= 1}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-300 transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Minus className="h-4 w-4" />
              </button>

              <span className="min-w-[2rem] text-center font-semibold text-gray-900">
                {item.quantity}
              </span>

              <button
                onClick={() => onUpdateQuantity(item.id, 1)}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-300 transition-colors hover:bg-gray-100"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>

            <div className="text-right">
              <div className="text-xl font-bold text-gray-900">
                ${(item.price * item.quantity).toFixed(2)}
              </div>
              <div className="text-sm text-gray-500">
                ${item.price.toFixed(2)} each
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
