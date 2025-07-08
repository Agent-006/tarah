
import { createRouteHandler } from "uploadthing/next";
import { UTApi } from "uploadthing/server";

import { ourFileRouter } from "./core";

export const { GET, POST } = createRouteHandler({
    router: ourFileRouter,
});

export async function DELETE(req: Request) {
    const { fileKey } = await req.json();
    try {
        if (!fileKey) {
            return new Response("File key is required", { status: 400 });
        }
        // Use UploadThing's UTApi to delete the file
        const utapi = new UTApi();
        const result = await utapi.deleteFiles(fileKey);
        if (result.success) {
            return new Response("File deleted successfully", { status: 200 });
        } else {
            return new Response("Failed to delete file", { status: 500 });
        }
    } catch (error) {
        console.error("Error deleting file:", error);
        return new Response("Failed to delete file", { status: 500 });
    }
}