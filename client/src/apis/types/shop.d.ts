import type { ApiResponse } from "./api";
import { ReviewListItem, type ProductsDataType } from "@/types/global";

interface ReviewListItemType extends ApiResponse {
  result: ReviewListItem[];
}

interface FavouriteListType extends ApiResponse {
  result: {
    product: ProductsDataType;
  }[];
}
