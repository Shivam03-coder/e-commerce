"use client";

import { useGetCustomerListQuery } from "@/apis/admin-api";
import CustomerListTable from "./customer-table-list";

const CustomersPage = () => {
  const { data } = useGetCustomerListQuery();
  console.log("🚀 ~ CustomersPage ~ data:", data)
  return <CustomerListTable data={data?.result.customer || []} />;
};

export default CustomersPage;
