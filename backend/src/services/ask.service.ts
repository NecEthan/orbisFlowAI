import { Request, Response } from "express";
import OpenAI from "openai";
import { supabase } from '../supabaseClient';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY || 'placeholder-key' });

export async function askQuestion(req: Request, res: Response) {
  try {
    const { userId, question } = req.body;
    if (!userId || !question) return res.status(400).json({ error: "Missing userId or question" });

    const embeddingRes = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: question
    });
    const queryEmbedding = embeddingRes.data[0].embedding;

    const { data: docs, error } = await supabase.rpc("match_documents", {
      query_embedding: queryEmbedding,
      match_threshold: 0.7,
      match_count: 5
    }).eq("user_id", userId);

    if (error) throw error;
    if (!docs || docs.length === 0) return res.json({ answer: "No relevant documents found." });

    const contextText = docs.map((d: any) => d.content).join("\n\n");

    const completion = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        { role: "system", content: "You are an assistant that answers questions using the following document context." },
        { role: "user", content: `Context:\n${contextText}\n\nQuestion: ${question}` }
      ]
    });

    const answer = completion.choices[0].message.content;
    res.json({ answer });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}
