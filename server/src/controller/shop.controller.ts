import { Prisma } from "@prisma/client";
import { GlobalUtils } from "@src/global";
import { ApiResponse, AsyncHandler } from "@src/utils/server-functions";
import { Request, Response } from "express";
import { ProductCategory, MaterialType, SockSize } from "@prisma/client"; // Enums
import { db } from "@src/db";

export class ShopController {
  public static getAllProductDetails = AsyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const {
        category,
        material,
        size,
        minPrice,
        maxPrice,
        inStock,
        page = 1,
        limit = 10,
      } = req.query;

      const filter: Prisma.ProductWhereInput = {};

      // Only apply filters if the corresponding query parameters are provided
      if (category) {
        GlobalUtils.validateEnum(
          "category",
          category as string,
          ProductCategory
        );
        filter.category = category as ProductCategory;
      }

      if (material) {
        GlobalUtils.validateEnum("material", material as string, MaterialType);
        filter.material = material as MaterialType;
      }

      if (size) {
        GlobalUtils.validateEnum("size", size as string, SockSize);
        filter.size = size as SockSize;
      }

      if (minPrice || maxPrice) {
        filter.price = {};
        if (minPrice) filter.price.gte = parseFloat(minPrice as string);
        if (maxPrice) filter.price.lte = parseFloat(maxPrice as string);
      }

      if (inStock !== undefined) {
        filter.inStock = inStock === "true";
      }

      const skip = (Number(page) - 1) * Number(limit);
      const take = Number(limit);

      const products = await db.product.findMany({
        where: Object.keys(filter).length === 0 ? undefined : filter,
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
        skip,
        take,
      });

      const total = await db.product.count({
        where: Object.keys(filter).length === 0 ? undefined : filter,
      });

      res.status(200).json(
        new ApiResponse(200, "Products fetched successfully", {
          products,
          total,
          page: Number(page),
          limit: Number(limit),
          totalPages: Math.ceil(total / Number(limit)),
        })
      );
    }
  );
}
