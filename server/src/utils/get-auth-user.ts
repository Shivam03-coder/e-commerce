import { User } from "@src/types/types";
import { ApiError } from "@src/utils/server-functions";
import { Request } from "express";

export const getAuthUser = (req: Request): { id: string } => {
  const user = req.user as User | undefined;

  if (!user) {
    throw new ApiError(401, "Unauthorized - User not authenticated");
  }

  return {
    id: user.id,
  };
};
