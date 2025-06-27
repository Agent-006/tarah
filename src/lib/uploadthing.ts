import { OurFileRouter } from "@/app/api/uploadthing/core";
import {
    generateUploadButton,
    generateUploadDropzone,
    generateReactHelpers,
    generateUploader
  } from "@uploadthing/react";
import axios from "axios";


export const UploadButton = generateUploadButton<OurFileRouter>();
export const UploadDropzone = generateUploadDropzone<OurFileRouter>();
export const Uploader = generateUploader<OurFileRouter>();

export const { useUploadThing, uploadFiles } = generateReactHelpers<OurFileRouter>();

export function getImageUrl(fileKey: string) {
  return `${process.env.NEXT_PUBLIC_UPLOADTHING_URL}/f/${fileKey}`;
}

export async function deleteImage(fileKey: string) {
  try {
    const response = await axios.delete("/api/uploadthing", {
      data: { fileKey },
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.status === 200;
  } catch (error) {
    console.error("Failed to delete image:", error);
    return false;
  }
}