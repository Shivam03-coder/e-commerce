"use client";

import React from "react";
import { ShoppingCart, Star, Package } from "lucide-react";

// Simulated Type
interface Product {
  id: number;
  name: string;
  price: number;
  salePrice: number;
  inStock: boolean;
  tags: string[];
  material: string;
  size: string;
  image: string;
  category: string;
  inventory: number;
  reviews: number;
}

const products: Product[] = [
  {
    id: 1,
    name: "Premium Cotton Blend",
    price: 29,
    salePrice: 24,
    inStock: true,
    image:
      "https://images.pexels.com/photos/7679720/pexels-photo-7679720.jpeg?auto=compress&cs=tinysrgb&w=400",
    tags: ["cotton", "best", "amazing"],
    material: "Cotton Blend",
    size: "M_L",
    category: "NO_SHOW_SOCKS",
    inventory: 36,
    reviews: 12,
  },
  {
    id: 2,
    name: "Athletic Performance",
    price: 30,
    salePrice: 28,
    inStock: true,
    image:
      "https://images.pexels.com/photos/7679730/pexels-photo-7679730.jpeg?auto=compress&cs=tinysrgb&w=400",
    tags: ["new", "bamboo"],
    material: "Synthetic",
    size: "L_XL",
    category: "ANKLE_SOCKS",
    inventory: 64,
    reviews: 5,
  },
  {
    id: 3,
    name: "Luxury Merino Wool",
    price: 36,
    salePrice: 36,
    inStock: false,
    image:
      "https://images.pexels.com/photos/7679740/pexels-photo-7679740.jpeg?auto=compress&cs=tinysrgb&w=400",
    tags: ["wool", "classic"],
    material: "Merino Wool",
    size: "S_M",
    category: "HALF_SOCKS",
    inventory: 0,
    reviews: 9,
  },
  {
    id: 4,
    name: "Casual Comfort",
    price: 24,
    salePrice: 20,
    inStock: true,
    image:
      "https://images.pexels.com/photos/7679750/pexels-photo-7679750.jpeg?auto=compress&cs=tinysrgb&w=400",
    tags: ["cotton", "best", "new"],
    material: "Cotton",
    size: "M",
    category: "ANKLE_SOCKS",
    inventory: 82,
    reviews: 15,
  },
];

const getCategoryColor = (category: string) => {
  switch (category) {
    case "ANKLE_SOCKS":
      return "bg-blue-100 text-blue-800";
    case "NO_SHOW_SOCKS":
      return "bg-green-100 text-green-800";
    case "HALF_SOCKS":
      return "bg-purple-100 text-purple-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const getTagColor = (tag: string) => {
  switch (tag.toLowerCase()) {
    case "best":
      return "bg-red-100 text-red-700";
    case "new":
      return "bg-emerald-100 text-emerald-700";
    case "bamboo":
      return "bg-amber-100 text-amber-700";
    case "cotton":
      return "bg-indigo-100 text-indigo-700";
    case "amazing":
      return "bg-pink-100 text-pink-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

const ProductsSection = () => {
  return (
    <section className="py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <h2 className="text-4xl font-bold text-gray-900">
            Featured Collection
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-xl text-gray-600">
            Discover our most popular socks, designed for comfort, style, and
            every occasion.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product) => {
            const discount = product.price !== product.salePrice;
            const discountPercent = discount
              ? Math.round(
                  ((product.price - product.salePrice) / product.price) * 100,
                )
              : 0;

            return (
              <div
                key={product.id}
                className="group bg-background rounded-xl border shadow-md transition hover:shadow-xl"
              >
                {/* Image */}
                <div className="relative overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-64 w-full rounded-xl object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  {discount && (
                    <div className="absolute top-3 left-3 rounded-full bg-red-500 px-2 py-1 text-sm font-semibold text-white">
                      -{discountPercent}%
                    </div>
                  )}
                  {!product.inStock && (
                    <div className="bg-opacity-50 absolute inset-0 flex items-center justify-center bg-black text-lg font-semibold text-white">
                      Out of Stock
                    </div>
                  )}
                  <div className="absolute top-3 right-3">
                    <span
                      className={`rounded-full px-2 py-1 text-xs font-medium ${getCategoryColor(product.category)}`}
                    >
                      {product.category.replace("_", " ")}
                    </span>
                  </div>
                </div>

                {/* Details */}
                <div className="p-5">
                  <h3 className="mb-2 line-clamp-2 text-lg font-semibold text-gray-900">
                    {product.name}
                  </h3>
                  <p className="mb-2 text-sm text-gray-500">
                    {product.material}
                  </p>

                  <div className="mb-2 flex flex-wrap gap-1">
                    {product.tags.slice(0, 3).map((tag, i) => (
                      <span
                        key={i}
                        className={`rounded-full px-2 py-1 text-xs font-medium ${getTagColor(tag)}`}
                      >
                        {tag}
                      </span>
                    ))}
                    {product.tags.length > 3 && (
                      <span className="rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600">
                        +{product.tags.length - 3}
                      </span>
                    )}
                  </div>

                  {/* Pricing */}
                  <div className="mb-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold text-gray-900">
                        ₹ {product.salePrice}
                      </span>
                      {discount && (
                        <span className="text-lg text-gray-500 line-through">
                          ₹ {product.price}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1 text-yellow-500">
                      <Star className="h-4 w-4 fill-current" />
                      <span className="text-sm text-gray-600">
                        ({product.reviews})
                      </span>
                    </div>
                  </div>

                  {/* Stock Bar */}
                  <div className="mb-3">
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Stock</span>
                      <span
                        className={`font-medium ${
                          product.inventory > 50
                            ? "text-green-600"
                            : product.inventory > 20
                              ? "text-yellow-600"
                              : "text-red-600"
                        }`}
                      >
                        {product.inventory} left
                      </span>
                    </div>
                    <div className="mt-1 h-2 w-full rounded-full bg-gray-200">
                      <div
                        className={`h-2 rounded-full ${
                          product.inventory > 50
                            ? "bg-green-500"
                            : product.inventory > 20
                              ? "bg-yellow-500"
                              : "bg-red-500"
                        }`}
                        style={{
                          width: `${Math.min((product.inventory / 200) * 100, 100)}%`,
                        }}
                      />
                    </div>
                  </div>

                  <button
                    disabled={!product.inStock}
                    className="bg-primary hover:bg-primary/90 flex w-full items-center justify-center gap-2 rounded-lg px-4 py-3 font-medium text-white disabled:cursor-not-allowed disabled:bg-gray-300"
                  >
                    <ShoppingCart className="h-5 w-5" />
                    {product.inStock ? "Add to Cart" : "Out of Stock"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ProductsSection;
