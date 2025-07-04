import { Router } from "express";
import { requireAuth } from "@src/middleware/auth.middleware";
import { ShopController } from "@src/controller/shop.controller";

const shopRouter = Router();

shopRouter
  .get("/product/details", requireAuth, ShopController.getAllProductDetailsHandler)
  .get("/product/details/:productId", requireAuth, ShopController.getProductDetailsByIdHandler)
  .post("/product/review/:productId", requireAuth, ShopController.addReviewHandler)
  .get("/product/review/:productId", requireAuth, ShopController.getAllReviewHandler)
  .post("/favourite/:productId", requireAuth, ShopController.toggleFavoriteHandler)
  .get("/favourite", requireAuth, ShopController.getUserFavoritesHandler)

export default shopRouter;
