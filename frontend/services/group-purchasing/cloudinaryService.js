// frontend/services/group-purchasing/cloudinaryService.js

import { Platform } from "react-native";

// ⚠️ REPLACE THESE WITH YOUR CLOUDINARY DETAILS
const CLOUDINARY_CLOUD_NAME = "dqk5mnxtz";
const CLOUDINARY_UPLOAD_PRESET = "deals_unsigned";
const CLOUDINARY_FOLDER = "deals";

export const cloudinaryService = {
  // =====================================================
  // UPLOAD IMAGE (works on web + mobile)
  // =====================================================
  async uploadImage(asset) {
    console.log("🔄 cloudinaryService: Uploading image...");
    console.log("📦 Asset received:", asset);

    try {
      const formData = new FormData();

      if (Platform.OS === "web") {
        // ✅ WEB: Convert asset to a Blob/File before appending
        let fileToUpload = asset;

        // Case 1: asset has a `file` property (File object)
        if (typeof asset === "object" && asset.file) {
          fileToUpload = asset.file;
        }
        // Case 2: asset has a `uri` (blob URL or base64) — fetch it
        else if (typeof asset === "object" && asset.uri) {
          const response = await fetch(asset.uri);
          fileToUpload = await response.blob();
        }
        // Case 3: asset is a plain string URI — fetch it
        else if (typeof asset === "string") {
          const response = await fetch(asset);
          fileToUpload = await response.blob();
        }

        formData.append("file", fileToUpload);
      } else {
        // ✅ MOBILE: Use React Native's { uri, name, type } format
        const uri = typeof asset === "string" ? asset : asset.uri;

        const filename = uri.split("/").pop() || "upload.jpg";
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : "image/jpeg";

        formData.append("file", {
          uri,
          name: filename,
          type,
        });
      }

      formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
      formData.append("folder", CLOUDINARY_FOLDER);

      // Upload to Cloudinary
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: formData,
        },
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error("❌ Cloudinary response:", errorText);
        throw new Error("Failed to upload image to Cloudinary");
      }

      const data = await response.json();
      console.log("✅ cloudinaryService: Upload successful:", data.secure_url);

      return {
        url: data.secure_url,
        publicId: data.public_id,
        width: data.width,
        height: data.height,
      };
    } catch (error) {
      console.error("❌ cloudinaryService: Upload error:", error);
      throw error;
    }
  },

  // =====================================================
  // DELETE IMAGE (optional)
  // =====================================================
  async deleteImage(publicId) {
    console.warn("⚠️ Deletion requires a backend with API secret. Skipping.");
    return { success: false };
  },
};
