"use client";
import { CreditCard } from "lucide-react";

interface OrderSummaryProps {
  subtotal: number;
  shipping: number;
  total: number;
}

export default function OrderSummaryCard({
  subtotal,
  shipping,
  total,
}: OrderSummaryProps) {
  return (
    <div className="sticky top-8 rounded-2xl border border-gray-100 bg-white shadow-sm">
      <div className="border-b border-gray-100 p-6">
        <h2 className="text-xl font-semibold text-gray-900">Order Summary</h2>
      </div>

      <div className="space-y-4 p-6">
        <div className="flex items-center justify-between">
          <span className="text-gray-600">Subtotal</span>
          <span className="font-semibold text-gray-900">
            ${subtotal.toFixed(2)}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-gray-600">Shipping</span>
          <span className="font-semibold text-gray-900">
            {shipping === 0 ? "FREE" : `$${shipping.toFixed(2)}`}
          </span>
        </div>

        {shipping === 0 && (
          <div className="rounded-lg bg-green-50 p-3 text-sm text-green-600">
            🎉 Congratulations! You qualify for free shipping
          </div>
        )}

        <div className="border-t border-gray-200 pt-4">
          <div className="flex items-center justify-between">
            <span className="text-lg font-semibold text-gray-900">Total</span>
            <span className="text-2xl font-bold text-gray-900">
              ${total.toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-100 p-6">
        <button className="flex w-full transform items-center justify-center space-x-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 py-4 text-lg font-semibold text-white shadow-lg transition-all duration-200 hover:scale-[1.02] hover:from-blue-700 hover:to-purple-700 hover:shadow-xl">
          <CreditCard className="h-5 w-5" />
          <span>Proceed to Checkout</span>
        </button>

        <div className="mt-4 text-center">
          <div className="flex items-center justify-center space-x-4 text-sm text-gray-500">
            <span>🔒 Secure checkout</span>
            <span>•</span>
            <span>30-day returns</span>
          </div>
        </div>
      </div>
    </div>
  );
}
