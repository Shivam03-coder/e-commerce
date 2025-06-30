"use client";
import { Input } from "@/components/ui/input";
import AppImages from "@/constants/images";
import { useAppToasts } from "@/hooks/use-app-toast";
import { Camera } from "lucide-react";
import Image from "next/image";
import React, { useCallback, useRef, useState } from "react";

const UserProfileView = () => {
  const [image, setImage] = useState<string | null>(
    AppImages["user-profile-default"],
  );
  const inputRef = useRef<HTMLInputElement>(null);
  const { WarningToast, SuccessToast } = useAppToasts();
  const handleOpenInput = () => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  };

  const handleImageChange = useCallback(() => {
    if (!inputRef.current?.files?.length) return;

    const file = inputRef.current.files[0];

    const MAX_SIZE = 3 * 1024 * 1024;

    if ((file?.size as number) > MAX_SIZE) {
      WarningToast({
        title: "File size exceeds 3MB limit",
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const image = e.target?.result as string;
      setImage(image);
    };

    reader.readAsDataURL(file!);
  }, [inputRef, setImage]);

  return (
    <div className="relative h-[300px] w-[300px]">
      <div className="h-full w-full">
        <Image
          height={300}
          width={300}
          alt="user-profile-default.jpg"
          src={image as string}
          className="h-full w-full rounded-full border border-green-600 max-sm:mx-auto"
        />
        <Input
          accept="/image"
          onChange={handleImageChange}
          type="file"
          ref={inputRef}
          className="hidden"
        />
      </div>
      <button
        onClick={handleOpenInput}
        className="absolute right-12 bottom-4 rounded-full bg-white p-1"
      >
        <Camera />
      </button>
    </div>
  );
};

export default UserProfileView;
