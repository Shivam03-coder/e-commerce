import type { CustomerType, ProductsDataType } from "@/types/global";
import type { ApiResponse } from "./api";

export interface ProductListType extends ApiResponse {
  result: {
    products: ProductsDataType[];
  };
}
export interface CustomerListType extends ApiResponse {
  result: {
    customer: CustomerType[];
  };
}

export interface ProductImageUrlType extends ApiResponse {
  result: {
    url: string;
  };
}
