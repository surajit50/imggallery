"use client";

import React, { useState } from "react";
import { imgUrl } from "@/data";
import Image from "next/image";
const ImageGallery: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const openModal = (imageUrl: string) => {
    setSelectedImage(imageUrl);
  };

  const closeModal = () => {
    setSelectedImage(null);
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
      {imgUrl.map((imageUrl, index) => (
        <div
          key={index}
          className="relative cursor-pointer h-80"
          onClick={() => openModal(imageUrl)}
        >
          <Image
            width={100}
            height={100}
            src={imageUrl}
            alt={`Image ${index}`}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
            sizes="(min-width: 425px) 50vw, 100vw"
            quality={50}
            priority
          />
        </div>
      ))}
      {selectedImage && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50"
          onClick={closeModal}
        >
          <div className="modal-container bg-white w-11/12 md:max-w-lg mx-auto rounded shadow-lg z-50 overflow-y-auto">
            <div className="modal-content py-4 text-left px-6">
              <span
                className="modal-close absolute top-2 right-2 cursor-pointer z-50 text-lg"
                onClick={closeModal}
              >
                &times;
              </span>
              <Image
                width={100}
                height={100}
                src={selectedImage}
                alt="Full-size Image"
                style={{ width: "100%", height: "100%", objectFit: "contain" }}
                sizes="(max-width: 425) 50vw, 75vw"
                quality={50}
                priority
                className="w-full"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageGallery;
