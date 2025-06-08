import adminRouter from "./admin.routes";
import authRouter from "./auth.routes";
import shopRouter from "./shop.route";

export default [
  {
    path: "auth",
    router: authRouter,
  },
  {
    path: "admin",
    router: adminRouter,
  },
  {
    path: "shop",
    router: shopRouter,
  },
];
