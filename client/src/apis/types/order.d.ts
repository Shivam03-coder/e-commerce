import type { ApiResponse } from "./api";

interface CartAddResult {
  orderId: string | null;
  totalAmount: number;
  user: {
    name: string;
    email: string;
    contact: string;
  };
}

export interface AddCartResponse extends ApiResponse {
  result: CartAddResult;
}
