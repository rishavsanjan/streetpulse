// cropImage.ts
// Takes the image src + the pixel crop area from react-easy-crop and
// returns a cropped image as a Blob (ready to upload) and an object URL (for preview).

export interface PixelCrop {
    x: number;
    y: number;
    width: number;
    height: number;
}

function createImage(url: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
        const image = new Image();
        image.addEventListener("load", () => resolve(image));
        image.addEventListener("error", (err) => reject(err));
        // Needed if the image is loaded from a different origin (e.g. S3, CDN)
        image.crossOrigin = "anonymous";
        image.src = url;
    });
}

export async function getCroppedImage(
    imageSrc: string,
    crop: PixelCrop,
    outputType: string = "image/jpeg",
    quality: number = 0.9
): Promise<{ blob: Blob; url: string }> {
    const image = await createImage(imageSrc);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    if (!ctx) {
        throw new Error("Could not get canvas context");
    }

    canvas.width = crop.width;
    canvas.height = crop.height;

    ctx.drawImage(
        image,
        crop.x,
        crop.y,
        crop.width,
        crop.height,
        0,
        0,
        crop.width,
        crop.height
    );

    return new Promise((resolve, reject) => {
        canvas.toBlob(
            (blob) => {
                if (!blob) {
                    reject(new Error("Canvas is empty"));
                    return;
                }
                resolve({ blob, url: URL.createObjectURL(blob) });
            },
            outputType,
            quality
        );
    });
}