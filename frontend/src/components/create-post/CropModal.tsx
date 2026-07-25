"use client";

import { getCroppedImage } from "@/lib/cropImage";
import { useState, useCallback, useEffect } from "react";
import Cropper, { Area } from "react-easy-crop";

interface CropModalProps {
  imageSrc: string;
  aspect?: number;
  onCancel: () => void;
  onSave: (file: File) => void;
}

export default function CropModal({
  imageSrc,
  aspect = 1,
  onCancel,
  onSave,
}: CropModalProps) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(
    null
  );
  const [isSaving, setIsSaving] = useState(false);

  // Prevent the page behind the modal from scrolling while it's open,
  // and make sure the modal itself always opens at the top of the viewport.
  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  const onCropAreaChange = useCallback((_: Area, px: Area) => {
    setCroppedAreaPixels(px);
  }, []);

  const handleSave = async () => {
    if (!croppedAreaPixels) return;
    setIsSaving(true);
    try {
      const { blob } = await getCroppedImage(imageSrc, croppedAreaPixels);
      const file = new File([blob], `cropped-${Date.now()}.jpg`, {
        type: "image/jpeg",
      });
      onSave(file);
    } catch (err) {
      console.error("Crop failed:", err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed w-full inset-0 z-50 flex justify-center bg-black/70 p-4 overflow-hidden">
      <div className="w-full max-w-lg h-full max-h-[min(700px,100%)] mt-4 bg-white rounded-lg overflow-hidden flex flex-col">
        <div className="relative w-full flex-1 min-h-0 bg-black">
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={aspect}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropAreaChange}
          />
        </div>

        <div className="p-4 flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-500">Zoom</span>
            <input
              type="range"
              min={1}
              max={3}
              step={0.1}
              value={zoom}
              onChange={(e) => setZoom(Number(e.target.value))}
              className="flex-1"
            />
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-sm rounded-md border border-gray-300 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving}
              className="px-4 py-2 text-sm rounded-md bg-black text-white disabled:opacity-50"
            >
              {isSaving ? "Saving..." : "Save crop"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}