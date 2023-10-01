"use server";

import path from "path";
import { v4 as uuidv4 } from "uuid";
import os from "os";
import { v2 as cloudinary } from "cloudinary";
import { revalidatePath } from "next/cache";
import fs from "fs/promises";

cloudinary.config({
  cloud_name: process.env.CLOUDANARY_NAME,
  api_key: process.env.CLOUDANARY_KEY,
  api_secret: process.env.CLOUDANARY_SECRET,
});

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

        // Convert ArrayBuffer to Buffer using Uint8Array
        const buffer = Buffer.from(new Uint8Array(data));

        await fs.writeFile(uploadDir, buffer);

        return { filepath: uploadDir, filename: file.name };
      } catch (error) {
        console.error("Error saving file:", error);
        throw error; // Propagate the error
      }
    });

    const results = await Promise.all(promises);
    return results;
  } catch (error) {
    console.error("Error in savePhotoToLocal:", error);
    throw error; // Propagate the error
  }
}

async function uploadPhotoToCloudinary(newFiles) {
  try {
    // Use map to create an array of upload promises
    const uploadPromises = newFiles.map(async (file) => {
      try {
        // Upload the file to Cloudinary with a specified folder
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

    // Use Promise.all to await all the individual upload promises
    const results = await Promise.all(uploadPromises);

    // Return an array of upload results (success or error)
    return results;
  } catch (error) {
    console.error("Error in uploadPhotoToCloudinary:", error.message);
    throw error;
  }
}

export async function uploadPhoto(formData) {
  try {
    //save photo to files to temp folder
    const newFiles = await savePhotoToLocal(formData);
    await uploadPhotoToCloudinary(newFiles);

    //Delete photo files in temp folder after successfull upload!
    newFiles.map((file) => fs.unlink(file.filepath));
    revalidatePath("/");
    return { msg: "Upload Success" };
  } catch (error) {
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
    console.error("Error:", error); // Log the error
  }
}
