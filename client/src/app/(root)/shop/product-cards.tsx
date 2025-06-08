"use client"
import React from 'react';
import { ShoppingCart, Star, Package } from 'lucide-react';
import type { ProductsDataType } from '@/types/global';

interface ProductCardProps {
  product: ProductsDataType;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const parsedTags = JSON.parse(product.tags as string);
  const hasDiscount = product.price !== product.salePrice;
  const discountPercentage = hasDiscount 
    ? Math.round(((product.price - product.salePrice!) / product.price) * 100)
    : 0;

  const formatPrice = (price: number) => {
    return `$${(price / 100).toFixed(2)}`;
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'ANKLE_SOCKS':
        return 'bg-blue-100 text-blue-800';
      case 'NO_SHOW_SOCKS':
        return 'bg-green-100 text-green-800';
      case 'HALF_SOCKS':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTagColor = (tag: string) => {
    switch (tag.toLowerCase()) {
      case 'best':
        return 'bg-red-100 text-red-700';
      case 'new':
        return 'bg-emerald-100 text-emerald-700';
      case 'bamboo':
        return 'bg-amber-100 text-amber-700';
      case 'cotton':
        return 'bg-indigo-100 text-indigo-700';
      case 'amazing':
        return 'bg-pink-100 text-pink-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="group bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100">
      {/* Image Section */}
      <div className="relative overflow-hidden">
        <img
          src={product.productImage}
          alt={product.title}
          className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {hasDiscount && (
          <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded-full text-sm font-semibold">
            -{discountPercentage}%
          </div>
        )}
        {!product.inStock && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <span className="text-white font-semibold text-lg">Out of Stock</span>
          </div>
        )}
        <div className="absolute top-3 right-3">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(product.category)}`}>
            {product.category.replace('_', ' ')}
          </span>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-5">
        {/* Title */}
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
          {product.title}
        </h3>

        {/* Description */}
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {product.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1 mb-3">
          {parsedTags.slice(0, 3).map((tag: string, index: number) => (
            <span
              key={index}
              className={`px-2 py-1 rounded-full text-xs font-medium ${getTagColor(tag)}`}
            >
              {tag}
            </span>
          ))}
          {parsedTags.length > 3 && (
            <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
              +{parsedTags.length - 3}
            </span>
          )}
        </div>

        {/* Product Details */}
        <div className="flex items-center gap-4 mb-3 text-sm text-gray-500">
          <div className="flex items-center gap-1">
            <Package className="w-4 h-4" />
            <span>{product.material}</span>
          </div>
          <div>
            Size: {product.size.replace('_', '-')}
          </div>
        </div>

        {/* Price Section */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-gray-900">
              {formatPrice(product.salePrice!)}
            </span>
            {hasDiscount && (
              <span className="text-lg text-gray-500 line-through">
                {formatPrice(product.price)}
              </span>
            )}
          </div>
          <div className="flex items-center gap-1 text-yellow-500">
            <Star className="w-4 h-4 fill-current" />
            <span className="text-sm text-gray-600">
              ({product._count.Review})
            </span>
          </div>
        </div>

        {/* Stock Info */}
        <div className="mb-4">
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600">Stock</span>
            <span className={`font-medium ${product.inventory > 50 ? 'text-green-600' : product.inventory > 20 ? 'text-yellow-600' : 'text-red-600'}`}>
              {product.inventory} left
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
            <div
              className={`h-2 rounded-full ${product.inventory > 50 ? 'bg-green-500' : product.inventory > 20 ? 'bg-yellow-500' : 'bg-red-500'}`}
              style={{ width: `${Math.min((product.inventory / 200) * 100, 100)}%` }}
            ></div>
          </div>
        </div>

        {/* Add to Cart Button */}
        <button
          disabled={!product.inStock}
          className="w-full bg-primary/70 hover:bg-primary disabled:bg-gray-400 disabled:cursor-not-allowed text-black py-3 px-4 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center gap-2"
        >
          <ShoppingCart className="w-5 h-5" />
          {product.inStock ? 'Add to Cart' : 'Out of Stock'}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;