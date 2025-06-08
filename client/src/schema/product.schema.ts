import { z } from "zod";

export const addProductSchema = z.object({
  id: z.string().optional(),
  productImage: z.string(),
  title: z.string().min(1).min(2).max(30),
  description: z.string().min(10).max(300),
  category: z.string(),
  material: z.string(),
  size: z.string(),
  price: z.string().min(0).max(10000000),
  salePrice: z.string().min(0).max(100000),
  inventory: z.string(),
  tags: z.array(z.string()).nonempty("Please at least one item"),
  inStock: z.unknown(),
});

export const featuredProductSchema = z.object({
  featuredProductImage: z.string(),
});

export type AddProductSchemaType = z.infer<typeof addProductSchema>;
export type FeaturedProductSchemaType = z.infer<typeof featuredProductSchema>;
