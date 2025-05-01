import { useCallback, useState } from "react";

import { useDropzone, FileWithPath } from "react-dropzone";

import { convertFileToUrl } from "@/lib/utils";

type ProfileUpdateProps = {
  fieldchange: (files: File[]) => void;
  mediaUrl: string;
};

const ProfileUploader = ({ fieldchange, mediaUrl }: ProfileUpdateProps) => {
  const [file, setFile] = useState<File[]>([]);
  const [fileUrl, setFileUrl] = useState<string>(mediaUrl);

  const onDrop = useCallback(
    (acceptedFiles: FileWithPath[]) => {
      setFile(acceptedFiles);
      fieldchange(acceptedFiles);
      setFileUrl(convertFileToUrl(acceptedFiles[0]));
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [file]
  );
  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".png", ".jpeg", ".jpg"],
    },
  });
  return (
    <div {...getRootProps()}>
      <input {...getInputProps()} className="cursor-pointer" />
      <div className=" cursor-pointer flex-center gap-4">
        <img
          src={fileUrl || "/assets/icons/profile-placeholder.svg"}
          alt="image"
          className="h-24 w-24 rounded-full object-cover object-top"
        />
        <p className="text-primary-500 small-regular md:base-semibold">
          Change Profile Photo
        </p>
      </div>
    </div>
  );
};

export default ProfileUploader;
