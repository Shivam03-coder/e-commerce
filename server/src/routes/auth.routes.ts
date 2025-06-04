import { Router } from "express";
import { UserAuthController } from "@src/controller/auth.controller";
import { requireAuth } from "@src/middleware/auth.middleware";
const authRouter = Router();

authRouter
  .post("/sign-up", UserAuthController.UserSignup)
  .post("/sign-in", UserAuthController.UserSignin)
  .post("/logout", requireAuth(), UserAuthController.UserLogout)

export default authRouter;
