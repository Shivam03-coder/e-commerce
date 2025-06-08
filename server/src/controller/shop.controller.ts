import { Prisma } from "@prisma/client";
import { GlobalUtils } from "@src/global";
import {
  ApiError,
  ApiResponse,
  AsyncHandler,
} from "@src/utils/server-functions";
import { Request, Response } from "express";
import { ProductCategory, MaterialType, SockSize } from "@prisma/client"; // Enums
import { db } from "@src/db";
import { getAuthUser } from "@src/utils/get-auth-user";

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

  public static addToCart = AsyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const { productId, quantity } = req.query as {
        productId: string;
        quantity: string;
      };

      if (!productId || !quantity) {
        throw new ApiError(400, "Product ID and quantity are required");
      }

      const parsedQuantity = parseInt(quantity);
      if (isNaN(parsedQuantity) || parsedQuantity <= 0) {
        throw new ApiError(400, "Quantity must be a positive number");
      }

      const { id: userId } = getAuthUser(req);
      const numericProductId = parseInt(productId);

      const product = await db.product.findUnique({
        where: { id: numericProductId },
        select: { id: true, inventory: true, price: true, inStock: true },
      });

      if (!product) {
        throw new ApiError(404, "Product not found");
      }

      if (!product.inStock || product.inventory < parsedQuantity) {
        throw new ApiError(
          400,
          product.inStock
            ? `Only ${product.inventory} items available in stock`
            : "Product is currently out of stock"
        );
      }

      let cart = await db.cart.findFirst({
        where: { userId },
        include: { items: true },
      });

      if (!cart) {
        cart = await db.cart.create({
          data: { userId },
          include: { items: true },
        });
      }

      const existingItem = cart.items.find(
        (item) => item.productId === numericProductId
      );

      if (existingItem) {
        await db.cartItem.update({
          where: { id: existingItem.id },
          data: {
            quantity: existingItem.quantity + parsedQuantity,
            updatedAt: new Date(),
          },
        });
      } else {
        await db.cartItem.create({
          data: {
            cartId: cart.id,
            productId: numericProductId,
            quantity: parsedQuantity,
          },
        });
      }

      await db.product.update({
        where: { id: numericProductId },
        data: {
          inventory: { decrement: parsedQuantity },
          inStock: product.inventory - parsedQuantity > 0,
        },
      });

      res
        .status(200)
        .json(new ApiResponse(200, "Product added to cart successfully"));
    }
  );
}
