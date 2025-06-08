import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_SERVER_URI,
  credentials: "include",
});

const ApiServices = createApi({
  reducerPath: "apiservices",
  baseQuery,
  tagTypes: ["Product", "Customer", "Featured" , "Orders" , "Carts"],
  endpoints: (build) => ({}),
});

export default ApiServices;
