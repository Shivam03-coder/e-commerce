import { Router } from "express";
import { requireAuth } from "@src/middleware/auth.middleware";
import CartController from "@src/controller/cart.controller";

const cartRouter = Router();

cartRouter
  .get("/details", requireAuth, CartController.getCartItemsHandler)
  .post("/increase/:productId", requireAuth, CartController.increaseItemHandler)
  .post("/remove/:productId", requireAuth, CartController.removeItemFormCartHandler)
  .post("/add", requireAuth, CartController.addToCartHandler)


export default cartRouter;
