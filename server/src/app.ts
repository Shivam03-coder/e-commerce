// src/app.ts
import cors from "cors";
import express, {
  Application,
  NextFunction,
  Request,
  Response,
  Router,
} from "express";
import morgan from "morgan";
import helmet from "helmet";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import swaggerUi from "swagger-ui-express";
import swaggerDocument from "@src/scripts/swagger-output.json";
import { Server } from "http";
import { appEnvConfigs } from "./configs";
import { ApiError } from "./utils/server-functions";
import routes from "./routes/index.routes";

interface AppOptions {
  port?: number;
  serveSwagger?: boolean;
}

interface Route {
  path: string;
  router: Router;
}

class App {
  private readonly app: Application;
  private server?: Server;
  private readonly port: number;
  private readonly serveSwagger: boolean;

  constructor(options?: AppOptions) {
    this.app = express();
    this.port = options?.port || Number(appEnvConfigs.PORT) || 3000;
    this.serveSwagger = options?.serveSwagger ?? true;

    this.initializeMiddlewares();
    this.initializeRoutes();
    this.initializeSwaggerUI();
    this.initializeErrorHandler();
  }

  private initializeMiddlewares(): void {
    this.app.use(helmet());
    this.app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
    this.app.use(
      cors({
        origin: appEnvConfigs.NEXT_APP_URI,
        credentials: true,
        methods: ["GET", "POST", "DELETE", "PUT", "PATCH", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"],
      })
    );
    this.app.use(morgan("combined"));
    this.app.use(express.json());
    this.app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));
    this.app.use(cookieParser());
    this.app.enable("trust proxy");
  }

  private initializeRoutes(): void {
    (routes as Route[]).forEach((route) => {
      const fullPath = `/api/v1/${route.path}`;
      this.app.use(fullPath, route.router);
      console.log(`✅ Route registered: ${fullPath}`);
    });

    this.app.get("/health", (_req: Request, res: Response) => {
      res.status(200).json({ status: "healthy" });
    });
  }

  private initializeSwaggerUI(): void {
    if (this.serveSwagger) {
      this.app.use(
        "/api-docs",
        swaggerUi.serve,
        swaggerUi.setup(swaggerDocument)
      );
      console.log(`📄 Swagger UI available at /api-docs`);
    }
  }

  private initializeErrorHandler(): void {
    this.app.use((err: ApiError, _req: any, res: any, _next: NextFunction) => {
      if (err instanceof ApiError) {
        return res.json({
          code: err.code,
          status: "failed",
          message: err.message,
        });
      }
    });
  }

  public listen(): Promise<void> {
    return new Promise((resolve) => {
      this.server = this.app.listen(this.port, () => {
        console.log(`🚀 Server running on http://localhost:${this.port}`);
        resolve();
      });
    });
  }

  public close(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.server) {
        this.server.close((err) => {
          if (err) {
            return reject(err);
          }
          console.log("Server closed");
          resolve();
        });
      } else {
        resolve();
      }
    });
  }

  public getAppInstance(): Application {
    return this.app;
  }

  public getServerInstance(): Server | undefined {
    return this.server;
  }
}

export default App;
