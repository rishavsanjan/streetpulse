import { useState } from "react";
import type { UploadedImage } from "@/types/upload";
import { uploadImage } from "@/service/upload.services";

export function useCloudinaryUpload() {
  const [uploading, setUploading] = useState(false);

  async function upload(file: File): Promise<UploadedImage> {
    setUploading(true);

    try {
      return await uploadImage(file);
    } finally {
      setUploading(false);
    }
  }

  return {
    upload,
    uploading,
  };
}