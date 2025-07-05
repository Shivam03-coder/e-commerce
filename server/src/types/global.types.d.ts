import {
  $Enums,
  MaterialType,
  ProductCategory,
  SockSize,
} from "@prisma/client";

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

type AddCartItemType = {
  productId: string;
  orders: { size: SockSize; quantity: string }[];
};

export interface cartItem {
  sizeAndQuantity: {
    quantity: number;
    size: $Enums.SockSize;
  }[];
  title: string;
  category: $Enums.ProductCategory;
  productImage: string;
  price: number;
  material: $Enums.MaterialType;
}
