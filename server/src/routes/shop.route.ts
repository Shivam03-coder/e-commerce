import { Router } from "express";
import { requireAuth } from "@src/middleware/auth.middleware";
import { ShopController } from "@src/controller/shop.controller";

const shopRouter = Router();

shopRouter
  .get("/product/details",requireAuth(), ShopController.getAllProductDetails)

export default shopRouter;
