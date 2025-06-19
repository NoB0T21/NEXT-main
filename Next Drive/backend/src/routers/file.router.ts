import express from "express";
import middleware from "../middleware/user.middleware";
import { uploadFile } from "../controller/file.controller";
import multer from "multer";
const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() })

router.post('/upload', middleware,upload.single('file'), uploadFile)

export default router;