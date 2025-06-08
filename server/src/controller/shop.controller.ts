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

      res.status(200).json(
        new ApiResponse(200, "Products fetched successfully", {
          products,
        })
      );
    }
  );

  public static getProductDetailsById = AsyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const { productId } = req.params;

      if (!productId) {
        res.status(400).json(new ApiResponse(400, "Product ID is required"));
        return;
      }

      const product = await db.product.findUnique({
        where: { id: parseInt(productId) },
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

      if (!product) {
        res.status(404).json(new ApiResponse(404, "Product not found"));
        return;
      }

      res.status(200).json(
        new ApiResponse(200, "Product fetched successfully", {
          product,
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
