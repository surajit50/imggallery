import { getAllPhotos } from "@/action/uploadAction";

import { PhotoList } from "@/components/PhotoList";
import UploadForm from "@/components/UploadForm";

const galleryimage = async () => {
  const photoResources = await getAllPhotos();
  return (
    <div>
      <h1>Nextjs Server Action Upload Image Files</h1>
      <UploadForm />
      <h2>All Image</h2>
      <PhotoList photos={photoResources || []} />
    </div>
  );
};
export default galleryimage;
