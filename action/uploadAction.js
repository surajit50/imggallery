"use server";

import path from "path";
import { v4 as uuidv4 } from "uuid";
import os from "os";
import { v2 as cloudinary } from "cloudinary";
import { revalidatePath } from "next/cache";
import fs from "fs/promises";

// Configuration options (consider using a config file)
const cloudinaryConfig = {
  cloud_name: process.env.CLOUDANARY_NAME,
  api_key: process.env.CLOUDANARY_KEY,
  api_secret: process.env.CLOUDANARY_SECRET,
};

cloudinary.config(cloudinaryConfig);

async function savePhotoToLocal(formData) {
  try {
    const files = formData.getAll("files");
    const tempdir = os.tmpdir();

    const promises = files.map(async (file) => {
      try {
        const data = await file.arrayBuffer();
        if (!data || data.byteLength === 0) {
          throw new Error("File is empty");
        }

        const name = uuidv4();
        const ext = file.type.split("/")[1];
        const uploadDir = path.join(tempdir, `${name}.${ext}`);

        const buffer = Buffer.from(data);

        await fs.writeFile(uploadDir, buffer);

        return { filepath: uploadDir, filename: file.name };
      } catch (error) {
        console.error("Error saving file:", error);
        throw new Error("Failed to save photo: " + error.message);
      }
    });

    const results = await Promise.all(promises);
    return results;
  } catch (error) {
    console.error("Error in savePhotoToLocal:", error);
    throw new Error("Failed to save photo: " + error.message);
  }
}

async function uploadPhotoToCloudinary(newFiles) {
  try {
    const uploadPromises = newFiles.map(async (file) => {
      try {
        const result = await cloudinary.uploader.upload(file.filepath, {
          folder: "imagegallery",
        });
        console.log(result);
        return { success: true, result };
      } catch (error) {
        console.error("Error uploading file:", error.message);
        return { success: false, error: error.message };
      }
    });

    const results = await Promise.all(uploadPromises);
    return results;
  } catch (error) {
    console.error("Error in uploadPhotoToCloudinary:", error.message);
    throw new Error("Failed to upload photo to Cloudinary: " + error.message);
  }
}

export async function uploadPhoto(formData) {
  try {
    const newFiles = await savePhotoToLocal(formData);
    await uploadPhotoToCloudinary(newFiles);

    // Cleanup temporary files even in case of an error during Cloudinary upload
    for (const file of newFiles) {
      try {
        await fs.unlink(file.filepath);
      } catch (unlinkError) {
        console.error("Error deleting file:", unlinkError.message);
      }
    }

    revalidatePath("/");
    return { msg: "Upload Success" };
  } catch (error) {
    console.error("Error in uploadPhoto:", error.message);
    return { errMsg: error.message };
  }
}

export async function getAllPhotos() {
  try {
    const { resources } = await cloudinary.search
      .expression("folder:imagegallery/*")
      .sort_by("created_at", "desc")
      .max_results(20)
      .execute();
    return resources;
  } catch (error) {
    console.error("Error in getAllPhotos:", error.message);
    throw new Error(
      "Failed to retrieve photos from Cloudinary: " + error.message
    );
  }
}
