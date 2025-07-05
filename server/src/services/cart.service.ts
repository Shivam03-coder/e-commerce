import { SockSize } from "@prisma/client";
import redis from "@src/configs/redis.config";
import { db } from "@src/db";
import {
  DatabaseError,
  NotFoundError,
  ValidationError,
} from "@src/utils/error.utils";

class CartService {
static async getCartItems(userId: string) {
  try {
    const cart = await db.cart.findUnique({
      where: { userId },
      select: {
        cartStatus: true,
        items: {
          include: {
            product: {
              include: {
                sizeStocks: {
                  where: { stock: { gt: 0 } },
                },
              },
            },
            sizesAndQuantity: true,
          },
        },
      },
    });

    if (!cart?.cartStatus) {
      return [];
    }

    return cart.items.map((item) => {
      const availableSizes = new Set(
        item.product.sizeStocks.map((stock) => stock.size)
      );

      const validSizes = item.sizesAndQuantity.filter((sizeQty) =>
        availableSizes.has(sizeQty.size)
      );

      return {
        cartStatus: cart.cartStatus,
        productId: item.product.id.toString(),
        name: item.product.title,
        price: item.product.price,
        image: item.product.productImage,
        material: item.product.material,
        selectedSizes: validSizes.map((sizeQty) => ({
          size: sizeQty.size,
          quantity: sizeQty.quantity,
        })),
        totalQuantity: validSizes.reduce(
          (sum, sizeQty) => sum + sizeQty.quantity,
          0
        ),
        isAvailable: validSizes.length > 0,
      };
    });
  } catch (error) {
    console.error("Error fetching cart items:", error);
    throw new Error("Failed to retrieve cart items");
  }
}


  // Type definitions (should be in your types file)

  static async removeItemFormCart(userId: string, productId: number) {
    const cart = await db.cart.findUnique({
      where: { userId },
      select: { id: true },
    });

    if (!cart) {
      throw new NotFoundError("Cart not found");
    }

    const key = `cart:user:${userId}`;
    const alreadyExists = await redis.sismember(key, productId);

    if (alreadyExists) {
      await redis.srem(key, productId);
    }

    const deleted = await db.cartItem.deleteMany({
      where: {
        cartId: cart.id,
        productId,
      },
    });

    if (deleted.count === 0) {
      throw new NotFoundError("Item not found in cart");
    }

    // 🔽 decrement cartProductCount when item removed
    await db.user.update({
      where: { id: userId },
      data: {
        cartProductCount: {
          decrement: 1,
        },
      },
    });

    return {
      message: `${deleted.count} item(s) removed from cart`,
    };
  }

  static async addToCart(
    userId: string,
    productId: number,
    orders: Array<{ size: SockSize; quantity: number }>
  ) {
    if (!productId || !orders || orders.length === 0) {
      throw new ValidationError(
        "Product ID and at least one order are required"
      );
    }

    try {
      const product = await db.product.findUnique({
        where: { id: productId },
        include: { sizeStocks: true },
      });

      if (!product) {
        throw new NotFoundError("Product not found");
      }

      for (const order of orders) {
        const sizeStock = product.sizeStocks.find((s) => s.size === order.size);
        if (!sizeStock) {
          throw new ValidationError(
            `Size ${order.size} is not available for this product`
          );
        }
        if (sizeStock.stock < order.quantity) {
          throw new ValidationError(
            `Only ${sizeStock.stock} items available in ${order.size} size`
          );
        }
        if (order.quantity <= 0) {
          throw new ValidationError("Quantity must be a positive number");
        }
      }

      const cartId = await db.$transaction(async (tx) => {
        let cart = await tx.cart.findFirst({
          where: { userId },
          include: { items: true },
        });

        if (!cart) {
          cart = await tx.cart.create({
            data: { userId },
            include: { items: true },
          });
        }

        let cartItem = cart.items.find((item) => item.productId === productId);

        if (!cartItem) {
          cartItem = await tx.cartItem.create({
            data: {
              cartId: cart.id,
              productId,
            },
          });
        }

        for (const order of orders) {
          const existingSizeQuantity =
            await tx.cartItemSizeAndQuantity.findFirst({
              where: {
                cartItemId: cartItem.id,
                size: order.size,
              },
            });

          if (existingSizeQuantity) {
            await tx.cartItemSizeAndQuantity.update({
              where: { id: existingSizeQuantity.id },
              data: {
                quantity: existingSizeQuantity.quantity + order.quantity,
              },
            });
          } else {
            await tx.cartItemSizeAndQuantity.create({
              data: {
                cartItemId: cartItem.id,
                quantity: order.quantity,
                size: order.size,
              },
            });
          }

          await tx.sizeStock.updateMany({
            where: {
              productId,
              size: order.size,
            },
            data: {
              stock: { decrement: order.quantity },
            },
          });
        }

        return cart.id;
      });

      return {
        cartId,
      };
    } catch (error) {
      if (error instanceof NotFoundError || error instanceof ValidationError) {
        throw error;
      }
      throw new DatabaseError("Failed to add product to cart");
    }
  }
}

export default CartService;
