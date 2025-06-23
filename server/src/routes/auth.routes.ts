import { Router } from "express";
import { AuthController } from "@src/controller/auth.controller";
import { requireAuth } from "@src/middleware/auth.middleware";

const authRouter = Router();

authRouter
  .post("/sign-up", AuthController.userSignupHandler)
  .post("/sign-in", AuthController.userSigninHandler)
  .post("/logout", requireAuth, AuthController.userLogoutHandler)
  .post("/forgot-password", requireAuth, AuthController.forgotPasswordHandler)
  .get("/userinfo", requireAuth, AuthController.authenticatedUserInfoHandler);

export default authRouter;
