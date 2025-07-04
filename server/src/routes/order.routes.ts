import { Router } from "express";
import { requireAuth } from "@src/middleware/auth.middleware";
import OrderController from "@src/controller/order.controller";

const orderRouter = Router();

orderRouter.use(requireAuth);

orderRouter.post("/:cartId", OrderController.createOrderHandler);

export default orderRouter;
