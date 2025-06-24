import type { CartItemType } from "@/types/global";
import type { ApiResponse } from "./api";

interface CartsItemTypeRes extends ApiResponse {
  result: CartItemType[];
}
