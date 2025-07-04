import adminRouter from "./admin.routes";
import authRouter from "./auth.routes";
import cartRouter from "./cart.routes";
import orderRouter from "./order.routes";
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
  {
    path: "cart",
    router: cartRouter,
  },
  {
    path: "orders",
    router: orderRouter,
  },
];
