import type { ProductsDataType } from "@/types/global";
import type { ApiResponse } from "./api";

export interface ProductListType extends ApiResponse {
  result: {
    products: ProductsDataType[];
  };
}

export interface ProductImageUrlType extends ApiResponse {
  result: {
    url: string;
  };
}
