"use client";
import { useGetProductDetailsQuery } from "@/apis/shop-api";
import ProductView from "./product-view";
import type { ProductsDataType } from "@/types/global";

export default function ProductPage() {
  const { data } = useGetProductDetailsQuery();
  return <ProductView products={data?.result.products as ProductsDataType[]} />;
}
