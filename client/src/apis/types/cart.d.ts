import type { CartItem, CartItemType } from "@/types/global";
import type { ApiResponse } from "./api";

export interface CartsItemTypeRes extends ApiResponse {
  result: CartItem[];
}

export interface AddCartItemTypeRes extends ApiResponse {
  result: string;
}
