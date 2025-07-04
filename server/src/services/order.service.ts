import { getOptions, razorpay } from "@src/configs/rozar-pay.config";
import { db } from "@src/db";
import { findCartById } from "@src/db/raw.query";

class OrderService {
  static async createOrders(data: {
    cartId: string;
    customerId: string;
    totalAmount: number;
  }) {
    const { cartId, customerId, totalAmount } = data;

    await findCartById(cartId);

    const options = getOptions(totalAmount, "INR", `${cartId}`);

    const razorpayOrder = await razorpay.orders.create(options);

    if (!razorpayOrder.id || razorpayOrder.status !== "created") {
      throw new Error("Failed to create Razorpay order");
    }

    const createdOrder = await db.$transaction(async (tx) => {
      return await tx.order.create({
        data: {
          cartId,
          customerId,
          totalAmount,
          rozarPayOrderId: razorpayOrder.id,
        },
      });
    });

    return {
      order: createdOrder,
      razorpayOrder,
    };
  }
}

export default OrderService;
