import { Response } from "express";
import fs from "fs";
import OpenAI from "openai";
import { supabase } from "../supabaseClient";

const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || 'placeholder-key' 
});

// --- Utility: split text into chunks ---
const chunkText = (text: string, chunkSize = 1000, overlap = 100): string[] => {
  const words = text.split(/\s+/);
  const chunks: string[] = [];
  let start = 0;
  while (start < words.length) {
    const end = Math.min(start + chunkSize, words.length);
    chunks.push(words.slice(start, end).join(" "));
    start += chunkSize - overlap;
  }
  return chunks;
};

// --- Upload PDF, parse text, chunk, embed, store ---
export async function uploadDocument(req: any, res: Response) {
  try {
    const { userId } = req.body;
    if (!userId) return res.status(400).json({ error: "Missing userId" });
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    const fileBuffer = fs.readFileSync(req.file.path);

    // --- For now, simulate PDF text extraction ---
    // TODO: Implement proper PDF parsing
    const fullText = `Sample PDF content from ${req.file.originalname}. This is a placeholder for PDF text extraction.`;

    // --- Chunk text ---
    const chunks = chunkText(fullText);

    // --- Embed chunks and insert into Supabase ---
    for (let i = 0; i < chunks.length; i++) {
      const embeddingRes = await openai.embeddings.create({
        model: "text-embedding-3-small",
        input: chunks[i]
      });

      await supabase.from("documents").insert({
        user_id: userId,
        filename: req.file.originalname,
        file_size: req.file.size,
        content: chunks[i],
        embedding: embeddingRes.data[0].embedding,
        metadata: { chunk_index: i }
      });
    }

    // --- Cleanup temp file ---
    fs.unlinkSync(req.file.path);

    res.json({ message: "PDF uploaded successfully", chunks: chunks.length });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}
