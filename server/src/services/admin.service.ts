import { MaterialType, ProductCategory, SockSize } from "@prisma/client";
import { db } from "@src/db";
import CloudinaryService from "@src/libs/cloudinary";
import { ProductType } from "@src/types/admin.types";
import { ValidationError } from "@src/utils/error.utils";
import { GlobalUtils } from "@src/utils/global.utils";

export class AdminService {
  static async addProduct(productData: ProductType) {
    const {
      title,
      description,
      category,
      productImage,
      material,
      sizeStock,
      price,
      salePrice,
      inStock,
      inventory,
      tags,
    } = productData;



    const product = await db.product.create({
      data: {
        title,
        description,
        category,
        tags: JSON.stringify(tags),
        productImage,
        material,
        price,
        salePrice,
        inStock: inStock !== undefined ? inStock : inventory > 0,
        inventory,
      },
    });

    if (Array.isArray(sizeStock) && sizeStock.length > 0) {
      await db.sizeStock.createMany({
        data: sizeStock.map((item) => ({
          size: item.size,
          stock: item.stock,
          productId: product.id,
        })),
      });
    }

    return product;
  }

  static async getProducts() {
    return await db.product.findMany({
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        title: true,
        description: true,
        category: true,
        tags: true,
        productImage: true,
        material: true,
        sizeStocks: true,
        inventory: true,
        price: true,
        salePrice: true,
        inStock: true,
        _count: {
          select: {
            Review: true,
          },
        },
      },
    });
  }

  static async deleteProduct(id: number) {
    const product = await db.product.findUnique({
      where: { id },
    });

    if (!product) throw new ValidationError("Product not found");

    return await db.product.delete({
      where: { id },
    });
  }

static async updateProduct(id: number, productData: ProductType) {
  const {
    title,
    description,
    category,
    productImage,
    material,
    price,
    salePrice,
    inStock,
    inventory,
    tags,
    sizeStock,
  } = productData;

  return await db.$transaction(async (tx) => {
    // 1. Update the product
    const updatedProduct = await tx.product.update({
      where: { id },
      data: {
        title,
        description,
        category,
        tags: JSON.stringify(tags),
        productImage,
        material,
        price,
        salePrice,
        inStock: inStock !== undefined ? inStock : inventory > 0,
        inventory,
      },
    });

    // 2. Remove existing sizeStock entries
    await tx.sizeStock.deleteMany({
      where: { productId: id },
    });

    // 3. Add updated sizeStock entries
    if (Array.isArray(sizeStock) && sizeStock.length > 0) {
      await tx.sizeStock.createMany({
        data: sizeStock.map((item) => ({
          productId: id,
          size: item.size,
          stock: item.stock,
        })),
      });
    }

    return updatedProduct;
  });
}

  static async getCustomers() {
    return await db.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        phoneNumber: true,
        userAddress: {
          select: {
            city: true,
            state: true,
          },
        },
      },
    });
  }

  static async deleteCustomer(id: string) {
    const customer = await db.user.findUnique({
      where: { id },
    });

    if (!customer) throw new ValidationError("Customer not found");

    return await db.user.delete({
      where: { id },
    });
  }

  static async createFeaturedProduct(featuredProductImage: string) {
    return await db.featuredProducts.create({
      data: { featuredProductImage },
    });
  }

  static async deleteFeaturedProduct(id: string) {
    return await db.featuredProducts.delete({
      where: { id },
    });
  }

  static async getFeaturedProducts() {
    return await db.featuredProducts.findMany({
      select: {
        id: true,
        featuredProductImage: true,
      },
    });
  }

  static async getOrders() {
    const orders = await db.order.findMany({
      select: {
        id: true,
        customer: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        cart: {
          select: {
            items: {
              select: {
                sizesAndQuantity: true,
                product: {
                  select: {
                    id: true,
                    title: true,
                    price: true,
                    productImage: true,
                  },
                },
              },
            },
          },
        },
        orderStatus: true,
        orderDate: true,
        paymentStatus: true,
        totalAmount: true,
      },
      orderBy: {
        orderDate: "desc",
      },
    });

    return orders.map((order) => ({
      id: order.id,
      customer: order.customer,
      status: order.orderStatus,
      paymentStatus: order.paymentStatus,
      date: order.orderDate,
      total: order.totalAmount,
      products: order.cart.items.map((item) => ({
        id: item.product.id,
        name: item.product.title,
        price: item.product.price,
        image: item.product.productImage,
        // quantity: item.quantity,
      })),
    }));
  }

  static async getProductImageUrl(req: any) {
    const imageUrl = await CloudinaryService.getImageUrl(req);
    if (!imageUrl) throw new ValidationError("Failed to generate image URL");
    return imageUrl;
  }
}
