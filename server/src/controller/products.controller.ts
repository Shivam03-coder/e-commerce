import { Prisma } from "@prisma/client";
import { GlobalUtils } from "@src/global";
import AuthServices from "@src/services/auth";
import {
  ApiError,
  ApiResponse,
  AsyncHandler,
} from "@src/utils/server-functions";
import { Request, Response } from "express";
import { ProductCategory, MaterialType, SockSize } from "@prisma/client"; // Enums
import { db } from "@src/db";

export class ProductController {
  public static getAllProducts = AsyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const {
        category,
        material,
        size,
        minPrice,
        maxPrice,
        inStock,
        featured,
        bestSeller,
        sortBy = "createdAt", // default sorting field
        sortOrder = "desc", // default sort order
        page = 1,
        limit = 10,
      } = req.query;

      const filter: Prisma.ProductWhereInput = {};

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

      const orderBy: Prisma.ProductOrderByWithRelationInput = {
        [sortBy as string]: sortOrder === "asc" ? "asc" : "desc",
      };

      const products = await db.product.findMany({
        where: filter,
        orderBy,
        skip,
        take,
      });

      const total = await db.product.count({ where: filter });

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
