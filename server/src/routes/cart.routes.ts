import { Router } from "express";
import { requireAuth } from "@src/middleware/auth.middleware";
import CartController from "@src/controller/cart.controller";

const cartRouter = Router();

cartRouter
  .get("/details", requireAuth, CartController.getCartItemsHandler)
  .post("/increase", requireAuth, CartController.increaseItemHandler)
  .post("/remove", requireAuth, CartController.removeItemFormCartHandler);

export default cartRouter;
