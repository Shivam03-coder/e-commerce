import { Request, Response } from "express";
import { ApiResponse, AsyncHandler, getAuth } from "@src/utils/api.utils";
import { ShopService } from "@src/services/shop.service";
import redis from "@src/configs/redis.config";
import { db } from "@src/db";
import { SockSize } from "@prisma/client";

export class ShopController {
  static getAllProductDetailsHandler = AsyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const products = await ShopService.getAllProducts();
      res.status(200).json(
        new ApiResponse("Products fetched successfully", {
          products,
        })
      );
    }
  );

  static getProductDetailsByIdHandler = AsyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const { productId } = req.params;
      const product = await ShopService.getProductById(parseInt(productId));
      res.status(200).json(
        new ApiResponse("Product fetched successfully", {
          product,
        })
      );
    }
  );

  static addReviewHandler = AsyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const { productId } = req.params;
      const { userId } = await getAuth(req);
      const { message, stars } = req.body;

      await ShopService.addReview(userId, parseInt(productId), message, stars);

      res.status(201).json(new ApiResponse("Review created successfully"));
    }
  );

  static getAllReviewHandler = AsyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const { productId } = req.params;
      const reviews = await ShopService.getProductReviews(parseInt(productId));
      res
        .status(200)
        .json(new ApiResponse("Reviews fetched successfully", reviews));
    }
  );

  static toggleFavoriteHandler = AsyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const { userId } = await getAuth(req);
      const { productId } = req.params;

      const { message } = await ShopService.toggleFavorite(
        userId,
        parseInt(productId)
      );

      res.status(200).json(new ApiResponse(message));
    }
  );

  static getUserFavoritesHandler = AsyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const { userId } = await getAuth(req);
      const favorites = (await ShopService.getUserFavorites(userId)) ?? [];

      res
        .status(200)
        .json(new ApiResponse("User Favourite Products Fetched", favorites));
    }
  );
}
