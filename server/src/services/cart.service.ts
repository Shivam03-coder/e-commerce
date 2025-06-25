import { SockSize } from "@prisma/client";
import redis from "@src/configs/redis.config";
import { db } from "@src/db";
import { NotFoundError } from "@src/utils/error.utils";

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
    const carts = await db.cart.findMany({
      where: {
        userId,
      },
      select: {
        items: {
          select: {
            quantity: true,
            product: {
              select: {
                id: true,
                title: true,
                price: true,
                productImage: true,
                material: true,
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
          },
        },
      },
    });

    const cartItems = carts.flatMap((cart) =>
      cart.items.map((item) => ({
        productId: item.product.id.toString(),
        name: item.product.title,
        price: item.product.price,
        quantity: item.quantity,
        image: item.product.productImage,
        material: item.product.material,
        availableSizes: item.product.sizeStocks.map((s) => ({
          size: s.size,
          stock: s.stock,
        })),
      }))
    );

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
}

export default CartService;
