import { ApiResponse } from "@src/utils/server-functions";
import { Request } from "express";
import { Router, RequestHandler } from "express";

declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}

export interface JwtPayload {
  userId: string;
}

export interface User {
  id: string;
}

export interface DecryptedRequest extends Request {
  decryptedData?: any;
}

export interface UserType {
  id: string;
  password: string;
}
