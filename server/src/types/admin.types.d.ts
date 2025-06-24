import { SockSize } from "@prisma/client";

export interface ProductType {
  title: string;
  description: string;
  category: ProductCategory;
  productImage: string;
  material: MaterialType;
  sizeStock: {
    size: SockSize;
    stock: number;
  }[];
  price: number;
  salePrice: number;
  inStock?: boolean;
  inventory: number;
  tags: string[];
}
