"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "@uploadthing/react";
import { UploadCloud } from "lucide-react";
import Image from "next/image";

import { Button } from "@/components/ui/button";

interface ImageUploaderProps {
    onUpload: (file: File) => void;
    currentImage?: string;
    onRemove?: () => void;
}

export function ImageUploader({
    onUpload,
    currentImage,
    onRemove,
}: ImageUploaderProps) {
    const [preview, setPreview] = useState<string | null>(null);

    const onDrop = useCallback(
        (acceptedFiles: File[]) => {
            const file = acceptedFiles[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = () => {
                    setPreview(reader.result as string);
                };
                reader.readAsDataURL(file);
                onUpload(file);
            }
        },
        [onUpload]
    );

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            "image/*": [".jpeg", ".jpg", ".png", ".webp"],
        },
        maxFiles: 1,
        multiple: false,
    });

    const handleRemove = () => {
        setPreview(null);
        if (onRemove) onRemove();
    };

    return (
        <div className="space-y-4">
            {(preview || currentImage) && (
                <div className="relative w-full h-64 rounded-md overflow-hidden border">
                    <Image
                        src={preview || currentImage || ""}
                        alt="Preview"
                        fill
                        className="w-full h-full object-cover"
                        sizes="100vw"
                        priority
                    />
                    <Button
                        variant="destructive"
                        size="sm"
                        className="absolute top-2 right-2"
                        onClick={handleRemove}
                    >
                        Remove
                    </Button>
                </div>
            )}

            <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-md p-8 text-center cursor-pointer transition-colors ${
                    isDragActive
                        ? "border-primary bg-primary/10"
                        : "border-gray-300"
                }`}
            >
                <input {...getInputProps()} />
                <UploadCloud className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-2 text-sm text-gray-600">
                    {isDragActive
                        ? "Drop the image here"
                        : "Drag & drop an image here, or click to select"}
                </p>
                <p className="mt-1 text-xs text-gray-500">
                    Recommended: 1200x630px (max 4MB)
                </p>
            </div>
        </div>
    );
}
