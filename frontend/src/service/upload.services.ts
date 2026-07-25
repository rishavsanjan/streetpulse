import {
    CLOUDINARY_UPLOAD_PRESET,
    CLOUDINARY_URL,
} from "@/lib/cloudinary";

export interface UploadedImage {
    publicId: string;
    url: string;
    width: number;
    height: number;
}

export async function uploadImage(
    file: File
): Promise<UploadedImage> {
    const formData = new FormData();

    formData.append("file", file);
    formData.append(
        "upload_preset",
        CLOUDINARY_UPLOAD_PRESET
    );

    const response = await fetch(CLOUDINARY_URL, {
        method: "POST",
        body: formData,
    });

    if (!response.ok) {
        throw new Error("Failed to upload image");
    }

    const data = await response.json();

    return {
        publicId: data.public_id,
        url: data.secure_url,
        width: data.width,
        height: data.height,
    };
}