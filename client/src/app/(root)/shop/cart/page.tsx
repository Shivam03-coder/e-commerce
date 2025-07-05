"use client";
import React, { useEffect, useState } from "react";
import { ShoppingBag, ArrowLeft } from "lucide-react";
import { useGetCartsItemsQuery } from "@/apis/cart-api";
import { setTotalItemsInCart } from "@/store/app-state/global-state";
import { useAppDispatch } from "@/store";
import type { CartItem } from "@/types/global";
import { Link, useTransitionRouter } from "next-view-transitions";
import useAppLinks from "@/navigations";
import { Button } from "@/components/ui/button";
import ProductCard from "./product-card";
import OrderSummaryCard from "./payment-card";

function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const { data } = useGetCartsItemsQuery();
  const dispatch = useAppDispatch();
  const router = useTransitionRouter();
  const nav = useAppLinks();

  useEffect(() => {
    if (data?.result) {
      setCartItems(data.result);
      const totalItems = data.result.reduce(
        (sum, item) => sum + item.totalQuantity,
        0,
      );
      dispatch(setTotalItemsInCart(totalItems));
    }
  }, [data?.result, dispatch]);

  const filteredCartItems = cartItems.filter(
    (item) => item.cartStatus === "PENDING",
  );

  const subtotal = filteredCartItems.reduce(
    (sum, item) =>
      sum +
      item.price *
        item.selectedSizes.reduce(
          (sizeSum, size) => sizeSum + size.quantity,
          0,
        ),
    0,
  );

  const shipping = subtotal > 75 ? 0 : 9.99;
  const total = subtotal + shipping;

  return (
    <div className="min-h-screen bg-green-50">
      <main className="max-w-8xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <Button asChild variant="ghost" className="my-5 gap-2 bg-green-200">
          <Link href="/shop">
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Shop</span>
          </Link>
        </Button>
        {filteredCartItems.length === 0 ? (
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
              className="rounded-lg bg-green-600 px-8 py-3 font-medium text-white shadow-md transition-colors hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
            >
              Browse Products
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {/* Cart Items Section */}
            <div className="lg:col-span-2">
              <div className="overflow-hidden border border-gray-200 bg-green-50">
                <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Your Cart (
                    {filteredCartItems.reduce(
                      (sum, item) => sum + item.totalQuantity,
                      0,
                    )}{" "}
                    items)
                  </h2>
                </div>

                <div className="divide-y divide-gray-200">
                  {filteredCartItems.map((item) => (
                    <ProductCard key={item.productId} item={item} />
                  ))}
                </div>
              </div>
            </div>

            {/* Order Summary Section */}
            <div className="lg:col-span-1">
              <OrderSummaryCard
                subtotal={subtotal}
                shipping={shipping}
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
