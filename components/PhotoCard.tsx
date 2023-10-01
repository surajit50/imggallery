import Image from "next/image";
import React from "react";
import { AiFillDelete } from "react-icons/ai";

const PhotoCard = ({ url, onClick }: any) => {
  return (
    <div>
      <div className="border border-red-500 p-1.5 flex relative w-32 h-20">
        <Image
          src={url}
          alt="image"
          fill
          style={{
            objectFit: "cover", // cover, contain, none
          }}
        />
      </div>
      <button
        type="button"
        className="border border-gray-300"
        onClick={onClick}
      >
        <AiFillDelete className="text-red-600 w-5 h-5" />
      </button>
    </div>
  );
};

export default PhotoCard;
