import { db } from "@src/db";
import OrderService from "@src/services/order.service";
import { ApiResponse, AsyncHandler, getAuth } from "@src/utils/api.utils";
import { Request, Response } from "express";
import crypto from "crypto";
import { envs } from "@src/configs/envs.config";
import { NotFoundError, ValidationError } from "@src/utils/error.utils";
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
      const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
        req.body;

      console.log(req.body);

      if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
        throw new NotFoundError("Missing payment details");
      }

      const order = await db.order.findFirst({
        where: { rozarPayOrderId: razorpay_order_id },
      });

      if (!order) throw new NotFoundError("Order not found");

      const body = `${razorpay_order_id}|${razorpay_payment_id}`;

      const expectedSignature = crypto
        .createHmac("sha256", envs.RAZORPAY_KEY_SECRET)
        .update(body)
        .digest("hex");

      const isAuthentic = expectedSignature === razorpay_signature;

      if (!isAuthentic) {
        console.error("❌ Razorpay signature verification failed");
        throw new ValidationError("Invalid signature");
      }

      console.log("✅ Razorpay payment verified successfully");

      await db.order.update({
        where: {
          id: order.id,
        },
        data: {
          rozarPayOrderId: razorpay_order_id,
          paymentId: razorpay_payment_id,
          paymentStatus: "COMPLETED",
          orderStatus: "PROCESSING",
        },
      });

      res.status(200).json(new ApiResponse("Payment verified successfully"));
    }
  );
}

export default OrderController;
