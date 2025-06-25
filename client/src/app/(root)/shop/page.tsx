"use client";
import { useGetProductDetailsQuery } from "@/apis/shop-api";
import ProductsList from "./products-list";
import type { ProductsDataType } from "@/types/global";
import Spinner from "@/components/global/spinner";
import Footer from "./footer";

export default function ProductPage() {
  const { data, isLoading } = useGetProductDetailsQuery();

  if (isLoading) {
    return (
      <div className="center min-h-screen w-full">
        <Spinner size={69} />
      </div>
    );
  }

  if (!data?.result) {
    return (
      <div className="center min-h-screen w-full">
        <h1>NO DATA FOUND</h1>
      </div>
    );
  }

  return (
      <ProductsList products={data.result.products as ProductsDataType[]} />
  );
}
