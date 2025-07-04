import { Router } from "express";
import { requireAuth } from "@src/middleware/auth.middleware";
import CartController from "@src/controller/cart.controller";

const cartRouter = Router();
cartRouter.use(requireAuth);

cartRouter
  .get("/details", CartController.getCartItemsHandler)
  .post("/remove/:productId", CartController.removeItemFormCartHandler)
  .post("/add", CartController.addToCartHandler);

export default cartRouter;
