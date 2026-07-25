"use client";

import { useState, useRef, useEffect } from "react";
import CropModal from "./CropModal";

export interface ManagedImage {
    id: string;
    file: File; // current file — either original or cropped
    previewUrl: string;
    originalSrc: string; // untouched source, used if user re-crops
}

interface ImageSelectProps {
    aspect?: number;
    maxImages?: number;
    onChange: (files: File[]) => void; // fires whenever the selection changes
}

export default function ImageSelect({
    aspect = 1,
    maxImages = 6,
    onChange,
}: ImageSelectProps) {
    const [images, setImages] = useState<ManagedImage[]>([]);
    const [editingId, setEditingId] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Let the parent know the current file list any time it changes.
    useEffect(() => {
        onChange(images.map((img) => img.file));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [images]);

    const handleSelectFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files ?? []);
        if (!files.length) return;

        const remainingSlots = maxImages - images.length;
        const filesToAdd = files.slice(0, remainingSlots);

        filesToAdd.forEach((file) => {
            if (!file.type.startsWith("image/")) return;
            const url = URL.createObjectURL(file);
            const id = crypto.randomUUID();
            setImages((prev) => [
                ...prev,
                { id, file, previewUrl: url, originalSrc: url },
            ]);
        });

        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const handleRemove = (id: string) => {
        setImages((prev) => prev.filter((img) => img.id !== id));
    };

    const handleCropSave = (id: string, croppedFile: File) => {
        setImages((prev) =>
            prev.map((img) =>
                img.id === id
                    ? {
                        ...img,
                        file: croppedFile,
                        previewUrl: URL.createObjectURL(croppedFile),
                    }
                    : img
            )
        );
        setEditingId(null);
    };

    const editingImage = images.find((img) => img.id === editingId);

    return (
        <div className="max-w-full flex flex-col gap-4">
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                {images.map((img) => (
                    <div
                        key={img.id}
                        className="relative group aspect-square rounded-lg overflow-hidden border border-gray-200"
                    >
                        <img
                            src={img.previewUrl}
                            alt="Selected"
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                            <button
                                type="button"
                                onClick={() => setEditingId(img.id)}
                                className="text-xs px-2 py-1 rounded bg-white text-black"
                            >
                                Edit
                            </button>
                            <button
                                type="button"
                                onClick={() => handleRemove(img.id)}
                                className="text-xs px-2 py-1 rounded bg-white text-black"
                            >
                                Remove
                            </button>
                        </div>
                    </div>
                ))}

                {images.length < maxImages && (
                    <label className="flex items-center justify-center aspect-square rounded-lg border-2 border-dashed border-gray-300 cursor-pointer hover:border-gray-400 transition-colors">
                        <span className="text-xs text-gray-500 text-center px-2">
                            Add photo
                        </span>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={handleSelectFiles}
                            className="hidden"
                        />
                    </label>
                )}
            </div>

            {editingImage && (
                <CropModal
                    imageSrc={editingImage.originalSrc}
                    aspect={aspect}
                    onCancel={() => setEditingId(null)}
                    onSave={(file) => handleCropSave(editingImage.id, file)}
                />
            )}
        </div>
    );
}