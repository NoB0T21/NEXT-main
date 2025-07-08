import express from "express";
import middleware from "../middleware/middleware";
import { likeFile, uploadFile} from "../controllers/Posts.controller";
import multer from "multer";
const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() })

router.post('/create', middleware,upload.single('file'), uploadFile)
router.get('/like/:id',middleware,likeFile)

export default router;