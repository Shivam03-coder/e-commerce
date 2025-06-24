export type ProductCategory =
  | "HALF_SOCKS"
  | "NO_SHOW_SOCKS"
  | "ANKLE_SOCKS"
  | "CREW_SOCKS";

export type MaterialType = "COTTON" | "BAMBOO";

export type SockSize = "ONE_SIZE" | "XS_S" | "S_M" | "M_L" | "L_XL";

export interface ProductsDataType {
  id: string;
  title: string;
  description: string;
  category: ProductCategory;
  tags: string;
  productImage: string;
  material: MaterialType;
  size: SockSize;
  price: number;
  salePrice?: number;
  inStock: boolean;
  inventory: number;
  _count: {
    Review: number;
  };
}

export interface EditProductProps {
  id: string;
  title: string;
  description: string;
  category: ProductCategory;
  productImage: string;
  material: MaterialType;
  size: SockSize;
  tags: string;
  price: number;
  salePrice: number;
  inStock: boolean;
  inventory: number;
}

export type OrderStatus =
  | "PENDING"
  | "PROCESSING"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED"
  | "RETURNED";

export type PaymentStatus =
  | "PENDING"
  | "COMPLETED"
  | "FAILED"
  | "REFUNDED"
  | "PARTIALLY_REFUNDED";

interface Customer {
  id: string;
  name: string;
  email: string;
}

interface Product {
  id: number;
  name: string;
  price: string;
  image: string;
  quantity: string;
}

interface OrdersType {
  id: string;
  customer: Customer;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  date: string;
  total: number;
  products: Product[];
}

export interface ReviewListItem {
  message: string;
  createdAt: string;
  stars: number;
  user: {
    email: string;
    name: string;
  };
}
