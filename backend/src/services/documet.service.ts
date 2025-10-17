import { Request, Response } from "express";
import fs from "fs";
import pdf from "pdf-parse";
import OpenAI from "openai";
import { supabase } from "../supabaseClient";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// chunkText utility
function chunkText(text: string, chunkSize = 500, overlap = 50) {
  const words = text.split(/\s+/);
  const chunks: string[] = [];
  let start = 0;
  while (start < words.length) {
    const end = Math.min(start + chunkSize, words.length);
    chunks.push(words.slice(start, end).join(" "));
    start += chunkSize - overlap;
  }
  return chunks;
}

export async function uploadDocument(req: Request, res: Response) {
  try {
    const { userId } = req.body;
    if (!userId) return res.status(400).json({ error: "Missing userId" });

    const fileBuffer = fs.readFileSync(req.file.path);
    const data = await pdf(fileBuffer);
    const chunks = chunkText(data.text);

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

    fs.unlinkSync(req.file.path);
    res.json({ message: "PDF uploaded successfully", chunks: chunks.length });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}
