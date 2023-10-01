"use server";

import { v2 as cloudinary, UploadApiResponse } from "cloudinary";
import { tmpdir } from "os";
import { writeFile, unlink } from "fs/promises";
import { v4 as uuidv4 } from "uuid";
import path from "path";
import { revalidatePath } from "next/cache";
interface CloudinaryConfig {
  cloud_name: string;
  api_key: string;
  api_secret: string;
}

const cloudinaryConfig: CloudinaryConfig = {
  cloud_name: process.env.CLOUDINARY_NAME || "",
  api_key: process.env.CLOUDINARY_KEY || "",
  api_secret: process.env.CLOUDINARY_SECRET || "",
};

cloudinary.config(cloudinaryConfig);

interface SavedFile {
  filepath: string;
  filename: string;
}

async function savePhotoToLocal(formData: FormData): Promise<SavedFile[]> {
  try {
    const files: any = formData.getAll("files");
    const tempdir: string = tmpdir();

    const promises = files.map(async (file: any) => {
      try {
        const data = await file.arrayBuffer();
        if (!data || data.byteLength === 0) {
          throw new Error("File is empty");
        }

        const name: string = uuidv4();
        const ext: any = file.type.split("/")[1];
        const uploadDir: string = path.join(tempdir, `${name}.${ext}`);

        const buffer: Buffer = Buffer.from(data);

        await writeFile(uploadDir, buffer);

        return { filepath: uploadDir, filename: file.name };
      } catch (error: any) {
        console.error("Error saving file:", error);
        throw new Error("Failed to save photo: " + error.message);
      }
    });

    const results: SavedFile[] = await Promise.all(promises);
    return results;
  } catch (error: any) {
    console.error("Error in savePhotoToLocal:", error);
    throw new Error("Failed to save photo: " + error.message);
  }
}

async function uploadPhotoToCloudinary(
  newFiles: SavedFile[]
): Promise<{ success: boolean; result?: UploadApiResponse; error?: string }[]> {
  try {
    const uploadPromises: Promise<{
      success: boolean;
      result?: UploadApiResponse;
      error?: string;
    }>[] = newFiles.map(async (file: SavedFile) => {
      try {
        const result = await cloudinary.uploader.upload(file.filepath, {
          folder: "imagegallery",
        });
        console.log(result);
        return { success: true, result };
      } catch (error: any) {
        console.error("Error uploading file:", error.message);
        return { success: false, error: error.message };
      }
    });

    const results: {
      success: boolean;
      result?: UploadApiResponse;
      error?: string;
    }[] = await Promise.all(uploadPromises);
    return results;
  } catch (error: any) {
    console.error("Error in uploadPhotoToCloudinary:", error.message);
    throw new Error("Failed to upload photo to Cloudinary: " + error.message);
  }
}

export async function uploadPhoto(
  formData: FormData
): Promise<{ msg?: string; errMsg?: string }> {
  try {
    const newFiles: SavedFile[] = await savePhotoToLocal(formData);
    await uploadPhotoToCloudinary(newFiles);

    // Cleanup temporary files even in case of an error during Cloudinary upload
    for (const file of newFiles) {
      try {
        await unlink(file.filepath);
      } catch (unlinkError: any) {
        console.error("Error deleting file:", unlinkError.message);
      }
    }

    // Revalidate the path if needed
    revalidatePath("/");
    return { msg: "Upload Success" };
  } catch (error: any) {
    console.error("Error in uploadPhoto:", error.message);
    return { errMsg: error.message };
  }
}
