import { Request, Response } from "express";
import { ApiResponse, AsyncHandler } from "@src/utils/api.utils";
import { AdminService } from "@src/services/admin.service";

export class AdminController {
  static addProductsHandler = AsyncHandler(
    async (req: Request, res: Response): Promise<void> => {
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
        tags,
      } = req.body;

      if (
        !title ||
        !description ||
        !category ||
        !productImage ||
        !material ||
        !sizeStock ||
        !price ||
        !tags ||
        !salePrice
      ) {
        res.status(400);
        throw new Error("Missing required fields");
      }

      if (price <= 0) {
        res.status(400);
        throw new Error("Price must be greater than 0");
      }

      const inventory = Array.isArray(sizeStock)
        ? sizeStock.reduce((total, item) => total + Number(item.stock || 0), 0)
        : 0;

      await AdminService.addProduct({
        title,
        description,
        category,
        productImage,
        material,
        sizeStock,
        price: parseFloat(price),
        salePrice: parseFloat(salePrice),
        inStock,
        inventory,
        tags,
      });

      res.status(201).json(new ApiResponse("Product added successfully"));
    }
  );

  static getProductImageUrlHandler = AsyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const imageUrl = await AdminService.getProductImageUrl(req);
      res.status(201).json(
        new ApiResponse("File URL generated successfully", {
          url: imageUrl,
        })
      );
    }
  );

  static getProductsHandler = AsyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const products = await AdminService.getProducts();
      res
        .status(200)
        .json(new ApiResponse("Products fetched successfully", { products }));
    }
  );

  static deleteProductHandler = AsyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const { id } = req.params;
      await AdminService.deleteProduct(parseInt(id));
      res.status(200).json(new ApiResponse("Product deleted successfully"));
    }
  );

  static updateProductDetailsHandler = AsyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const { id } = req.params;
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
        tags,
      } = req.body;

      if (
        !title ||
        !description ||
        !category ||
        !productImage ||
        !material ||
        !sizeStock ||
        !price ||
        !tags ||
        !salePrice
      ) {
        res.status(400);
        throw new Error("Missing required fields");
      }

      if (price <= 0) {
        res.status(400);
        throw new Error("Price must be greater than 0");
      }

      const inventory = Array.isArray(sizeStock)
        ? sizeStock.reduce((total, item) => total + Number(item.stock || 0), 0)
        : 0;

      await AdminService.updateProduct(parseInt(id), {
        title,
        description,
        category,
        productImage,
        material,
        price: parseFloat(price),
        salePrice: parseFloat(salePrice),
        inStock,
        inventory: parseInt(inventory),
        tags,
        sizeStock,
      });

      res.status(201).json(new ApiResponse("Product updated successfully"));
    }
  );

  static getCustomerDetailsHandler = AsyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const customer = await AdminService.getCustomers();
      res
        .status(201)
        .json(new ApiResponse("Customers fetched successfully", { customer }));
    }
  );

  static deleteCustomerHandler = AsyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const { id } = req.params;
      await AdminService.deleteCustomer(id);
      res.json(new ApiResponse("Customer deleted successfully"));
    }
  );

  static createFeaturedProductHandler = AsyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const { featuredProductImage } = req.body;
      await AdminService.createFeaturedProduct(featuredProductImage);
      res.json(new ApiResponse("Featured Poster Created successfully"));
    }
  );

  static deleteFeaturedProductHandler = AsyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const { id } = req.params;
      await AdminService.deleteFeaturedProduct(id);
      res
        .status(200)
        .json(new ApiResponse("Featured Poster deleted successfully"));
    }
  );

  static getFeaturedProductHandler = AsyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const product = await AdminService.getFeaturedProducts();
      res
        .status(200)
        .json(
          new ApiResponse("Featured Posters fetched successfully", product)
        );
    }
  );

  static getOrdersDetailsHandler = AsyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const formattedOrders = await AdminService.getOrders();
      res
        .status(200)
        .json(new ApiResponse("Orders fetched successfully", formattedOrders));
    }
  );
}
