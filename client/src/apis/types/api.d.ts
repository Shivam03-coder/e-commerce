export interface ApiResponse {
  code: number;
  status: "success" | "failed";
  message: string;
}