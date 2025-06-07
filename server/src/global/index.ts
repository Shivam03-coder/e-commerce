import { Request, Response } from "express";
import { ApiError } from "@src/utils/server-functions";
import CloudinaryService from "@src/services/cloudinary";

export class GlobalUtils {
  private static setCookie = (
    res: Response,
    name: string,
    value: string,
    httpOnly: boolean = true,
    options?: Record<string, any>
  ): void => {
    res.cookie(name, value, {
      httpOnly,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      ...options,
    });
  };

  public static setMultipleCookies = (
    res: Response,
    cookies: {
      name: string;
      value: string;
      httpOnly?: boolean;
      options?: Record<string, any>;
    }[]
  ): void => {
    cookies.forEach(({ name, value, httpOnly = false, options }) => {
      GlobalUtils.setCookie(res, name, value, httpOnly, options);
    });
  };

  public static getImageUrl = async (req: Request): Promise<string | null> => {
    try {
      console.log(req.file?.path);
      if (req.file?.path) {
        const uploadedImage = await CloudinaryService.uploadImages(
          req.file.path
        );

        if (!uploadedImage) {
          throw new ApiError(500, "Image upload failed");
        }

        return uploadedImage as string;
      }

      return null;
    } catch (error: any) {
      throw new ApiError(
        500,
        error.message || "An error occurred while uploading the image"
      );
    }
  };

  public static clearMultipleCookies = (
    res: Response,
    cookieNames: string[]
  ) => {
    cookieNames.forEach((name) => res.clearCookie(name));
  };

  /**
   * Private method to validate enum values
   * @param fieldName Name of the field for error messages
   * @param value Value to check
   * @param enumType Enum to validate against
   * @throws Error if value is not valid
   */

  public static validateEnum(
    fieldName: string,
    value: string,
    enumType: Record<string, unknown>
  ): void {
    if (!Object.values(enumType).includes(value)) {
      throw new Error(`Invalid ${fieldName} value`);
    }
  }
}
