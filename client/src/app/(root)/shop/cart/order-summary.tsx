"use client";
import { useCreateOrderMutation } from "@/apis/order-api";
import Spinner from "@/components/global/spinner";
import { Button } from "@/components/ui/button";
import { useAppToasts } from "@/hooks/use-app-toast";
import { CreditCard } from "lucide-react";
import { useTransitionRouter } from "next-view-transitions";
import { useReadLocalStorage } from "usehooks-ts";

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
  const router = useTransitionRouter();

  const { ErrorToast, SuccessToast } = useAppToasts();
  const localCurrentCartId = useReadLocalStorage("user_cart_id") as string;
  const [createOrder, { isLoading }] = useCreateOrderMutation();

  async function handleOrderCreation() {
    if (!localCurrentCartId) {
      ErrorToast({ title: "Cart ID not found in local storage." });
      return;
    }

    try {
      const res = await createOrder({
        cartId: localCurrentCartId,
        totalAmount: total,
      }).unwrap();

      SuccessToast({
        title: res?.message ?? "Order created successfully!",
      });

      router.push("/payment");
    } catch (error) {
      ErrorToast({
        title: "Order creation failed",
        description: (error as Error)?.message ?? undefined,
      });
    }
  }

  return (
    <div className="sticky top-8 rounded-none border border-gray-100 bg-white shadow-none">
      <div className="border-b border-gray-100 p-6">
        <h2 className="text-xl font-semibold text-gray-900">Order Summary</h2>
      </div>

      <div className="space-y-4 p-6">
        <div className="flex items-center justify-between">
          <span className="text-gray-600">Subtotal</span>
          <span className="font-semibold text-gray-900">
            ₹{subtotal.toFixed(2)}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-gray-600">Shipping</span>
          <span className="font-semibold text-gray-900">
            {shipping === 0 ? "FREE" : `₹${shipping.toFixed(2)}`}
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
              ₹{total.toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-100 p-6">
        <Button
          onClick={handleOrderCreation}
          className="flex w-full transform items-center justify-center space-x-2 rounded-xl bg-green-300 py-4 text-lg font-semibold text-black shadow-lg transition-all duration-200 hover:scale-[1.02] hover:from-blue-700 hover:to-purple-700 hover:shadow-xl"
        >
          {isLoading ? (
            <Spinner />
          ) : (
            <>
              {" "}
              <CreditCard className="h-5 w-5" />
              <span>Proceed to payment</span>
            </>
          )}
        </Button>

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
