import { config } from "dotenv";
import { version } from "../../package.json";

config();

type Environment = "development" | "production" | "test" | "staging";

export const envs = {
  NODE_ENV: (process.env.NODE_ENV || "development") as Environment,
  PORT: parseInt(process.env.PORT || "3000", 10),
  VERSION: process.env.APP_VERSION || version,
  DB_URI: process.env.MONGO_URI as string,
  DB_NAME: process.env.MONGO_DB_NAME || "upfound-test",
  CLIENT_APP_URI: process.env.CLIENT_APP_URI as string,
  AUTH_PASS: process.env.AUTH_PASS as string,
  AUTH_EMAIL: process.env.AUTH_EMAIL as string,
  ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET as string,
  REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET as string,
  ENCRYPTION_KEY: process.env.ENCRYPTION_KEY as string,
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID as string,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET as string,
  GOOGLE_CALLBACK_URL: process.env.GOOGLE_CALLBACK_URL as string,
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME as string,
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY as string,
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET as string,
};
