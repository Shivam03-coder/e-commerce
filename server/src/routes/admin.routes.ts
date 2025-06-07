import { Router } from "express";
import { requireAuth } from "@src/middleware/auth.middleware";
import { upload } from "@src/middleware/multer.middleware";
import { AdminController } from "@src/controller/admin.controller";

const adminRouter = Router();

adminRouter
  .post("/product", AdminController.addProducts)
  .get("/product", AdminController.getProducts)
  .delete("/product", requireAuth(), AdminController.deleteProduct)
  .patch("/product", requireAuth(), AdminController.editProductDeatails)
  .post("/product/url", requireAuth(),upload.single("productImage"), AdminController.getProductImageUrl);

export default adminRouter;
