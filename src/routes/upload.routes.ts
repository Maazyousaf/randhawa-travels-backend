import { Router } from "express";
import { upload } from "../middlewares/upload.middleware.js";
import { uploadImageController } from "../controllers/upload.controller.js";

const router = Router();

router.post("/image", upload.single("image"), uploadImageController);

export default router;
