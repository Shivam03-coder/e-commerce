import { Router } from "express";
import { UserAuthController } from "@src/controller/auth.controller";
import { requireAuth } from "@src/middleware/auth.middleware";

const authRouter = Router();

authRouter
  .post("/sign-up", UserAuthController.userSignup)
  .post("/sign-in", UserAuthController.userSignin)
  .post("/logout", requireAuth(), UserAuthController.userLogout)
  .post("/forgot-password", requireAuth(), UserAuthController.forgotPassword)
  .get("/userinfo", requireAuth(), UserAuthController.authenticatedUserInfo);

export default authRouter;
