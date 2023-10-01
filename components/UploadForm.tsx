"use client";
import { useRef, useState } from "react";
import PhotoCard from "./PhotoCard";
import ButtonSubmit from "./ButtonSubmit";
import { uploadPhoto } from "@/action/uploadAction";

const UploadForm = () => {
  const formRef = useRef<HTMLFormElement>(null);
  const [files, setfiles] = useState<File[]>([]);
  const [error, seterror] = useState("");
  const handleInputFiles = async (e: any) => {
    const files = e.target.files;
    const newFiles = [...files].filter((file) => {
      if (file.size < 1024 * 1024 * 1024 && file.type.startsWith("image/")) {
        return file;
      }
    });
    setfiles((prev) => [...newFiles, ...prev]);
    formRef.current?.reset();
  };

  async function handleDeleteFiles(index: any) {
    const newFiles = files.filter((_, i) => i !== index);
    setfiles(newFiles);
  }

  async function handleUploadfile() {
    if (!files.length) return alert("No image files are selected");
    if (files.length > 3) return alert("Upload upto 3 image files");
    const formData = new FormData();

    files.forEach((file: File) => {
      formData.append("files", file);
    });
    const res = await uploadPhoto(formData);
    if (res?.errMsg) alert(`Error: ${res?.errMsg}`);
  }

  return (
    <form action={handleUploadfile} ref={formRef}>
      <div className="bg-gray-300 min-h-[200px] my-3 p-3">
        <p className="text-red-500 font-bold">{error}</p>
        <input type="file" accept="image/*" onChange={handleInputFiles} />

        <h5 className="text-red-600">
          (*) Only accept image files less than 1mb in size. up to 3 photo files
        </h5>

        {/* Preview Image */}
        <div className="flex  flex-wrap gap-3 my-3 ">
          {files.map((file, index) => (
            <PhotoCard
              key={index}
              url={URL.createObjectURL(file)}
              onClick={() => handleDeleteFiles(index)}
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
