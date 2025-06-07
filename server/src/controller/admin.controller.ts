import { MaterialType, ProductCategory, SockSize } from "@prisma/client";
import { db } from "@src/db";
import { GlobalUtils } from "@src/global";
import { ApiResponse, AsyncHandler } from "@src/utils/server-functions";
import { Request, Response } from "express";

export class AdminController {
  public static addProducts = AsyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const {
        title,
        description,
        category,
        productImage,
        material,
        size,
        price,
        salePrice,
        inStock,
        inventory,
        featured,
        tags,
      } = req.body;

      if (
        !title ||
        !description ||
        !category ||
        !productImage ||
        !material ||
        !size ||
        !price ||
        !tags ||
        inventory === undefined
      ) {
        res.status(400);
        throw new Error("Missing required fields");
      }

      if (price <= 0) {
        res.status(400);
        throw new Error("Price must be greater than 0");
      }

      if (inventory < 0) {
        res.status(400);
        throw new Error("Inventory cannot be negative");
      }
      GlobalUtils.validateEnum("category", category, ProductCategory);
      GlobalUtils.validateEnum("material", material, MaterialType);
      GlobalUtils.validateEnum("size", size, SockSize);

      await db.product.create({
        data: {
          title,
          description,
          category,
          tags,
          productImage,
          material,
          size,
          price,
          salePrice,
          inStock: inStock !== undefined ? inStock : inventory > 0,
          inventory,
        },
      });

      res.status(201).json(new ApiResponse(200, "Product added succesfully"));
    }
  );

  public static getProducts = AsyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const products = await db.product.findMany({
        orderBy: {
          createdAt: "desc",
        },
        select: {
          id: true,
          title: true,
          description: true,
          category: true,
          tags: true,
          productImage: true,
          material: true,
          size: true,
          price: true,
          salePrice: true,
          inStock: true,
          inventory: true,
          _count: {
            select: {
              Review: true,
            },
          },
        },
      });

      res.json(
        new ApiResponse(200, "Products fetched succesfully", { products })
      );
    }
  );

  public static getProductbyId = AsyncHandler(
    async (req: Request, res: Response): Promise<void> => {}
  );

  public static deleteProduct = AsyncHandler(
    async (req: Request, res: Response): Promise<void> => {}
  );

  public static editProductDeatails = AsyncHandler(
    async (req: Request, res: Response): Promise<void> => {}
  );
}
