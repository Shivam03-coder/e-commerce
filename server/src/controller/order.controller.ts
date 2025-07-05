import { db } from "@src/db";
import OrderService from "@src/services/order.service";
import { ApiResponse, AsyncHandler, getAuth } from "@src/utils/api.utils";
import { Request, Response } from "express";
class OrderController {
  static createOrderHandler = AsyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const { cartId } = req.params;
      const { userId: customerId } = await getAuth(req);
      const { totalAmount } = req.body;

      const existingUser = await db.user.findUnique({
        where: {
          id: customerId,
        },
      });

      if (
        !existingUser ||
        !existingUser.email ||
        !existingUser.name ||
        !existingUser.phoneNumber
      )
        return;

      const result = await OrderService.createOrders({
        cartId,
        customerId,
        totalAmount,
        email: existingUser.email as string,
        name: existingUser.name as string,
        phoneNumber: existingUser.phoneNumber,
      });

      res
        .status(201)
        .json(new ApiResponse("Order created succesfully", result));
    }
  );

  static verifyPaymentHandler = AsyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      await OrderService.verifyPayment(req.body);
      res.status(200).json(new ApiResponse("Payment verified successfully"));
    }
  );
}

export default OrderController;
