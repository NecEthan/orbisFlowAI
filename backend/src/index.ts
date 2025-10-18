import express from 'express';
import { Request, Response } from 'express';
import OpenAI from 'openai';
import dotenv from 'dotenv';
// multer removed - no file uploads needed
import uploadDocsRouter from './routes/upload-docs';
import askQuestionRouter from './routes/ask';
import { supabase } from './supabaseClient';
// PDF parsing removed - focusing on text processing only

// Extend Request interface to include user
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

// Load environment variables
dotenv.config({ path: './.env' });

// Text chunking function
const chunkText = (text: string, chunkSize: number = 800, overlap: number = 200): string[] => {
  const words = text.split(/\s+/);
  const chunks: string[] = [];
  let start = 0;
  
  while (start < words.length) {
    const end = Math.min(start + chunkSize, words.length);
    const chunk = words.slice(start, end).join(' ');
    chunks.push(chunk);
    start += chunkSize - overlap;
  }
  
  return chunks;
};

const app = express();
const port = process.env.PORT || 3000;

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'placeholder-key',
});

app.use(express.json());

app.use("/upload-docs", uploadDocsRouter);
app.use("/ask-question", askQuestionRouter);

// File upload configuration removed - focusing on text input only

// Enable CORS for Figma plugin
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

// Auth middleware
const authenticateUser = async (req: Request, res: Response, next: any) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  
  // Check if Supabase is properly configured
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_KEY) {
    return res.status(503).json({ 
      error: 'Authentication service not configured. Please set SUPABASE_URL and SUPABASE_KEY environment variables.' 
    });
  }
  
  // Create Supabase client for authentication
  const { createClient } = require('@supabase/supabase-js');
  const supabaseClient = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);
  
  const { data: { user }, error } = await supabaseClient.auth.getUser(token);
  
  if (error || !user) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
  
  req.user = user;
  next();
};

// Apply authentication to all /api routes
app.use('/api', authenticateUser);

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

// Design standards endpoints
app.post('/api/design-standards', async (req: Request, res: Response) => {
  try {
    const { standards } = req.body;

    if (!standards || typeof standards !== 'object') {
      return res.status(400).json({ error: 'Design standards object is required' });
    }

    // In a real app, this would save to a database
    // For now, we'll just simulate saving
    console.log('Saving design standards:', standards);
    
    res.json({ 
      message: 'Design standards saved successfully',
      standards: standards
    });

  } catch (error: any) {
    console.error('Design Standards Save Error:', error);
    res.status(500).json({ error: 'Failed to save design standards' });
  }
});

app.get('/api/design-standards', async (req: Request, res: Response) => {
  try {
    // In a real app, this would load from a database
    // For now, we'll return empty standards
    const defaultStandards = {
      bestPractices: '',
      accessibilityStandards: '',
      brandGuidelines: '',
      designSystem: '',
      userExperiencePrinciples: '',
      technicalRequirements: '',
    };
    
    res.json({ 
      standards: defaultStandards
    });

  } catch (error: any) {
    console.error('Design Standards Load Error:', error);
    res.status(500).json({ error: 'Failed to load design standards' });
  }
});

// PDF upload endpoint (empty - no PDF processing)
app.post('/api/upload-pdf', (req: Request, res: Response) => {
  res.status(501).json({ 
    error: 'PDF upload not supported. Please use text input in Design Standards instead.',
    message: 'This endpoint is disabled. Use the Design Standards tab to enter text for AI context.'
  });
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

// Jira ticket generation endpoint
app.post('/api/generate-jira-ticket', async (req: Request, res: Response) => {
  try {
    const { input, useDesignStandards = false } = req.body;

    if (!input || typeof input !== 'string') {
      return res.status(400).json({ error: 'Input text is required' });
    }

    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({ error: 'OpenAI API key not configured' });
    }

    // Get design standards if requested
    let designStandardsContext = '';
    if (useDesignStandards) {
      // In a real app, this would load from database
      // For now, we'll use a placeholder
      designStandardsContext = '\n\nDesign Standards Context: Use company design standards and best practices when generating ticket content.';
    }

    const systemPrompt = `You are an AI assistant that helps create well-structured Jira tickets from design feedback, bug reports, or feature requirements.

Your task is to generate a comprehensive Jira ticket with the following structure:
- Title: Clear, concise summary of the issue/requirement
- Description: Detailed explanation with context, steps to reproduce (for bugs), or requirements (for features)
- Priority: Low, Medium, High, or Critical based on impact and urgency
- Type: Bug, Task, Story, or Epic based on the nature of the work
- Labels: Relevant tags for categorization
- Project: Default to "DES" for design-related tickets

Guidelines:
- Use clear, professional language
- Include specific details and context
- For bugs: include steps to reproduce, expected vs actual behavior
- For features: include user stories, acceptance criteria, and business value
- Prioritize based on user impact and business value
- Use appropriate labels for easy filtering and organization

${designStandardsContext}

Return your response as a JSON object with the following structure:
{
  "title": "Clear, descriptive title",
  "description": "Detailed description with context and requirements",
  "priority": "Low|Medium|High|Critical",
  "type": "Bug|Task|Story|Epic",
  "labels": "comma-separated,relevant,labels",
  "assignee": "",
  "project": "DES"
}`;

    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: systemPrompt },
        { 
          role: 'user', 
          content: `Please generate a Jira ticket for: "${input}"` 
        }
      ],
      max_tokens: 800,
      temperature: 0.7,
    });

    const response = completion.choices[0]?.message?.content || '{}';
    
    try {
      const ticket = JSON.parse(response);
      res.json({ 
        ticket: ticket,
        usage: completion.usage 
      });
    } catch (parseError) {
      // Fallback if JSON parsing fails
      res.json({ 
        ticket: {
          title: input.substring(0, 100) + (input.length > 100 ? '...' : ''),
          description: response,
          priority: 'Medium',
          type: 'Task',
          labels: 'design,ai-generated',
          assignee: '',
          project: 'DES'
        },
        usage: completion.usage 
      });
    }

  } catch (error: any) {
    console.error('Jira Ticket Generation Error:', error);
    
    if (error.code === 'insufficient_quota') {
      return res.status(402).json({ error: 'OpenAI API quota exceeded' });
    } else if (error.code === 'invalid_api_key') {
      return res.status(401).json({ error: 'Invalid OpenAI API key' });
    } else if (error.code === 'rate_limit_exceeded') {
      return res.status(429).json({ error: 'Rate limit exceeded. Please try again later.' });
    } else {
      return res.status(500).json({ error: 'Failed to generate Jira ticket' });
    }
  }
});

