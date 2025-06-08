import type { ApiResponse } from "./api";
import { ReviewListItem } from "@/types/global";

interface ReviewListItemType extends ApiResponse {
  result: ReviewListItem[];
}
