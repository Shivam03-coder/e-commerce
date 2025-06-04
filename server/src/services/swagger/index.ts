// src/utils/swagger.ts
import swaggerAutogen from "swagger-autogen";
import path from "path";
import { appEnvConfigs } from "@src/configs";

interface Route {
  path: string;
}

const generateSwagger = async (port: number) => {
  const outputFile = "./swagger-output.json";
  const endpointsFiles = ["./src/routes/auth.routes.ts"];

  const doc = {
    info: {
      title: "E-Commerce API",
      version: "1.0.0",
      description: "E-Commerce API Documentation",
    },
    host: `localhost:${port}`,
    basePath: "/api/v1",
    schemes: ["http", "https"],
    consumes: ["application/json"],
    produces: ["application/json"],
    securityDefinitions: {
      bearerAuth: {
        type: "apiKey",
        name: "Authorization",
        in: "header",
        description: "JWT Authorization header using the Bearer scheme",
      },
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
  };

  try {
    await swaggerAutogen({ openapi: "3.0.0" })(outputFile, endpointsFiles, doc);
    console.log("Swagger documentation generated successfully");
    return true;
  } catch (error) {
    console.error("Swagger generation error:", error);
    return false;
  }
};

export default generateSwagger;
