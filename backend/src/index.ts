import express from 'express';
import { Request, Response } from 'express';
import OpenAI from 'openai';
import dotenv from 'dotenv';
import multer from 'multer';

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.use(express.json());

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed'));
    }
  },
});

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

// PDF upload and processing endpoint
app.post('/api/upload-pdf', upload.array('files', 5), async (req: Request, res: Response) => {
  try {
    const files = req.files as Express.Multer.File[];
    
    if (!files || files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded' });
    }

    // In a real app, you would use a PDF parsing library like pdf-parse
    // For now, we'll simulate the processing
    const processedFiles = files.map(file => ({
      name: file.originalname,
      size: file.size,
      extractedText: `[Simulated extracted text from ${file.originalname}]\n\nThis would contain the actual text content extracted from the PDF file. In a real implementation, you would use a library like pdf-parse to extract text content and then parse it to identify different sections like:\n\n• Best Practices\n• Accessibility Standards\n• Brand Guidelines\n• Design System\n• UX Principles\n• Technical Requirements\n\nThe extracted content would then be used to auto-populate the design standards form fields.`,
      sections: {
        bestPractices: 'Extracted best practices content would appear here',
        accessibilityStandards: 'Extracted accessibility standards would appear here',
        brandGuidelines: 'Extracted brand guidelines would appear here',
        designSystem: 'Extracted design system content would appear here',
        userExperiencePrinciples: 'Extracted UX principles would appear here',
        technicalRequirements: 'Extracted technical requirements would appear here',
      }
    }));

    res.json({
      message: `Successfully processed ${files.length} PDF file(s)`,
      files: processedFiles,
      extractedContent: processedFiles.reduce((acc, file) => {
        return {
          bestPractices: acc.bestPractices + (file.sections.bestPractices ? `\n\nFrom ${file.name}:\n${file.sections.bestPractices}` : ''),
          accessibilityStandards: acc.accessibilityStandards + (file.sections.accessibilityStandards ? `\n\nFrom ${file.name}:\n${file.sections.accessibilityStandards}` : ''),
          brandGuidelines: acc.brandGuidelines + (file.sections.brandGuidelines ? `\n\nFrom ${file.name}:\n${file.sections.brandGuidelines}` : ''),
          designSystem: acc.designSystem + (file.sections.designSystem ? `\n\nFrom ${file.name}:\n${file.sections.designSystem}` : ''),
          userExperiencePrinciples: acc.userExperiencePrinciples + (file.sections.userExperiencePrinciples ? `\n\nFrom ${file.name}:\n${file.sections.userExperiencePrinciples}` : ''),
          technicalRequirements: acc.technicalRequirements + (file.sections.technicalRequirements ? `\n\nFrom ${file.name}:\n${file.sections.technicalRequirements}` : ''),
        };
      }, {
        bestPractices: '',
        accessibilityStandards: '',
        brandGuidelines: '',
        designSystem: '',
        userExperiencePrinciples: '',
        technicalRequirements: '',
      })
    });

  } catch (error: any) {
    console.error('PDF Upload Error:', error);
    res.status(500).json({ error: 'Failed to process PDF files' });
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