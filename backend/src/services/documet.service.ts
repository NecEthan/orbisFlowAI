import { Response } from "express";
import fs from "fs";
import OpenAI from "openai";
import { supabase } from "../supabaseClient";

const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || 'placeholder-key' 
});

// --- Utility: split text into chunks --
// --- Upload PDF, parse text, chunk, embed, store ---
export async function uploadDocument(req: any, res: Response) {
  

}