// Meeting summary endpoint
app.post('/api/summarize-meeting', async (req: Request, res: Response) => {
  try {
    const { transcript, useDesignStandards = false } = req.body;

    if (!transcript || typeof transcript !== 'string') {
      return res.status(400).json({ error: 'Meeting transcript is required' });
    }

    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({ error: 'OpenAI API key not configured' });
    }

    // Get design standards if requested
    let designStandardsContext = '';
    if (useDesignStandards) {
      // In a real app, this would load from database
      // For now, we'll use a placeholder
      designStandardsContext = '\n\nDesign Standards Context: Use company design standards and best practices when analyzing design-related discussions.';
    }

    const systemPrompt = `You are an AI assistant that analyzes meeting transcripts and creates structured summaries.

Your task is to extract and organize the following information from the meeting transcript:
- Key decisions made during the meeting
- Action items with owners and due dates (if mentioned)
- Design-related discussion points and decisions
- Follow-up tasks and next steps
- Meeting attendees (if mentioned)
- Meeting date and duration (if mentioned)

Guidelines:
- Be concise but comprehensive
- Extract specific, actionable items
- Identify design decisions and their rationale
- Note any deadlines or time-sensitive items
- Organize information logically
- Use clear, professional language

${designStandardsContext}

Return your response as a JSON object with the following structure:
{
  "keyDecisions": ["Decision 1", "Decision 2", ...],
  "actionItems": [
    {
      "task": "Specific action item",
      "owner": "Person responsible (if mentioned)",
      "dueDate": "Due date (if mentioned)"
    }
  ],
  "designDiscussion": ["Design point 1", "Design point 2", ...],
  "followUpTasks": ["Task 1", "Task 2", ...],
  "attendees": ["Person 1", "Person 2", ...],
  "meetingDate": "Date if mentioned, otherwise today's date",
  "duration": "Duration if mentioned, otherwise 'Not specified'"
}`;

    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: systemPrompt },
        { 
          role: 'user', 
          content: `Please analyze this meeting transcript and create a structured summary:\n\n${transcript}` 
        }
      ],
      max_tokens: 1200,
      temperature: 0.7,
    });

    const response = completion.choices[0]?.message?.content || '{}';
    
    try {
      const summary = JSON.parse(response);
      res.json({ 
        summary: summary,
        usage: completion.usage 
      });
    } catch (parseError) {
      // Fallback if JSON parsing fails
      const today = new Date().toLocaleDateString();
      res.json({ 
        summary: {
          keyDecisions: ["Meeting decisions extracted from transcript"],
          actionItems: [
            {
              task: "Review meeting transcript for specific action items",
              owner: "Not specified",
              dueDate: "Not specified"
            }
          ],
          designDiscussion: ["Design-related discussions from the meeting"],
          followUpTasks: ["Follow-up tasks identified in the meeting"],
          attendees: ["Meeting attendees"],
          meetingDate: today,
          duration: "Not specified"
        },
        usage: completion.usage 
      });
    }

  } catch (error: any) {
    console.error('Meeting Summary Error:', error);
    
    if (error.code === 'insufficient_quota') {
      return res.status(402).json({ error: 'OpenAI API quota exceeded' });
    } else if (error.code === 'invalid_api_key') {
      return res.status(401).json({ error: 'Invalid OpenAI API key' });
    } else if (error.code === 'rate_limit_exceeded') {
      return res.status(429).json({ error: 'Rate limit exceeded. Please try again later.' });
    } else {
      return res.status(500).json({ error: 'Failed to summarize meeting' });
    }
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
  console.log(`OpenAI model: ${process.env.OPENAI_MODEL || 'gpt-4'}`);
});