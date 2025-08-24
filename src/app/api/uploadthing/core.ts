import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { auth } from "@/lib/auth/auth";

const f = createUploadthing();

export const ourFileRouter = {
  resumeUploader: f({
    pdf: {
      maxFileSize: "8mb",
      maxFileCount: 1,
    },
    doc: {
      maxFileSize: "8mb",
      maxFileCount: 1,
    },
    docx: {
      maxFileSize: "8mb",
      maxFileCount: 1,
    },
  })
    .middleware(async ({ req }) => {
      // Get user session from the request
      const session = await auth.api.getSession({ headers: req.headers });

      if (!session) {
        throw new UploadThingError("Unauthorized - Please log in to upload files");
      }

      // Only allow users (talent) to upload resumes
      if (session.user.role !== "user") {
        throw new UploadThingError("Only talent can upload resumes");
      }

      return {
        userId: session.user.id,
        userEmail: session.user.email,
        userName: session.user.name,
      };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Resume upload complete for user:", metadata.userId);
      console.log("File URL:", file.url);
      console.log("File key:", file.key);
      console.log("File name:", file.name);

      return {
        uploadedBy: metadata.userId,
        fileUrl: file.url,
        fileKey: file.key,
        fileName: file.name,
        fileSize: file.size,
      };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
