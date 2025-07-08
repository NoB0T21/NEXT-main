import express from "express";
import middleware from "../middleware/middleware";
import { uploadFile} from "../controllers/Posts.controller";
import multer from "multer";
const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() })

router.post('/create', middleware,upload.single('file'), uploadFile)

export default router;