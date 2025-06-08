import type {
  CustomerType,
  OrdersType,
  ProductsDataType,
} from "@/types/global";
import type { ApiResponse } from "./api";

export interface ProductListType extends ApiResponse {
  result: {
    products: ProductsDataType[];
  };
}
export interface ProductType extends ApiResponse {
  result: {
    product: ProductsDataType;
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

export interface ProductFeaturedType extends ApiResponse {
  result: {
    id: string;
    featuredProductImage: string;
  }[];
}

export interface OrdersListType extends ApiResponse {
  result: OrdersType[];
}
