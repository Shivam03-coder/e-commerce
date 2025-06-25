import { Prisma, Product, Review } from "@prisma/client";
import rc from "@src/configs/redis.config";
import { db } from "@src/db";
import {
  NotFoundError,
  ValidationError,
  DatabaseError,
} from "@src/utils/error.utils";

export class ShopService {
  private static async favouriteProductCount(userId: string) {
    try {
      await db.user.update({
        where: {
          id: userId,
        },
        data: {
          favoriteProductCount: {
            increment: 1,
          },
        },
      });
    } catch (error) {
      throw error;
    }
  }

  static async getAllProducts() {
    try {
      return await db.product.findMany({
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          title: true,
          description: true,
          category: true,
          tags: true,
          productImage: true,
          material: true,
          price: true,
          salePrice: true,
          inStock: true,
          inventory: true,
          sizeStocks: true,
          _count: { select: { Review: true } },
        },
      });
    } catch (error) {
      throw new DatabaseError("Failed to fetch products");
    }
  }

  static async getProductById(productId: number) {
    if (!productId) {
      throw new ValidationError("Product ID is required");
    }

    try {
      const product = await db.product.findUnique({
        where: { id: productId },
        select: {
          id: true,
          title: true,
          description: true,
          category: true,
          tags: true,
          productImage: true,
          material: true,
          sizeStocks: true,
          price: true,
          salePrice: true,
          inStock: true,
          inventory: true,
          _count: { select: { Review: true } },
        },
      });

      if (!product) {
        throw new NotFoundError("Product not found");
      }

      return product;
    } catch (error) {
      if (error instanceof NotFoundError) throw error;
      throw new DatabaseError("Failed to fetch product");
    }
  }

  static async addToCart(userId: string, productId: number, quantity: number) {
    if (!productId || !quantity) {
      throw new ValidationError("Product ID and quantity are required");
    }

    if (quantity <= 0) {
      throw new ValidationError("Quantity must be a positive number");
    }

    try {
      const product = await db.product.findUnique({
        where: { id: productId },
        select: { id: true, inventory: true, inStock: true },
      });

      if (!product) {
        throw new NotFoundError("Product not found");
      }

      if (!product.inStock || product.inventory < quantity) {
        throw new ValidationError(
          product.inStock
            ? `Only ${product.inventory} items available in stock`
            : "Product is currently out of stock"
        );
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

        const existingItem = cart.items.find(
          (item) => item.productId === productId
        );

        if (existingItem) {
          // Update quantity
          await tx.cartItem.update({
            where: { id: existingItem.id },
            data: { quantity: existingItem.quantity + quantity },
          });
        } else {
          // Add new item
          await tx.cartItem.create({
            data: { cartId: cart.id, productId, quantity },
          });
        }

        // Update inventory
        await tx.product.update({
          where: { id: productId },
          data: {
            inventory: { decrement: quantity },
            inStock: product.inventory - quantity > 0,
          },
        });
      });
    } catch (error) {
      if (error instanceof NotFoundError || error instanceof ValidationError) {
        throw error;
      }
      throw new DatabaseError("Failed to add product to cart");
    }
  }

  static async addReview(
    userId: string,
    productId: number,
    message: string,
    stars: number
  ) {
    if (!productId || !message || !stars) {
      throw new ValidationError("Product ID, message and stars are required");
    }

    if (stars < 1 || stars > 5) {
      throw new ValidationError("Stars must be between 1 and 5");
    }

    try {
      return await db.review.create({
        data: { productId, message, stars, userId },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2003") {
          throw new NotFoundError("Product not found");
        }
      }
      throw new DatabaseError("Failed to create review");
    }
  }

  static async getProductReviews(productId: number) {
    if (!productId) {
      throw new ValidationError("Product ID is required");
    }

    try {
      return await db.review.findMany({
        where: { productId },
        select: {
          message: true,
          createdAt: true,
          stars: true,
          user: { select: { email: true, name: true } },
        },
      });
    } catch (error) {
      throw new DatabaseError("Failed to fetch reviews");
    }
  }

  private static async addToFavorites(userId: string, productId: number) {
    try {
      const favorite = await db.$transaction([
        db.favoriteProduct.create({
          data: { userId, productId },
        }),
        db.user.update({
          where: { id: userId },
          data: {
            favoriteProductCount: {
              increment: 1,
            },
          },
        }),
      ]);

      return favorite[0];
    } catch (error: unknown) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2002"
      ) {
        throw new DatabaseError("Product is already in favorites");
      }
      throw error;
    }
  }

  private static async isFavorited(userId: string, productId: number) {
    try {
      const favorite = await db.favoriteProduct.findUnique({
        where: {
          userId_productId: {
            userId,
            productId,
          },
        },
      });
      return !!favorite;
    } catch {
      throw new DatabaseError("Failed to check favorite status");
    }
  }
  private static async removeFromFavorites(userId: string, productId: number) {
    try {
      const result = await db.$transaction([
        db.favoriteProduct.delete({
          where: {
            userId_productId: {
              userId,
              productId,
            },
          },
        }),
        db.user.update({
          where: { id: userId },
          data: {
            favoriteProductCount: {
              decrement: 1,
            },
          },
        }),
      ]);

      return result[0]; // return deleted favorite
    } catch (error: unknown) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2025"
      ) {
        throw new DatabaseError("Favorite not found");
      }
      throw error;
    }
  }

  static async toggleFavorite(userId: string, productId: number) {
    try {
      const isFavorited = await this.isFavorited(userId, productId);

      if (isFavorited) {
        await this.removeFromFavorites(userId, productId);
        return {
          message: "Product removed from favorites",
        };
      } else {
        await this.addToFavorites(userId, productId);
        return {
          message: "Product added to favorites",
        };
      }
    } catch (error) {
      if (error instanceof DatabaseError) {
        throw new DatabaseError(error.message);
      }
      throw new ValidationError("Failed to update favorites");
    }
  }

  static async getUserFavorites(userId: string) {
    try {
      const favorites = await db.favoriteProduct.findMany({
        where: {
          userId,
        },
        include: {
          product: {
            select: {
              id: true,
              title: true,
              description: true,
              category: true,
              tags: true,
              productImage: true,
              material: true,
              price: true,
              salePrice: true,
              inStock: true,
              inventory: true,
              sizeStocks: true,
              _count: { select: { Review: true } },
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });
      return favorites;
    } catch (error: unknown) {
      throw new DatabaseError("Failed to fetch favorites");
    }
  }
}
