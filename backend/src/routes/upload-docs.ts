import express from "express";
import multer from "multer";
import { uploadDocument } from "../services/documet.service";

const router = express.Router();
const upload = multer({ dest: "upload/docs/" });

router.post("/upload", upload.single("file"), uploadDocument);

export default router;
