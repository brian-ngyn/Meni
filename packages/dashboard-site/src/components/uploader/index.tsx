import { useCallback, useEffect, useState } from "react";
import { generateClientDropzoneAccept } from "uploadthing/client";

import FileUploadIcon from "@mui/icons-material/FileUpload";
import type { FileWithPath } from "@uploadthing/react";
import { useDropzone } from "@uploadthing/react/hooks";

import { type EditableFieldTypes } from "~/lib/types";
import { useUploadThing } from "~/utils/uploadthing";

import { LoadingSpinner } from "~/components/loadingPage";
import MeniNotification from "~/components/meniComponents/MeniNotification";

type ImageUploaderProps = {
  updateField: (
    id: string,
    newValue: string | number | string[],
    field: EditableFieldTypes,
  ) => void;
  foodItemId: string;
  isUploading: boolean;
  setIsUploading: (isUploading: boolean) => void;
};

export const ImageUploader = (props: ImageUploaderProps) => {
  const [files, setFiles] = useState<File[]>([]);
  const onDrop = useCallback((acceptedFiles: FileWithPath[]) => {
    setFiles(acceptedFiles);
  }, []);

  const { startUpload, permittedFileInfo } = useUploadThing("imageUploader", {
    onClientUploadComplete: (e) => {
      if (e && e[0]) {
        props.updateField(props.foodItemId, e[0].key, "foodImage");
        props.setIsUploading(false);
      }
    },
    onUploadError: () => {
      MeniNotification(
        "Error!",
        "There was an error uploading your image. Please try again later or contact support.",
        "error",
      );
      props.setIsUploading(false);
    },
    onUploadBegin: () => {
      props.setIsUploading(true);
    },
  });

  const fileTypes = permittedFileInfo?.config
    ? Object.keys(permittedFileInfo?.config)
    : [];

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: fileTypes ? generateClientDropzoneAccept(fileTypes) : undefined,
  });

  useEffect(() => {
    if (files.length > 0) {
      void startUpload(files);
      setFiles([]);
    }
  }, [files, startUpload]);

  return (
    <div
      className="flex h-full w-full items-center justify-center"
      {...getRootProps()}
    >
      <input id={props.foodItemId} {...getInputProps()} multiple={false} />
      {props.isUploading ? (
        <LoadingSpinner />
      ) : (
        <FileUploadIcon fontSize="large" className="m-auto w-10" />
      )}
    </div>
  );
};
