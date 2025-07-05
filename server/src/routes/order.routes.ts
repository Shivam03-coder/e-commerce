import { Router } from "express";
import { requireAuth } from "@src/middleware/auth.middleware";
import OrderController from "@src/controller/order.controller";

const orderRouter = Router();

orderRouter
  .post("/verify", OrderController.verifyPaymentHandler)
  .post("/:cartId", requireAuth, OrderController.createOrderHandler);

export default orderRouter;
