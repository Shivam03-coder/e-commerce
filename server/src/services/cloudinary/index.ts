import { appEnvConfigs } from "@src/configs";
import { v2 as cloudinary } from "cloudinary";
import { promises as fs } from "fs";

cloudinary.config({
  cloud_name: appEnvConfigs.CLOUDINARY_CLOUD_NAME,
  api_key: appEnvConfigs.CLOUDINARY_API_KEY,
  api_secret: appEnvConfigs.CLOUDINARY_API_SECRET,
});

type ImagePath = string | string[];

class CloudinaryService {
  private static async uploadSingleImage(
    imagePath: string,
    attempt = 1
  ): Promise<string | null> {
    try {
      await fs.access(imagePath); // Ensure file exists

      const uploadResponse = await cloudinary.uploader.upload(imagePath, {
        resource_type: "auto",
        timeout: 120000, // SDK-level timeout
      });

      return uploadResponse.secure_url;
    } catch (error: any) {
      console.error(`Upload failed for ${imagePath} (Attempt ${attempt}):`, {
        name: error?.name,
        message: error?.message,
        http_code: error?.http_code,
        stack: error?.stack,
      });

      const shouldRetry =
        attempt < 3 &&
        (error?.name === "TimeoutError" || error?.http_code === 499);

      if (shouldRetry) {
        console.warn(
          `Retrying upload for ${imagePath} (Attempt ${attempt + 1})...`
        );
        return this.uploadSingleImage(imagePath, attempt + 1);
      }

      return null;
    } finally {
      // Clean up local file regardless of success/failure
      try {
        await fs.unlink(imagePath);
      } catch (err) {
        console.warn("Failed to delete local file:", err);
      }
    }
  }

  public static async uploadImages(
    imagePaths: ImagePath
  ): Promise<string | string[] | null> {
    if (!imagePaths || (Array.isArray(imagePaths) && imagePaths.length === 0)) {
      console.error("No file path provided");
      return null;
    }

    const paths = Array.isArray(imagePaths) ? imagePaths : [imagePaths];

    try {
      const uploadPromises = paths.map((imagePath) =>
        this.uploadSingleImage(imagePath)
      );
      const uploadedUrls = await Promise.all(uploadPromises);

      return uploadedUrls.length === 1
        ? uploadedUrls[0]
        : uploadedUrls.filter((url) => url !== null);
    } catch (error) {
      console.error("Error in CloudinaryService.uploadImages:", error);
      return null;
    }
  }
}

export default CloudinaryService;
