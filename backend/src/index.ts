import express from 'express';
import { Request, Response } from 'express';
import OpenAI from 'openai';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.use(express.json());

// Enable CORS for Figma plugin
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

// Hello World endpoint
app.get('/api/hello', (req: Request, res: Response) => {
  res.json({ message: 'Hello from Express.js!' });
});

// Chat endpoint for OpenAI integration
app.post('/api/chat', async (req: Request, res: Response) => {
  try {
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Messages array is required' });
    }

    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({ error: 'OpenAI API key not configured' });
    }

    // System prompt for AI Design Copilot
    const systemPrompt = `You are an AI Design Copilot for Figma, helping designers with feedback responses, design critiques, and design system knowledge. 

Your role is to:
- Help craft respectful, professional responses to stakeholder feedback
- Provide design critiques based on best practices and user experience principles
- Answer questions about design systems, accessibility, and UI/UX patterns
- Assist with Figma plugin functionality and design workflows
- Offer constructive suggestions for design improvements

Always be helpful, professional, and focus on user-centered design principles.`;

    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-4',
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages
      ],
      max_tokens: 1000,
      temperature: 0.7,
    });

    const aiMessage = completion.choices[0]?.message?.content || 'Sorry, I could not generate a response.';

    res.json({ 
      message: aiMessage,
      usage: completion.usage 
    });

  } catch (error: any) {
    console.error('OpenAI API Error:', error);
    
    if (error.code === 'insufficient_quota') {
      return res.status(402).json({ error: 'OpenAI API quota exceeded' });
    } else if (error.code === 'invalid_api_key') {
      return res.status(401).json({ error: 'Invalid OpenAI API key' });
    } else if (error.code === 'rate_limit_exceeded') {
      return res.status(429).json({ error: 'Rate limit exceeded. Please try again later.' });
    } else {
      return res.status(500).json({ error: 'Failed to get AI response' });
    }
  }
});

// Feedback response generation endpoint
app.post('/api/feedback-response', async (req: Request, res: Response) => {
  try {
    const { feedback, feedbackType = 'subjective', responseLength = 'medium' } = req.body;

    if (!feedback || typeof feedback !== 'string') {
      return res.status(400).json({ error: 'Feedback text is required' });
    }

    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({ error: 'OpenAI API key not configured' });
    }

    // Dynamic system prompt based on feedback type and response length
    const getLengthInstruction = (length: string) => {
      switch (length) {
        case 'short': return 'Keep the response brief and concise (1-2 sentences).';
        case 'medium': return 'Provide a balanced, detailed response (2-3 paragraphs).';
        case 'long': return 'Give a comprehensive, thorough response (3-4 paragraphs with detailed explanations).';
        default: return 'Provide a balanced, detailed response (2-3 paragraphs).';
      }
    };

    const getTypeInstruction = (type: string) => {
      switch (type) {
        case 'subjective': 
          return `This is SUBJECTIVE feedback (opinion-based about style, colors, preferences). 
          - Acknowledge their personal preference respectfully
          - Explain the design rationale behind your choices
          - Offer alternative options or compromises
          - Maintain a collaborative tone while standing by design decisions`;
        case 'objective':
          return `This is OBJECTIVE feedback (fact-based about functionality, accessibility, compliance).
          - Address the specific technical or functional concern
          - Provide evidence-based explanations
          - Offer concrete solutions or fixes
          - Reference relevant standards, guidelines, or requirements`;
        default:
          return 'Address the feedback appropriately based on its nature.';
      }
    };

    const systemPrompt = `You are an AI assistant that helps designers craft professional, respectful responses to stakeholder feedback.

Your task is to generate a thoughtful response that:
- Acknowledges the feedback respectfully
- Shows understanding of the concern
- Provides context or explanation when appropriate
- Offers solutions or next steps
- Maintains a collaborative, professional tone

${getTypeInstruction(feedbackType)}

${getLengthInstruction(responseLength)}

The response should be ready to send directly to stakeholders. Format it as a professional email or message response.`;

    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: systemPrompt },
        { 
          role: 'user', 
          content: `Please generate a professional response to this feedback: "${feedback}"` 
        }
      ],
      max_tokens: responseLength === 'short' ? 150 : responseLength === 'medium' ? 500 : 800,
      temperature: 0.7,
    });

    const response = completion.choices[0]?.message?.content || 'Sorry, I could not generate a response.';

    res.json({ 
      response: response,
      usage: completion.usage 
    });

  } catch (error: any) {
    console.error('Feedback Response Generation Error:', error);
    
    if (error.code === 'insufficient_quota') {
      return res.status(402).json({ error: 'OpenAI API quota exceeded' });
    } else if (error.code === 'invalid_api_key') {
      return res.status(401).json({ error: 'Invalid OpenAI API key' });
    } else if (error.code === 'rate_limit_exceeded') {
      return res.status(429).json({ error: 'Rate limit exceeded. Please try again later.' });
    } else {
      return res.status(500).json({ error: 'Failed to generate feedback response' });
    }
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
  console.log(`OpenAI model: ${process.env.OPENAI_MODEL || 'gpt-4'}`);
});