import type { CartItem, CartItemType } from "@/types/global";
import type { ApiResponse } from "./api";

interface CartsItemTypeRes extends ApiResponse {
  result: CartItem[];
}
