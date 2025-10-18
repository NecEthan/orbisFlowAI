import express, { Request, Response } from "express";
import OpenAI from "openai";
import dotenv from "dotenv";
import multer from "multer";
import uploadDocsRouter from "./routes/upload-docs";
import askQuestionRouter from "./routes/ask";
import { Readable } from "stream";
import { File as NodeFile } from "node:buffer";
import path from "path";
import fs from "fs";
import FormData from "form-data";
import axios from "axios";

// 🧠 Fix for Node.js File global (for OpenAI file uploads)
(globalThis as any).File = NodeFile;

// Load environment variables
dotenv.config({ path: "./.env" });

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 500 * 1024 * 1024 }, // 500MB
});

const app = express();
const port = process.env.PORT || 3001;

// Your OpenAI vector store ID
const VECTOR_STORE_ID = "vs_68f3ba8f1ea48191bb6679e9d74dd719";

// Increase body parser limits
app.use(express.json({ limit: "500mb" }));
app.use(express.urlencoded({ limit: "500mb", extended: true }));

// Mount routers (if you still use them)
app.use("/upload-docs", uploadDocsRouter);
app.use("/ask-question", askQuestionRouter);

// Enable CORS for Figma plugin or local frontend
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  if (req.method === "OPTIONS") return res.sendStatus(200);
  next();
});

// Helper: Buffer → Readable Stream
function bufferToStream(buffer: Buffer) {
  const stream = new Readable();
  stream.push(buffer);
  stream.push(null);
  return stream;
}

/**
 * 🧩 Upload PDF endpoint
 * Uploads file to OpenAI → adds it to your existing vector store
 */
app.post("/api/upload-pdf", upload.single("file"), async (req: Request, res: Response) => {
  console.log("📥 /api/upload-pdf called");

  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    console.log("✅ File received:", req.file.originalname);
    console.log("📊 File details:", {
      size: req.file.size,
      originalname: req.file.originalname,
      mimetype: req.file.mimetype,
    });

    // Save file temporarily
    const tempPath = path.join("/tmp", req.file.originalname);
    fs.writeFileSync(tempPath, req.file.buffer);

    // 🧩 Proper multipart/form-data for OpenAI upload
    const formData = new FormData();
    formData.append("file", fs.createReadStream(tempPath));
    formData.append("purpose", "assistants");

    console.log("🔄 Uploading file to OpenAI...");

    const uploadRes = await axios.post("https://api.openai.com/v1/files", formData, {
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        ...formData.getHeaders(),
      },
    });

    const uploadedFile = uploadRes.data;
    console.log("📄 File uploaded to OpenAI:", uploadedFile.id);

    // Delete temp file
    fs.unlinkSync(tempPath);

    // ➕ Add file to your existing vector store
    console.log(`🔗 Adding file ${uploadedFile.id} to vector store ${VECTOR_STORE_ID}...`);
    await axios.post(
      `https://api.openai.com/v1/vector_stores/${VECTOR_STORE_ID}/files`,
      { file_id: uploadedFile.id },
      {
        headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}` },
      }
    );

    console.log(`✅ File ${uploadedFile.id} added to vector store ${VECTOR_STORE_ID}`);

    res.json({
      message: "✅ File uploaded and added to vector store successfully",
      openaiFileId: uploadedFile.id,
      vectorStoreId: VECTOR_STORE_ID,
      fileName: req.file.originalname,
      fileSize: req.file.size,
    });
  } catch (err: any) {
    console.error("💥 Upload error:", err.response?.data || err.message);
    res.status(500).json({
      error: err.message || "Unexpected server error",
      details: err.response?.data || err.stack,
    });
  }
});

/**
 * 📚 Get all stored PDFs from vector store
 */
app.get('/api/stored-pdfs', async (req: Request, res: Response) => {
  try {
    console.log("📚 Fetching stored PDFs from vector store...");

    // In the stored-pdfs endpoint:
    const response = await axios.get(`https://api.openai.com/v1/vector_stores/${VECTOR_STORE_ID}/files`, {
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    const vectorStoreFiles = response.data;
    console.log(`📄 Found ${vectorStoreFiles} files in vector store`);
    
    // Get detailed information about each file
    const filesWithDetails = await Promise.all(
      vectorStoreFiles.data.map(async (fileRef: any) => {
        try {
          const fileDetails = await openai.files.retrieve(fileRef.id);
          return {
            id: fileRef.id,
            name: fileDetails.filename,
            size: fileDetails.bytes,
            createdAt: new Date(fileDetails.created_at * 1000).toISOString(),
            purpose: fileDetails.purpose,
            status: fileDetails.status,
            vectorStoreId: VECTOR_STORE_ID
          };
        } catch (error) {
          console.error(`❌ Error fetching details for file ${fileRef.id}:`, error);
          return {
            id: fileRef.id,
            name: 'Unknown file',
            size: 0,
            createdAt: new Date().toISOString(),
            purpose: 'unknown',
            status: 'error',
            vectorStoreId: VECTOR_STORE_ID,
            error: 'Failed to fetch file details'
          };
        }
      })
    );
    
    res.json({
      success: true,
      message: `Found ${filesWithDetails.length} stored PDFs`,
      vectorStoreId: VECTOR_STORE_ID,
      files: filesWithDetails,
      totalFiles: filesWithDetails.length
    });
    
  } catch (error: any) {
    console.error("❌ Error fetching stored PDFs:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch stored PDFs",
      details: error.message
    });
  }
});

/**
 * 🧠 Test OpenAI connection
 */
app.get("/test-openai", async (req, res) => {
  try {
    console.log("🧪 Testing OpenAI API connection...");
    const models = await openai.models.list();
    console.log("✅ OpenAI API connection successful");

    res.json({
      success: true,
      message: "OpenAI API connection successful",
      modelsCount: models.data.length,
      apiKeyConfigured: !!process.env.OPENAI_API_KEY,
    });
  } catch (error: any) {
    console.error("❌ OpenAI API test failed:", error.message);
    res.status(500).json({
      success: false,
      error: "OpenAI API connection failed",
      details: error.message,
    });
  }
});

// 🚀 Start server
app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
  console.log(`Store ID: ${VECTOR_STORE_ID}`);
  console.log(`OpenAI model: ${process.env.OPENAI_MODEL || "gpt-3.5-turbo"}`);
  console.log(`🧪 Test OpenAI API: http://localhost:${port}/test-openai`);
});
