import express from "express";
import { askQuestion } from "../services/ask.service";

const router = express.Router();

router.post("/ask", askQuestion);

export default router;
