import OrderService from "@src/services/order.service";
import { ApiResponse, AsyncHandler, getAuth } from "@src/utils/api.utils";
import { Request, Response } from "express";

class OrderController {
  static createOrderHandler = AsyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const { cartId } = req.params;
      const { userId: customerId } = await getAuth(req);
      const { totalAmount } = req.body;

      await OrderService.createOrders({
        cartId,
        customerId,
        totalAmount,
      });

      res.status(201).json(new ApiResponse("Order created succesfully"));
    }
  );
}

export default OrderController;
