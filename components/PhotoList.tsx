import React from "react";
import PhotoCard from "./PhotoCard";

export const PhotoList = ({ photos }: any) => {
  return (
    <div className="flex gap-3 p-2 flex-wrap">
      {photos.map((photo: any) => (
        <PhotoCard key={photo?.public_id} url={photo?.secure_url} />
      ))}
    </div>
  );
};
