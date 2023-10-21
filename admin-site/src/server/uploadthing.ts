import { type FileRouter, createUploadthing } from "uploadthing/next-legacy";

import { getAuth } from "@clerk/nextjs/server";

const f = createUploadthing({
  errorFormatter(err) {
    console.log(err);
    return { message: err.message };
  },
});

export const ourFileRouter = {
  imageUploader: f({ image: { maxFileSize: "16MB" } })
    .middleware(({ req, res }) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      const { userId } = getAuth(req);

      if (!userId) throw new Error("Unauthorized");

      return { userId };
    })
    .onUploadComplete(({ metadata, file }) => {
      return;
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
