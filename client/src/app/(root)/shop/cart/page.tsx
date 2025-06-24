"use client";
import React, { useEffect, useState } from "react";
import { ShoppingBag, ArrowLeft } from "lucide-react";
import { useGetCartsItemsQuery } from "@/apis/cart-api";
import { setTotalItemsInCart } from "@/store/app-state/global-state";
import { useAppDispatch } from "@/store";
import type { CartItemType } from "@/types/global";
import ProductCard from "./product-card";
import OrderSummary from "./order-summary";
import { useTransitionRouter } from "next-view-transitions";
import useAppLinks from "@/navigations";

function CartPage() {
  const [cartItems, setCartItems] = useState<CartItemType[]>([]);
  const { data } = useGetCartsItemsQuery();
  const dispatch = useAppDispatch();
  const router = useTransitionRouter();
  const nav = useAppLinks();
  useEffect(() => {
    if (data?.result) {
      setCartItems(data.result);
      dispatch(setTotalItemsInCart(data.result.length));
    }
  }, [data?.result, dispatch]);

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const shipping = subtotal > 75 ? 0 : 9.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-8xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {cartItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="mb-6 rounded-full bg-gray-100 p-6">
              <ShoppingBag className="h-12 w-12 text-gray-400" />
            </div>
            <h2 className="mb-3 text-2xl font-semibold text-gray-800">
              Your cart is empty
            </h2>
            <p className="mb-8 max-w-md text-center text-gray-500">
              Looks like you haven't added any items to your cart yet
            </p>
            <button
              onClick={() => router.push(nav.shop)}
              className="rounded-lg bg-blue-600 px-8 py-3 font-medium text-white shadow-md transition-colors hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
            >
              Browse Products
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {/* Cart Items Section */}
            <div className="lg:col-span-2">
              <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
                <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Your Cart ({cartItems.length} items)
                  </h2>
                </div>

                <div className="divide-y divide-gray-200">
                  {cartItems.map((item) => (
                    <ProductCard key={item.productId} item={item} />
                  ))}
                </div>
              </div>
            </div>

            {/* Order Summary Section */}
            <div className="lg:col-span-1">
              <OrderSummary
                subtotal={subtotal}
                shipping={shipping}
                tax={tax}
                total={total}
              />
            </div>
          </div>
        )}
      </main>

      {/* Footer Padding */}
      <div className="h-16"></div>
    </div>
  );
}

export default CartPage;
