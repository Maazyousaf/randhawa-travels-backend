import { Request, Response } from "express";
import { uploadImage } from "../services/cloudinary.service.js";

export const uploadImageController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({
        success: false,
        message: "No image file provided",
      });
      return;
    }

    const result = await uploadImage(req.file.buffer, "wander-luxe/uploads");

    res.status(200).json({
      success: true,
      message: "Image uploaded successfully",
      data: {
        url: result.url,
        publicId: result.publicId,
      },
    });
  } catch (error) {
    console.error("Cloudinary upload error:", error);

    res.status(500).json({
      success: false,
      message: "Image upload failed",
    });
  }
};
