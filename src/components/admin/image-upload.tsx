// components/image-upload.tsx
"use client";

import { useCallback, useState, useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDropzone } from "@uploadthing/react";

interface ImageUploadProps {
    value: string[]; // Array of image URLs
    onChange: (urls: string[]) => void;
    onRemove?: (url: string) => Promise<void>;
    disabled?: boolean;
    maxFiles?: number;
    onFilesSelected?: (files: File[]) => Promise<void>;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
    value = [],
    onChange,
    onRemove,
    disabled,
    maxFiles = 1,
    onFilesSelected,
}) => {
    const [localFiles, setLocalFiles] = useState<
        { file: File; preview: string }[]
    >([]);
    const [isUploading, setIsUploading] = useState(false);

    // Clean up object URLs on unmount
    useEffect(() => {
        return () => {
            localFiles.forEach(({ preview }) => URL.revokeObjectURL(preview));
        };
    }, [localFiles]);

    const onDrop = useCallback(
        async (acceptedFiles: File[]) => {
            if (disabled || isUploading) return;

            setIsUploading(true);
            try {
                // Create previews and store files
                const newFiles = acceptedFiles.map((file) => ({
                    file,
                    preview: URL.createObjectURL(file),
                }));
                setLocalFiles(newFiles);

                // If parent wants to handle upload
                if (onFilesSelected) {
                    await onFilesSelected(acceptedFiles);
                }
            } finally {
                setIsUploading(false);
            }
        },
        [disabled, isUploading, onFilesSelected]
    );

    const { getRootProps, getInputProps } = useDropzone({
        accept: {
            "image/*": [".jpeg", ".jpg", ".png", ".webp"],
        },
        maxFiles,
        onDrop,
        disabled: disabled || isUploading,
    });

    const handleRemove = useCallback(
        async (url: string) => {
            // It's a permanent URL - notify parent
            if (onRemove) {
                await onRemove(url); // Await the removal
            }
            onChange(value.filter((u) => u !== url));
        },
        [localFiles, value, onChange, onRemove]
    );

    // Combine permanent URLs with local previews
    const displayUrls = [...value];
    if (localFiles.length > 0) {
        displayUrls.push(...localFiles.map((f) => f.preview));
        displayUrls.splice(maxFiles); // Ensure we don't exceed maxFiles
    }

    return (
        <div>
            <div
                {...getRootProps()}
                className="border-2 border-dashed rounded-md p-4"
            >
                <input {...getInputProps()} />
                <div className="flex items-center justify-center text-sm text-muted-foreground">
                    {isUploading ? (
                        <div>Uploading...</div>
                    ) : (
                        <div>Drag & drop images here, or click to select</div>
                    )}
                </div>
            </div>

            {displayUrls.length > 0 && (
                <div className="mt-4 grid grid-cols-2 gap-4">
                    {displayUrls.map((url, index) => (
                        <div key={index} className="relative">
                            <img
                                src={url}
                                alt="Upload preview"
                                className="rounded-md object-cover w-full h-32"
                            />
                            <Button
                                type="button"
                                variant="destructive"
                                size="sm"
                                className="absolute top-1 right-1"
                                onClick={() => handleRemove(url)}
                                disabled={disabled || isUploading}
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
