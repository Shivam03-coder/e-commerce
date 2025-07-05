import type {
  CustomerType,
  MaterialType,
  OrderStatus,
  OrdersType,
  PaymentStatus,
  ProductCategory,
  ProductsDataType,
  SockSize,
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
  result: Order[];
}

interface Address {
  street?: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
  formattedAddress: string;
}

interface Customer {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  address: Address | null;
}

interface SizeQuantity {
  size: SockSize;
  quantity: number;
}

interface GroupedItem {
  title: string;
  price: number;
  category: ProductCategory;
  material: MaterialType;
  image: string;
  sizes: SizeQuantity[];
}

export interface Order {
  id: string;
  rozarPayOrderId: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  date: string;
  updatedAt: string;
  total: number;
  customer: Customer;
  items: GroupedItem[];
}

interface ApiResponse {
  message: string;
  result: Order[];
  status: "success" | "error";
}
