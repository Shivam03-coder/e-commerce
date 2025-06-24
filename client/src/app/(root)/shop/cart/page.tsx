"use client";
import React, { useState } from "react";
import {
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowLeft,
  CreditCard,
} from "lucide-react";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  size?: string;
  color?: string;
}

function App() {
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      id: "1",
      name: "Premium Wireless Headphones",
      price: 199.99,
      quantity: 1,
      image:
        "https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=300",
      color: "Black",
    },
    {
      id: "2",
      name: "Minimalist Desk Lamp",
      price: 89.99,
      quantity: 2,
      image:
        "https://images.pexels.com/photos/1112598/pexels-photo-1112598.jpeg?auto=compress&cs=tinysrgb&w=300",
      color: "White",
    },
    {
      id: "3",
      name: "Organic Cotton T-Shirt",
      price: 34.99,
      quantity: 1,
      image:
        "https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg?auto=compress&cs=tinysrgb&w=300",
      size: "Medium",
      color: "Navy Blue",
    },
    {
      id: "4",
      name: "Stainless Steel Water Bottle",
      price: 24.99,
      quantity: 3,
      image:
        "https://images.pexels.com/photos/3747468/pexels-photo-3747468.jpeg?auto=compress&cs=tinysrgb&w=300",
      color: "Silver",
    },
  ]);

  const updateQuantity = (id: string, change: number) => {
    setCartItems((items) =>
      items.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + change) }
          : item,
      ),
    );
  };

  const removeItem = (id: string) => {
    setCartItems((items) => items.filter((item) => item.id !== id));
  };

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const shipping = subtotal > 75 ? 0 : 9.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="border-b bg-white shadow-sm">
        <div className="mx-auto max-w-6xl px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button className="flex items-center space-x-2 text-gray-600 transition-colors hover:text-gray-900">
                <ArrowLeft className="h-5 w-5" />
                <span className="font-medium">Continue Shopping</span>
              </button>
            </div>
            <div className="flex items-center space-x-2">
              <ShoppingBag className="h-6 w-6 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">
                Shopping Cart
              </h1>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-8">
        {cartItems.length === 0 ? (
          <div className="py-16 text-center">
            <ShoppingBag className="mx-auto mb-4 h-16 w-16 text-gray-300" />
            <h2 className="mb-2 text-2xl font-semibold text-gray-600">
              Your cart is empty
            </h2>
            <p className="mb-6 text-gray-500">Add some items to get started</p>
            <button className="rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition-colors hover:bg-blue-700">
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
                <div className="border-b border-gray-100 p-6">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Cart Items (
                    {cartItems.reduce((sum, item) => sum + item.quantity, 0)})
                  </h2>
                </div>

                <div className="divide-y divide-gray-100">
                  {cartItems.map((item) => (
                    <div
                      key={item.id}
                      className="p-6 transition-colors hover:bg-gray-50"
                    >
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
                                {item.color && (
                                  <span className="flex items-center">
                                    <div
                                      className="mr-2 h-3 w-3 rounded-full border border-gray-300"
                                      style={{
                                        backgroundColor:
                                          item.color.toLowerCase(),
                                      }}
                                    ></div>
                                    {item.color}
                                  </span>
                                )}
                                {item.size && <span>Size: {item.size}</span>}
                              </div>
                            </div>

                            <button
                              onClick={() => removeItem(item.id)}
                              className="p-2 text-gray-400 transition-colors hover:text-red-500"
                              title="Remove item"
                            >
                              <Trash2 className="h-5 w-5" />
                            </button>
                          </div>

                          <div className="mt-4 flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <button
                                onClick={() => updateQuantity(item.id, -1)}
                                disabled={item.quantity <= 1}
                                className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-300 transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
                              >
                                <Minus className="h-4 w-4" />
                              </button>

                              <span className="min-w-[2rem] text-center font-semibold text-gray-900">
                                {item.quantity}
                              </span>

                              <button
                                onClick={() => updateQuantity(item.id, 1)}
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
                  ))}
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="sticky top-8 rounded-2xl border border-gray-100 bg-white shadow-sm">
                <div className="border-b border-gray-100 p-6">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Order Summary
                  </h2>
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

                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Tax</span>
                    <span className="font-semibold text-gray-900">
                      ${tax.toFixed(2)}
                    </span>
                  </div>

                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-semibold text-gray-900">
                        Total
                      </span>
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
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
