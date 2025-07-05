"use client"
import React from "react";
import OrdersListTable from "./orders-table";
import { useGetOrdersDetailsQuery } from "@/apis/admin-api";

const OrdersPage = () => {
  const { data } = useGetOrdersDetailsQuery();
  console.log("🚀 ~ OrdersPage ~ data:", data)
  return <OrdersListTable data={data?.result || []} />;
};

export default OrdersPage;
