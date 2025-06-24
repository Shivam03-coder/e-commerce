export type ProductCategory =
  | "HALF_SOCKS"
  | "NO_SHOW_SOCKS"
  | "ANKLE_SOCKS"
  | "CREW_SOCKS";

export type MaterialType = "COTTON" | "BAMBOO";

export type SockSize = "ONE_SIZE" | "XS_S" | "S_M" | "M_L" | "L_XL";

export interface SizeStock {
  id: string;
  productId: number;
  size: SockSize;
  stock: number;
}

export interface ProductsDataType {
  id: number;
  title: string;
  description: string;
  category: ProductCategory;
  tags: string[];
  productImage: string;
  material: MaterialType;
  price: number;
  salePrice?: number;
  inStock: boolean;
  inventory: number;
  sizeStocks: SizeStock[];
  _count?: {
    Review: number;
  };
}

export interface EditProductProps {
  id: number;
  title: string;
  description: string;
  category: ProductCategory;
  productImage: string;
  material: MaterialType;
  sizeStocks: SizeStock[];
  tags: string[];
  price: number;
  salePrice?: number;
  inStock: boolean;
  inventory: number;
}

export interface CartItemType {
  productId: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  size: string;
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
