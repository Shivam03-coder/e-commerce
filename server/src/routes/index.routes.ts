import adminRouter from "./admin.routes";
import authRouter from "./auth.routes";

export default [
  {
    path: "auth",
    router: authRouter,
  },
  {
    path: "admin",
    router: adminRouter,
  },
];
