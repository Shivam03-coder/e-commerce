import { SockSize } from "@prisma/client";
import redis from "@src/configs/redis.config";
import { db } from "@src/db";
import CartService from "@src/services/cart.service";
import { AddCartItemType } from "@src/types/global.types";
import { ApiResponse, AsyncHandler, getAuth } from "@src/utils/api.utils";
import { Request, Response } from "express";

class CartController {
  static getCartItemsHandler = AsyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const { userId } = await getAuth(req);

      const items = await CartService.getCartItems(userId);

      res.status(200).json(new ApiResponse("Fetched cart items", items));
    }
  );

  static removeItemFormCartHandler = AsyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const { userId } = await getAuth(req);
      const { productId } = req.params;

      const { message } = await CartService.removeItem(
        userId,
        parseInt(productId)
      );

      res.status(200).json(new ApiResponse(message));
    }
  );

  static increaseItemHandler = AsyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const { userId } = await getAuth(req);
      const { productId } = req.params;

      const { message } = await CartService.increaseItem(
        userId,
        parseInt(productId)
      );

      res.status(200).json(new ApiResponse(message));
    }
  );

  static addToCartHandler = AsyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const { userId } = await getAuth(req);
      const { productId, orders } = req.body as {
        productId: string;
        orders: Array<{ size: SockSize; quantity: number }>;
      };

      if (!productId || !orders || !Array.isArray(orders)) {
        res.status(400).json(new ApiResponse("Invalid request format"));
        return;
      }

      if (orders.length === 0) {
        res
          .status(400)
          .json(new ApiResponse("At least one size/quantity must be provided"));
        return;
      }

      for (const order of orders) {
        if (!order.size || !order.quantity || isNaN(Number(order.quantity))) {
          res
            .status(400)
            .json(
              new ApiResponse(
                "Each order must include valid size and numeric quantity"
              )
            );
          return;
        }
      }

      const redisKey = `cart:user:${userId}:${productId}`;
      await redis.sadd(redisKey, JSON.stringify(orders));

      await CartService.addToCart(
        userId,
        parseInt(productId),
        orders.map((o) => ({
          size: o.size,
          quantity: Number(o.quantity),
        }))
      );

      await db.user.update({
        where: { id: userId },
        data: {
          cartProductCount: {
            increment: 1,
          },
        },
      });

      res
        .status(200)
        .json(new ApiResponse("Product with selected sizes added to cart"));
    }
  );

  static removeFromCartHandler = AsyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const { productId } = req.query as { productId: string };
      const { userId } = await getAuth(req);
      const key = `cart:user:${userId}`;

      const alreadyExists = await redis.sismember(key, productId);

      if (!alreadyExists) {
        res.status(404).json(new ApiResponse("Product not found in cart"));
        return;
      }

      const removed = await ShopService.removeFromCart(
        userId,
        parseInt(productId)
      );
      if (!removed) {
        res
          .status(500)
          .json(new ApiResponse("Failed to remove product from cart"));
        return;
      }

      await redis.srem(key, productId);

      await db.user.update({
        where: { id: userId },
        data: {
          cartProductCount: {
            decrement: 1,
          },
        },
      });

      res
        .status(200)
        .json(new ApiResponse("Product removed from cart successfully"));
    }
  );
}
export default CartController;
