import { Router } from "express";
import { requireAuth } from "@src/middleware/auth.middleware";
import { ShopController } from "@src/controller/shop.controller";

const shopRouter = Router();

shopRouter
  .get("/product/details", requireAuth(), ShopController.getAllProductDetails)
  .post("/product/cart", requireAuth(), ShopController.addToCart)
  .get("/product/details/:productId", requireAuth(), ShopController.getProductDetailsById);

export default shopRouter;
