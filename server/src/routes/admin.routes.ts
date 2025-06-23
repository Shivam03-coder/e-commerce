import { Router } from "express";
import { requireAuth } from "@src/middleware/auth.middleware";
import { upload } from "@src/middleware/multer.middleware";
import { AdminController } from "@src/controller/admin.controller";

const adminRouter = Router();

adminRouter
  .post("/product", AdminController.addProductsHandler)
  .get("/product/details", AdminController.getOrdersDetailsHandler)
  .delete("/product/:id", requireAuth, AdminController.deleteProductHandler)
  .patch("/product/:id", requireAuth, AdminController.updateProductDetailsHandler)
  .post("/product/url", requireAuth,upload.single("productImage"), AdminController.getProductImageUrlHandler)
  .get("/customer/details" , requireAuth , AdminController.getCustomerDetailsHandler)
  .delete("/customer/:id", requireAuth, AdminController.deleteCustomerHandler)
  .get("/featured/product", requireAuth, AdminController.getFeaturedProductHandler)
  .post("/featured/product", requireAuth, AdminController.createFeaturedProductHandler)
  .delete("/featured/product/:id", requireAuth, AdminController.deleteFeaturedProductHandler)
  .get("/orders/details" , requireAuth,AdminController.getOrdersDetailsHandler)

export default adminRouter;
