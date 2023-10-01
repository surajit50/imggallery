"use client";

import { useRef, useState } from "react";
import PhotoCard from "./PhotoCard";
import ButtonSubmit from "./ButtonSubmit";
import { uploadPhoto } from "@/action/uploadAction";

const UploadForm = () => {
  const formRef = useRef<HTMLFormElement>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [error, setError] = useState<string>("");

  const handleFileInputChange = (e: any) => {
    const selectedFiles = e.target.files;
    const validFiles = [...selectedFiles].filter((file) => {
      if (file.size < 1024 * 1024 && file.type.startsWith("image/")) {
        return file;
      }
      return null;
    });

    if (validFiles.length > 3) {
      setError("Upload up to 3 image files.");
    } else {
      setError("");
      setFiles((prevFiles) => [...validFiles, ...prevFiles]);
      formRef.current?.reset();
    }
  };

  const handleDeleteFile = (index: number) => {
    const updatedFiles = files.filter((_, i) => i !== index);
    setFiles(updatedFiles);
  };

  async function handleUploadfile() {
    if (!files.length) return alert("No image files are selected");
    if (files.length > 3) return alert("Upload up to 3 image files");
    const formData = new FormData();

    // Assuming you have a file input element.
    files.forEach((file) => {
      formData.append("files", file);
    });

    try {
      const res = await uploadPhoto(formData);
      if (res?.errMsg) {
        alert(`Error: ${res?.errMsg}`);
      }
    } catch (error) {
      console.error("Error in handleUploadfile:", error);
      alert("An error occurred while uploading the file.");
    }
  }

  return (
    <form onSubmit={handleUploadfile} ref={formRef}>
      <div className="bg-gray-300 min-h-[200px] my-3 p-3">
        {error && <p className="text-red-500 font-bold">{error}</p>}
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileInputChange}
        />
        <h5 className="text-red-600">
          (*) Only accept image files less than 1MB in size. Up to 3 photo
          files.
        </h5>

        <div className="flex flex-wrap gap-3 my-3">
          {files.map((file, index) => (
            <PhotoCard
              key={index}
              url={URL.createObjectURL(file)}
              onClick={() => handleDeleteFile(index)}
            />
          ))}
        </div>
      </div>
      <ButtonSubmit
        value="Upload"
        className="bg-blue-600 py-1 px-3 text-white rounded ml-2"
      />
    </form>
  );
};

export default UploadForm;
