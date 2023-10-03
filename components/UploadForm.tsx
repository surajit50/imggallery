"use client";

import PhotoCard from "./PhotoCard";
import ButtonSubmit from "./ButtonSubmit";
import React, { ChangeEvent, FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { uploadImage } from "@action/uploadAction";

const UploadForm = () => {
  const [image, setimage] = useState("");
  const router = useRouter();

  const [submitting, setSubmitting] = useState<boolean>(false);

  const handleChangeImage = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();

    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.includes("image")) {
      alert("Please upload an image!");
      return;
    }

    if (file.size >= 2 * 1024 * 1024) {
      alert("Image size too big");
      return;
    }

    const reader = new FileReader();

    reader.readAsDataURL(file);

    reader.onload = () => {
      const result = reader.result as string;
      setimage(result);
    };
  };
  const handleFormSubmit = async (e: FormEvent) => {
    e.preventDefault();

    setSubmitting(true);

    const imagepath = image;

    try {
      const imageUrl = await uploadImage(imagepath);
      setSubmitting(false);
    } catch (error) {
      console.log(error);
    } finally {
      setSubmitting(false);
    }
  };
  return (
    <form onSubmit={handleFormSubmit}>
      <div className="bg-gray-300 min-h-[200px] my-3 p-3">
        <p className="text-red-600"> {submitting ? "Loading" : ""}</p>

        <label htmlFor="poster" className="flexCenter form_image-label"></label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => handleChangeImage(e)}
          multiple
        />

        <h5 className="text-red-600">
          (*) Only accept image files less than 1MB in size. Up to 3 photo
          files.
        </h5>
      </div>
      <button
        type="submit"
        className="bg-blue-600 py-1 px-3 text-white rounded ml-2"
      >
        Upload
      </button>
      <div></div>
      {/* Preview Image 
        <div className="flex flex-wrap gap-3 my-3">
          {files.map((file, index) => (
            <div key={index}>
              <img
                src={URL.createObjectURL(file)}
                alt={`Preview ${file.name}`}
              />
              <button type="button" onClick={() => handleDeleteFile(index)}>
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>
      */}
    </form>
  );
};

export default UploadForm;
