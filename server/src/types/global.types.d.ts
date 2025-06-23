import { MaterialType, ProductCategory, SockSize } from "@prisma/client";

declare global {
  namespace Express {
    interface Request {
      user: SessionUser;
    }
  }
}

export interface SessionUser {
  id: string;
  role: "USER" | "ADMIN";
}

export type CookieData = {
  value: string;
  days?: number;
};


