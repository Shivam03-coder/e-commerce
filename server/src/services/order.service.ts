import { envs } from "@src/configs/envs.config";
import { getOptions, razorpay } from "@src/configs/rozar-pay.config";
import { db } from "@src/db";
import { findCartById } from "@src/db/raw.query";
import { cartItem } from "@src/types/global.types";
import { NotFoundError, ValidationError } from "@src/utils/error.utils";
import crypto from "crypto";

interface CreateOrderParams {
  cartId: string;
  customerId: string;
  totalAmount: number;
  name: string;
  email: string;
  phoneNumber: string;
}

interface VerifyPaymentParams {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
  cartId: string;
}

interface OrderDetails {
  userId: string;
  orderid?: string;
  cartItems: cartItem[];
}

class OrderService {
  private static async createOrderDetails(
    data: cartItem[],
    orderId: string
  ): Promise<void> {
    try {
      const itemsToInsert = data.flatMap((item) =>
        item.sizeAndQuantity.map((sizeQty) => ({
          title: item.title,
          price: item.price,
          size: sizeQty.size,
          quantity: sizeQty.quantity,
          productImage: item.productImage,
          category: item.category,
          material: item.material,
          orderId,
        }))
      );

      if (itemsToInsert.length === 0) return;

      await db.orderedItem.createMany({
        data: itemsToInsert,
      });
    } catch (error) {
      console.error("Error creating order details:", error);
      throw new Error("Failed to create order details");
    }
  }

  private static async getCartDetails(
    cartId: string,
    razorpay_order_id: string
  ): Promise<OrderDetails> {
    try {
      const [existingCart, order] = await Promise.all([
        db.cart.findFirst({
          where: { id: cartId },
        }),
        db.order.findFirst({
          where: { rozarPayOrderId: razorpay_order_id },
        }),
      ]);

      if (!existingCart) {
        throw new NotFoundError("Cart not found");
      }

      const cartItems = await db.cartItem.findMany({
        where: { cartId: existingCart.id },
        select: {
          sizesAndQuantity: {
            select: {
              size: true,
              quantity: true,
            },
          },
          product: {
            select: {
              title: true,
              productImage: true,
              category: true,
              material: true,
              price: true,
            },
          },
        },
      });

      const mappedCartItems: cartItem[] = cartItems.map(
        ({ product, sizesAndQuantity }) => ({
          ...product,
          sizeAndQuantity: sizesAndQuantity,
        })
      );

      return {
        userId: existingCart.userId,
        orderid: order?.id,
        cartItems: mappedCartItems,
      };
    } catch (error) {
      console.error("Error getting cart details:", error);
      throw new Error("Failed to get cart details");
    }
  }

  static async createOrders(data: CreateOrderParams) {
    try {
      const { cartId, customerId, totalAmount, name, email, phoneNumber } =
        data;

      await findCartById(cartId);

      const options = getOptions(totalAmount, "INR", `${cartId}`);

      const razorpayOrder = await razorpay.orders.create(options);

      if (!razorpayOrder.id || razorpayOrder.status !== "created") {
        throw new Error("Failed to create Razorpay order");
      }

      const createdOrder = await db.$transaction(async (tx) => {
        return await tx.order.create({
          data: {
            customerId,
            totalAmount,
            rozarPayOrderId: razorpayOrder.id,
          },
        });
      });

      return {
        orderId: createdOrder.rozarPayOrderId,
        totalAmount: createdOrder.totalAmount,
        user: {
          name,
          email,
          contact: phoneNumber,
        },
      };
    } catch (error) {
      console.error("Error creating order:", error);
      throw new Error("Failed to create order");
    }
  }

  static async verifyPayment(data: VerifyPaymentParams): Promise<void> {
    try {
      const {
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
        cartId,
      } = data;

      // Verify Razorpay signature first
      const body = `${razorpay_order_id}|${razorpay_payment_id}`;
      const expectedSignature = crypto
        .createHmac("sha256", envs.RAZORPAY_KEY_SECRET)
        .update(body)
        .digest("hex");

      if (expectedSignature !== razorpay_signature) {
        console.error("❌ Razorpay signature verification failed");
        throw new ValidationError("Invalid signature");
      }

      const orderedItemsDetails = await this.getCartDetails(
        cartId,
        razorpay_order_id
      );

      if (!orderedItemsDetails.orderid) {
        throw new NotFoundError("Order not found");
      }

      // Save OrderDetails
      await this.createOrderDetails(
        orderedItemsDetails.cartItems,
        orderedItemsDetails.orderid
      );

      // Clean up cart and update user
      await db.$transaction([
        db.cartItem.deleteMany({
          where: { cartId },
        }),
        db.cart.delete({
          where: { id: cartId },
        }),
        db.user.update({
          where: { id: orderedItemsDetails.userId },
          data: { cartProductCount: 0 },
        }),
        db.order.update({
          where: { id: orderedItemsDetails.orderid },
          data: {
            rozarPayOrderId: razorpay_order_id,
            paymentId: razorpay_payment_id,
            paymentStatus: "COMPLETED",
            orderStatus: "PROCESSING",
          },
        }),
      ]);

      console.log("✅ Razorpay payment verified successfully");
    } catch (error) {
      console.error("Error verifying payment:", error);
      throw error;
    }
  }
}

export default OrderService;
