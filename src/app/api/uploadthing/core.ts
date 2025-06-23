// app/api/uploadthing/core.ts
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";

const f = createUploadthing();

export const ourFileRouter = {
    imageUploader: f({
        image: {
        maxFileSize: "4MB",
        maxFileCount: 10,
        },
    })
        .middleware(async ({ req }) => {
        const session = await getServerSession(authOptions);
        if (!session?.user || session.user.role !== "ADMIN") {
            throw new UploadThingError("Unauthorized");
        }
        return { userId: session.user.id };
        })
        .onUploadComplete(async ({ metadata, file }) => {
        console.log("Upload complete for userId:", metadata.userId);
        return { 
            uploadedBy: metadata.userId,
            fileKey: file.key // Important for deletion
        };
        }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;