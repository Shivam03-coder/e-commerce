export interface ProductType {
  title: string;
  description: string;
  category: ProductCategory;
  productImage: string;
  material: MaterialType;
  size: SockSize;
  price: number;
  salePrice: number;
  inStock?: boolean;
  inventory: number;
  tags: string[];
}