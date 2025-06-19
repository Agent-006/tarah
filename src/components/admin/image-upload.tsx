// components/image-upload.tsx
"use client";

import { UploadDropzone } from "@/lib/uploadthing";
import { X } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
import { Button } from "../ui/button";

type ImageUploadProps = {
    value: string[];
    onUpload: (urls: string[]) => void;
    onRemove: (url: string) => void;
    disabled?: boolean;
};

export function ImageUpload({
    value,
    onUpload,
    onRemove,
    disabled,
}: ImageUploadProps) {
    return (
        <div>
            <div className="mb-4 flex flex-wrap items-center gap-4">
                {value.map((url) => (
                    <div
                        key={url}
                        className="relative w-[200px] h-[200px] rounded-md overflow-hidden"
                    >
                        <div className="z-10 absolute top-2 right-2">
                            <Button
                                type="button"
                                onClick={() => onRemove(url)}
                                variant="destructive"
                                size="sm"
                                disabled={disabled}
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                        <Image
                            fill
                            className="object-cover"
                            alt="Product image"
                            src={url}
                        />
                    </div>
                ))}
            </div>

            <UploadDropzone
                endpoint="imageUploader"
                onClientUploadComplete={(res) => {
                    const urls = res.map((file) => file.url);
                    onUpload(urls);
                    toast.success("Upload completed");
                }}
                onUploadError={(error: Error) => {
                    toast.error(`ERROR! ${error.message}`);
                }}
                config={{
                    mode: "auto",
                }}
            />
        </div>
    );
}
