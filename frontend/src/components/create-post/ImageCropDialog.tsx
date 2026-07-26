"use client";

import { useCallback, useState } from "react";
import Cropper, { type Area } from "react-easy-crop";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { getCroppedImage } from "../upload/cropImage";
import { LocalImage } from "../upload/type";


interface ImageCropDialogProps {
  image: LocalImage | null;
  open: boolean;
  onClose(): void;
  onSave(file: File, preview: string): void;
}

export default function ImageCropDialog({
  image,
  open,
  onClose,
  onSave,
}: ImageCropDialogProps) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });

  const [zoom, setZoom] = useState(1);

  const [croppedAreaPixels, setCroppedAreaPixels] =
    useState<Area>();

  const [aspect, setAspect] = useState<number | undefined>(
    undefined
  );

  const onCropComplete = useCallback(
    (_: Area, croppedArea: Area) => {
      setCroppedAreaPixels(croppedArea);
    },
    []
  );

  async function handleSave() {
    if (!image || !croppedAreaPixels) return;

    const file = await getCroppedImage(
      image.preview,
      croppedAreaPixels,
      image.originalFile.name
    );

    const preview = URL.createObjectURL(file);

    onSave(file, preview);

    onClose();
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Crop Image</DialogTitle>
        </DialogHeader>

        <div className="relative h-[500px] w-full bg-black rounded-lg overflow-hidden">
          {image && (
            <Cropper
              image={image.preview}
              crop={crop}
              zoom={zoom}
              aspect={aspect}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
            />
          )}
        </div>

        <div className="space-y-4">

          <div className="flex gap-2">
            <Button
              variant={aspect === undefined ? "default" : "outline"}
              onClick={() => setAspect(undefined)}
            >
              Original
            </Button>

            <Button
              variant={aspect === 1 ? "default" : "outline"}
              onClick={() => setAspect(1)}
            >
              1:1
            </Button>

            <Button
              variant={aspect === 4 / 5 ? "default" : "outline"}
              onClick={() => setAspect(4 / 5)}
            >
              4:5
            </Button>

            <Button
              variant={aspect === 16 / 9 ? "default" : "outline"}
              onClick={() => setAspect(16 / 9)}
            >
              16:9
            </Button>
          </div>

          <input
            type="range"
            min={1}
            max={3}
            step={0.1}
            value={zoom}
            onChange={(e) => setZoom(Number(e.target.value))}
            className="w-full"
          />

          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={onClose}
            >
              Cancel
            </Button>

            <Button onClick={handleSave}>
              Crop & Save
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}