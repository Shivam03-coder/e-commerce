import { MaterialType, ProductCategory, SockSize } from "@prisma/client";
import { db } from "@src/db";
import { GlobalUtils } from "@src/global";
import CloudinaryService from "@src/services/cloudinary";
import {
  ApiError,
  ApiResponse,
  AsyncHandler,
} from "@src/utils/server-functions";
import { Request, Response } from "express";

export class AdminController {
  public static addProducts = AsyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const {
        title,
        description,
        category,
        productImage,
        material,
        size,
        price,
        salePrice,
        inStock,
        inventory,
        tags,
      } = req.body;

      console.log(req.body);

      if (
        !title ||
        !description ||
        !category ||
        !productImage ||
        !material ||
        !size ||
        !price ||
        !tags ||
        !salePrice ||
        inventory === undefined
      ) {
        res.status(400);
        throw new Error("Missing required fields");
      }

      if (price <= 0) {
        res.status(400);
        throw new Error("Price must be greater than 0");
      }

      if (inventory < 0) {
        res.status(400);
        throw new Error("Inventory cannot be negative");
      }
      GlobalUtils.validateEnum("category", category, ProductCategory);
      GlobalUtils.validateEnum("material", material, MaterialType);
      GlobalUtils.validateEnum("size", size, SockSize);

      await db.product.create({
        data: {
          title,
          description,
          category,
          tags: JSON.stringify(tags),
          productImage,
          material,
          size,
          price: parseFloat(price),
          salePrice: parseFloat(price),
          inStock: inStock !== undefined ? inStock : inventory > 0,
          inventory: parseInt(inventory),
        },
      });

      res.status(201).json(new ApiResponse(200, "Product added succesfully"));
    }
  );

  public static getProductImageUrl = AsyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      try {
        const imageUrl = await GlobalUtils.getImageUrl(req);

        if (!imageUrl) {
          throw new ApiError(400, "Failed to generate image URL");
        }

        console.log("🚀 ~ getProductImageUrl ~ imageUrl:", imageUrl);

        res.status(201).json(
          new ApiResponse(201, "File URL generated successfully", {
            url: imageUrl,
          })
        );
      } catch (error) {
        console.error("❌ Error generating image URL:", error);
        throw new ApiError(
          500,
          "Internal server error while generating file URL"
        );
      }
    }
  );

  public static getProducts = AsyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const products = await db.product.findMany({
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
          size: true,
          price: true,
          salePrice: true,
          inStock: true,
          inventory: true,
          _count: {
            select: {
              Review: true,
            },
          },
        },
      });

      res.json(
        new ApiResponse(200, "Products fetched succesfully", { products })
      );
    }
  );

  public static deleteProduct = AsyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const { id } = req.params;

      const product = await db.product.findUnique({
        where: {
          id: parseInt(id),
        },
      });

      if (!product) throw new ApiError(401, "Product not found");

      await db.product.delete({
        where: {
          id: product.id,
        },
      });
      res.json(new ApiResponse(200, "Product deleted succesfully"));
    }
  );

  public static updateProductDetails = AsyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const { id } = req.params;
      console.log(id);
      const {
        title,
        description,
        category,
        productImage,
        material,
        size,
        price,
        salePrice,
        inStock,
        inventory,
        tags,
      } = req.body;

      if (
        !title ||
        !description ||
        !category ||
        !productImage ||
        !material ||
        !size ||
        !price ||
        !tags ||
        inventory === undefined ||
        !salePrice
      )
        throw new Error("Missing required fields");

      if (price <= 0) throw new Error("Price must be greater than 0");
      if (inventory < 0) throw new Error("Inventory cannot be negative");

      GlobalUtils.validateEnum("category", category, ProductCategory);
      GlobalUtils.validateEnum("material", material, MaterialType);
      GlobalUtils.validateEnum("size", size, SockSize);

      await db.product.update({
        where: {
          id: parseInt(id),
        },
        data: {
          title,
          description,
          category,
          tags: JSON.stringify(tags),
          productImage,
          material,
          size,
          price: parseFloat(price),
          salePrice: parseFloat(price),
          inStock: inStock !== undefined ? inStock : inventory > 0,
          inventory: parseInt(inventory),
        },
      });

      res
        .status(201)
        .json(new ApiResponse(200, "Product updated successfully"));
    }
  );

  public static getCustomerDetails = AsyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const customer = await db.user.findMany({
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
      res
        .status(201)
        .json(
          new ApiResponse(200, "Product updated successfully", { customer })
        );
    }
  );

  public static deleteCustomer = AsyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const { id } = req.params;

      const customer = await db.user.findUnique({
        where: {
          id,
        },
      });

      if (!customer) throw new ApiError(401, "Customer not found");

      await db.user.delete({
        where: {
          id: customer.id,
        },
      });
      res.json(new ApiResponse(200, "Customer deleted succesfully"));
    }
  );

  public static createFeaturedProduct = AsyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      console.log(req.body);
      const { featuredProductImage } = req.body;

      await db.featuredProducts.create({
        data: {
          featuredProductImage,
        },
      });
      res.json(new ApiResponse(200, "Featured Poster Created succesfully"));
    }
  );

  public static deleteFeaturedProduct = AsyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const { id } = req.params;
      await db.featuredProducts.delete({
        where: {
          id,
        },
      });
      res.json(new ApiResponse(200, "Featured Poster deleted succesfully"));
    }
  );

  public static getFeaturedProduct = AsyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const product = await db.featuredProducts.findMany({
        select: {
          id: true,
          featuredProductImage: true,
        },
      });
      res.json(
        new ApiResponse(200, "Featured Poster deleted succesfully", product)
      );
    }
  );

  public static getOrdersDetails = AsyncHandler(
    async (req: Request, res: Response): Promise<void> => {
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
                  quantity: true,
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

      const formattedOrders = orders.map((order) => ({
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
          quantity: item.quantity,
        })),
      }));

      res.json(
        new ApiResponse(200, "Orders fetched successfully", formattedOrders)
      );
    }
  );
}
