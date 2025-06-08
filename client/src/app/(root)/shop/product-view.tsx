"use client";
import React, { useState } from "react";
import { Filter, Search, Grid, List } from "lucide-react";
import type { ProductsDataType } from "@/types/global";
import ProductCard from "./product-cards";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

interface ProductGridProps {
  products: ProductsDataType[];
}

const ProductView: React.FC<ProductGridProps> = ({ products }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [sortBy, setSortBy] = useState("name");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const categories = [
    "ALL",
    ...Array.from(new Set(products?.map((p) => p.category))),
  ];

  const filterAndSortProducts = () => {
    let filtered = products?.filter(
      (product) =>
        product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase()),
    );

    if (selectedCategory !== "ALL") {
      filtered = filtered.filter(
        (product) => product.category === selectedCategory,
      );
    }

    return filtered?.sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.salePrice! - b.salePrice!;
        case "price-high":
          return b.salePrice! - a.salePrice!;
        case "name":
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });
  };

  const filteredProducts = filterAndSortProducts();

  return (
    <div className="mx-auto w-full px-4 sm:px-6 lg:px-8">
      {/* Filters and Search */}
      <Card className="mb-8 p-6">
        <div className="flex flex-col items-center gap-4 lg:flex-row">
          {/* Search */}
          <div className="relative min-w-0 flex-1">
            <div className="relative">
              <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
              <Input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Category Filter */}
          <div className="flex w-full items-center gap-2 lg:w-auto">
            <Label htmlFor="category" className="flex items-center gap-2">
              <Filter className="text-muted-foreground h-4 w-4" />
              <span className="sr-only">Category</span>
            </Label>
            <Select
              value={selectedCategory}
              onValueChange={setSelectedCategory}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category === "ALL"
                      ? "All Categories"
                      : category.replace("_", " ")}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Sort */}
          <div className="w-full lg:w-auto">
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Name</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* View Mode Toggle */}
          <ToggleGroup
            type="single"
            value={viewMode}
            onValueChange={(value: "grid" | "list") => {
              if (value) setViewMode(value);
            }}
            variant="outline"
            className="ml-auto"
          >
            <ToggleGroupItem value="grid" aria-label="Grid view">
              <Grid className="h-4 w-4" />
            </ToggleGroupItem>
            <ToggleGroupItem value="list" aria-label="List view">
              <List className="h-4 w-4" />
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
      </Card>

      {/* Results Count */}
      <div className="mb-6">
        <p className="text-muted-foreground text-sm">
          Showing {filteredProducts?.length} of {products?.length} products
        </p>
      </div>

      {/* Products Grid */}
      {filteredProducts?.length > 0 ? (
        <div
          className={`mb-12 grid gap-6 ${
            viewMode === "grid"
              ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
              : "grid-cols-1 lg:grid-cols-2"
          }`}
        >
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              // @ts-ignore
              layout={viewMode}
            />
          ))}
        </div>
      ) : (
        <Card className="flex flex-col items-center justify-center py-12">
          <div className="text-muted-foreground mb-4 text-lg">
            No products found
          </div>
          <p className="text-muted-foreground text-sm">
            Try adjusting your search or filter criteria
          </p>
        </Card>
      )}
    </div>
  );
};

export default ProductView;
