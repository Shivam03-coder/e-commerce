"use client";
import React, { useState, type FC } from "react";
import { CloudUpload, Paperclip, Loader2, X } from "lucide-react";
import {
  FileInput,
  FileUploader,
  FileUploaderContent,
  FileUploaderItem,
} from "@/components/ui/file-upload";
import type { UseFormSetValue } from "react-hook-form";
import type { FeaturedProductSchemaType } from "@/schema/product.schema";
import { useGetProductImageUrlMutation } from "@/apis/admin-api";

interface UploadFeaturedProductImage {
  setfileUrl: UseFormSetValue<FeaturedProductSchemaType>;
}

const UploadFeaturedProductImage: FC<UploadFeaturedProductImage> = ({
  setfileUrl,
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [getProductImageUrl, { isLoading }] = useGetProductImageUrlMutation();

  const dropZoneConfig = {
    maxFiles: 1,
    maxSize: 1024 * 1024 * 4,
    multiple: false,
  };

  const handleUpload = async (selectedFile: File) => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("productImage", selectedFile);

      const response = await getProductImageUrl(formData).unwrap();
      setfileUrl("featuredProductImage", response.result.url);
    } catch (error) {
      console.error("Upload error:", error);
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
    setfileUrl("featuredProductImage", "");
  };

  return (
    <FileUploader
      value={file ? [file] : []}
      onValueChange={(files) => {
        if (files && files[0]) {
          const selectedFile = files[0];
          setFile(selectedFile);
          handleUpload(selectedFile);
        }
      }}
      dropzoneOptions={dropZoneConfig}
      className="bg-background relative rounded-lg p-2"
    >
      <FileInput
        aria-disabled={isLoading}
        id="fileInput"
        className="outline-1 outline-slate-500 outline-dashed"
      >
        <div className="flex w-full flex-col items-center justify-center p-8 pb-5">
          {uploading ? (
            <Loader2 className="h-10 w-10 animate-spin text-gray-500" />
          ) : (
            <CloudUpload className="h-10 w-10 text-gray-500" />
          )}
          <p className="mb-1 text-sm text-gray-500 dark:text-gray-400">
            <span className="font-semibold">Click to upload</span> or drag and
            drop
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            PNG, JPG, JPEG (max 4MB)
          </p>
        </div>
      </FileInput>

      <FileUploaderContent>
        {file && (
          <FileUploaderItem index={0}>
            <div className="flex items-center gap-2">
              <Paperclip className="h-4 w-4 stroke-current" />
              <span className="flex-1 truncate">{file.name}</span>
              {uploading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveFile();
                  }}
                  className="text-red-500 hover:text-red-700"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </FileUploaderItem>
        )}
      </FileUploaderContent>
    </FileUploader>
  );
};

export default UploadFeaturedProductImage;
