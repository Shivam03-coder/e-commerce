import { Response } from "express";
import { appEnvConfigs } from "./configs";
import { ApiResponse } from "./utils/server-functions";
import App from "./app";
const appInstance = new App();
const expressApp = appInstance.getAppInstance();
import "module-alias/register";

(() => {
  try {
    expressApp.get("/", (_req, res: Response) => {
      res.json(
        new ApiResponse(
          200,
          "Welcome to the server developed by Shivam Anand 🚀"
        )
      );
    });
    const port = appEnvConfigs.PORT || 3000;
    const server = expressApp.listen(port, () => {
      console.log(`✅ Server started at http://localhost:${port}`);
    });

    const gracefulShutdown = async (signal: string) => {
      console.log(`⚠️  Received ${signal}. Shutting down gracefully...`);
      server.close(() => {
        console.log("🛑 Server closed");
        process.exit(0);
      });
    };

    process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
    process.on("SIGINT", () => gracefulShutdown("SIGINT"));
  } catch (error) {
    console.error("❌ Server startup failed:", error);
    process.exit(1);
  }
})();
