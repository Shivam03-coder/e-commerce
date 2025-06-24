"use client";

import { useGetProductsQuery } from "@/apis/admin-api";
import ProductsListTable from "./product-list-table";

const ProductsPage = () => {
  const { data } = useGetProductsQuery();
  console.log("🚀 ~ ProductsPage ~ data:", data)
  return <ProductsListTable data={data?.result.products || []} />;
};

export default ProductsPage;
