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
                size: true,
                material: true,
              },
            },
          },
        },
      },
    });

    const cartItems = carts.flatMap((cart) =>
      cart.items.map((item) => ({
        id: item.product.id.toString(),
        name: item.product.title,
        price: item.product.price,
        quantity: item.quantity,
        image: item.product.productImage,
        size: item.product.size,
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

    const deleted = await db.cartItem.deleteMany({
      where: {
        cartId: cart.id,
        productId,
      },
    });

    if (deleted.count === 0) {
      throw new NotFoundError("Item not found in cart");
    }

    return {
      message: `${deleted.count} item(s) removed from cart`,
    };
  }
}

export default CartService;
