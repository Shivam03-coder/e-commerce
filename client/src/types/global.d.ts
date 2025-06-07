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
  tags?: string;
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

interface CustomerType {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  userAddress: {
    city: string;
    state: string;
  };
}
