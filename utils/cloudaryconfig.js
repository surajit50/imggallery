import cloudinary from "cloudinary";

export const cloudinaryconfic = async () => {
  try {
    cloudinary.config({
      cloud_name: process.env.CLOUDANARY_NAME,
      api_key: process.env.CLOUDANARY_KEY,
      api_secret: process.env.CLOUDANARY_SECRET,
    });
  } catch (error) {
    console.log(error);
  }
};
