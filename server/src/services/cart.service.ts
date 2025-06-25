import { SockSize } from "@prisma/client";
import redis from "@src/configs/redis.config";
import { db } from "@src/db";
import {
  DatabaseError,
  NotFoundError,
  ValidationError,
} from "@src/utils/error.utils";

class CartService {
  static async increaseItem(userId: string, productId: number) {
    const cart = await db.cart.findUnique({
      where: { userId },
      select: { id: true },
    });

    if (!cart) {
      throw new NotFoundError("Cart not found");
    }

    const existingItem = await db.cartItem.findFirst({
      where: {
        cartId: cart.id,
        productId,
      },
    });

    if (existingItem) {
      await db.cartItem.update({
        where: { id: existingItem.id },
        data: {
          quantity: { increment: 1 },
        },
      });
    } else {
      await db.cartItem.create({
        data: {
          cartId: cart.id,
          productId,
          quantity: 1,
        },
      });

      await db.user.update({
        where: { id: userId },
        data: {
          cartProductCount: {
            increment: 1,
          },
        },
      });
    }

    return {
      message: "Item added or quantity increased",
    };
  }

  static async getCartItems(userId: string) {
    const cart = await db.cart.findUnique({
      where: {
        userId,
      },
      include: {
        items: {
          include: {
            product: {
              include: {
                sizeStocks: {
                  where: {
                    stock: {
                      gt: 0,
                    },
                  },
                  select: {
                    size: true,
                    stock: true,
                  },
                },
              },
            },
            sizesAndQuantity: true, // Include the size-quantity relations
          },
        },
      },
    });

    if (!cart) {
      return [];
    }

    const cartItems = cart.items.flatMap((item) => {
      // Group all size quantities for this cart item
      const sizeQuantities = item.sizesAndQuantity.map((sq) => ({
        size: sq.size,
        quantity: sq.quantity,
      }));

      // Calculate total quantity across all sizes
      const totalQuantity = sizeQuantities.reduce(
        (sum, sq) => sum + sq.quantity,
        0
      );

      return {
        productId: item.product.id.toString(),
        name: item.product.title,
        price: item.product.price,
        quantity: totalQuantity, // Total quantity across all sizes
        image: item.product.productImage,
        material: item.product.material,
        availableSizes: item.product.sizeStocks.map((s) => ({
          size: s.size,
          stock: s.stock,
        })),
        sizeQuantities, // Include individual size quantities
      };
    });

    return cartItems;
  }
  static async removeItem(userId: string, productId: number) {
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

      // Validate all orders before processing
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

      await db.$transaction(async (tx) => {
        // Find or create cart
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

        // Find existing cart item for this product
        let cartItem = cart.items.find((item) => item.productId === productId);

        if (!cartItem) {
          // Create new cart item if it doesn't exist
          cartItem = await tx.cartItem.create({
            data: {
              cartId: cart.id,
              productId,
            },
          });
        }

        // Add or update size quantities
        for (const order of orders) {
          const existingSizeQuantity =
            await tx.cartItemSizeAndQuantity.findFirst({
              where: {
                cartItemId: cartItem.id,
                size: order.size,
              },
            });

          if (existingSizeQuantity) {
            // Update existing size quantity
            await tx.cartItemSizeAndQuantity.update({
              where: { id: existingSizeQuantity.id },
              data: {
                quantity: existingSizeQuantity.quantity + order.quantity,
              },
            });
          } else {
            // Create new size quantity entry
            await tx.cartItemSizeAndQuantity.create({
              data: {
                cartItemId: cartItem.id,
                quantity: order.quantity,
                size: order.size,
              },
            });
          }

          // Update size stock
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
      });
    } catch (error) {
      if (error instanceof NotFoundError || error instanceof ValidationError) {
        throw error;
      }
      throw new DatabaseError("Failed to add product to cart");
    }
  }

  static async removeFromCart(userId: string, productId: number) {
    const cart = await db.cart.findUnique({
      where: { userId },
      select: { id: true },
    });

    if (!cart) {
      throw new NotFoundError("Cart not found for user");
    }

    const deletedItem = await db.cartItem.deleteMany({
      where: {
        cartId: cart.id,
        productId,
      },
    });

    return deletedItem.count > 0;
  }
}

export default CartService;
