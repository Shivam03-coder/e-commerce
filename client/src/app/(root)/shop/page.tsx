"use client";
import { useGetProductDetailsQuery } from "@/apis/shop-api";
import ProductView from "./product-view";
import type { ProductsDataType } from "@/types/global";
import PaginationSection from "./pagination";
import Spinner from "@/components/global/spinner";

export default function ProductPage() {
  const { data, isLoading } = useGetProductDetailsQuery();
  console.log("🚀 ~ ProductPage ~ data:", data)

  if (isLoading) {
    return (
      <div className="center min-h-screen w-full">
        <Spinner size={69} />
      </div>
    );
  }

  return (
    <>
      <ProductView products={data?.result.products as ProductsDataType[]} />
      <section className="py-4">
        <PaginationSection />
      </section>
      ;
    </>
  );
}
