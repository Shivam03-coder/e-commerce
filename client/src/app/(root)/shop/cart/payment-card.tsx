"use client";
import { useState } from "react";
import Script from "next/script";
import {
  useCreateOrderMutation,
  useVerifyPaymentMutation,
} from "@/apis/order-api";
import { useAppToasts } from "@/hooks/use-app-toast";
import { useReadLocalStorage } from "usehooks-ts";
import AppImages from "@/constants/images";

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
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [createOrder] = useCreateOrderMutation();
  const { ErrorToast, SuccessToast } = useAppToasts();
  const [verifyPayment, { isLoading }] = useVerifyPaymentMutation();
  const localCurrentCartId = useReadLocalStorage("user_cart_id") as string;

  const handlePayment = async () => {
    try {
      const createdOrder = await createOrder({
        cartId: localCurrentCartId,
        totalAmount: total,
      }).unwrap();

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY,
        amount: createdOrder.result.totalAmount,
        currency: "INR",
        name: "NIDHIRA",
        image: AppImages.logo,
        description: "Premium Plan",
        order_id: createdOrder.result.orderId,
        handler: async function (response: any) {
          try {
            const payment = await verifyPayment({
              ...response,
              orderId: createdOrder.result.orderId,
            }).unwrap();

            SuccessToast({
              title: payment.message,
            });
            setPaymentSuccess(true);
          } catch (error) {
            ErrorToast({
              title: "Paymnet failed",
            });
          }
        },
        prefill: {
          name: createdOrder.result.user.name,
          email: createdOrder.result.user.email,
          contact: createdOrder.result.user.contact,
        },
        theme: {
          color: "#16a34a",
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (err) {
      setError("Payment failed. Please try again.");
    }
  };

  return (
    <div className="bg-gradient-to-br from-green-50 to-emerald-50">
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="lazyOnload"
      />

      <div className="w-full max-w-md overflow-hidden rounded-none border border-green-100 bg-white shadow-none">
        <div className="bg-green-600 p-6 text-white">
          <h1 className="text-2xl font-bold">Order Summary</h1>
          <p className="opacity-90">Complete your purchase</p>
        </div>

        <div className="p-6">
          {paymentSuccess ? (
            <div className="py-8 text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                <svg
                  className="h-6 w-6 text-green-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h3 className="mb-1 text-lg font-medium text-gray-900">
                Payment Successful!
              </h3>
              <p className="text-sm text-gray-500">
                Thank you for your purchase.
              </p>
            </div>
          ) : (
            <>
              <div className="mb-6 space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium">₹{shipping.toFixed(2)}</span>
                </div>
                <div className="flex justify-between border-t pt-3">
                  <span className="font-medium">Total</span>
                  <span className="font-bold">₹{total.toFixed(2)}</span>
                </div>
              </div>

              <div className="mb-6 border-l-4 border-green-400 bg-green-50 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg
                      className="h-5 w-5 text-green-600"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-green-700">
                      You'll be redirected to Razorpay's secure payment gateway
                      to complete your transaction.
                    </p>
                  </div>
                </div>
              </div>

              {error && (
                <div className="mb-6 border-l-4 border-red-400 bg-red-50 p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg
                        className="h-5 w-5 text-red-600"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-red-700">{error}</p>
                    </div>
                  </div>
                </div>
              )}

              <button
                onClick={handlePayment}
                disabled={isLoading}
                className={`flex w-full items-center justify-center ${
                  isLoading ? "bg-green-400" : "bg-green-600 hover:bg-green-700"
                } rounded-lg px-4 py-3 font-medium text-white transition duration-200`}
              >
                {isLoading ? (
                  <>
                    <svg
                      className="mr-3 -ml-1 h-5 w-5 animate-spin text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  `Pay ₹${total.toFixed(2)}`
                )}
              </button>
            </>
          )}
        </div>
      </div>

      <div className="mt-6 text-center text-sm text-gray-500">
        <p>Secure payment processing powered by Razorpay</p>
        <p className="mt-1">© 2025 Your Company Name. All rights reserved.</p>
      </div>
    </div>
  );
}
