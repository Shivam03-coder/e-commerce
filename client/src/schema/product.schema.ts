import { z } from "zod";

export const addProductSchema = z.object({
  title: z.string().min(1),
  description: z.string(),
  category: z.enum([
    "HALF_SOCKS",
    "NO_SHOW_SOCKS",
    "ANKLE_SOCKS",
    "CREW_SOCKS",
  ]),
  material: z.enum(["COTTON", "BAMBOO"]),
  productImage: z.string(),
  price: z.string(),
  salePrice: z.string().optional(),
  inStock: z.boolean(),
  tags: z.array(z.string()),
  sizeStock: z
    .array(
      z.object({
        size: z.string(),
        stock: z.number().min(0),
      }),
    )
    .min(1, "At least one size-stock pair is required"),
});

export const featuredProductSchema = z.object({
  featuredProductImage: z.string(),
});

export type AddProductSchemaType = z.infer<typeof addProductSchema>;
export type FeaturedProductSchemaType = z.infer<typeof featuredProductSchema>;
