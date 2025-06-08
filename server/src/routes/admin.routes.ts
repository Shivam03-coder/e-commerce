import { Router } from "express";
import { requireAuth } from "@src/middleware/auth.middleware";
import { upload } from "@src/middleware/multer.middleware";
import { AdminController } from "@src/controller/admin.controller";

const adminRouter = Router();

adminRouter
  .post("/product", AdminController.addProducts)
  .get("/product/details", AdminController.getProducts)
  .delete("/product/:id", requireAuth(), AdminController.deleteProduct)
  .patch("/product/:id", requireAuth(), AdminController.updateProductDetails)
  .post("/product/url", requireAuth(),upload.single("productImage"), AdminController.getProductImageUrl)
  .get("/customer/details" , requireAuth() , AdminController.getCustomerDetails)
  .delete("/customer/:id", requireAuth(), AdminController.deleteCustomer)
  .get("/featured/product", requireAuth(), AdminController.getFeaturedProduct)
  .post("/featured/product", requireAuth(), AdminController.createFeaturedProduct)
  .delete("/featured/product/:id", requireAuth(), AdminController.deleteFeaturedProduct)
  .get("/orders/details" , requireAuth(),AdminController.getOrdersDetails)

export default adminRouter;
