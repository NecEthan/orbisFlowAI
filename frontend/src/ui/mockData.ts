// Mock Data for AI Design Copilot

export interface ChatMessage {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface DesignReviewResult {
  id: string;
  type: 'compliance' | 'ux' | 'accessibility' | 'performance';
  severity: 'low' | 'medium' | 'high';
  title: string;
  description: string;
  suggestion: string;
  status: 'new' | 'acknowledged' | 'fixed';
}

export interface FeedbackAnalytics {
  totalComments: number;
  resolvedComments: number;
  averageResponseTime: string;
  topIssues: Array<{
    issue: string;
    count: number;
    trend: 'up' | 'down' | 'stable';
  }>;
}

export interface JiraTicket {
  id: string;
  key: string;
  title: string;
  status: 'To Do' | 'In Progress' | 'Done';
  priority: 'Low' | 'Medium' | 'High';
  assignee: string;
  created: Date;
}

// Mock Chat Messages
export const mockChatMessages: ChatMessage[] = [
  {
    id: '1',
    type: 'assistant',
    content: 'Hi! I\'m your AI Design Copilot. I can help you with feedback responses, design reviews, and finding information. What would you like to work on?',
    timestamp: new Date(Date.now() - 300000), // 5 minutes ago
  },
  {
    id: '2',
    type: 'user',
    content: 'What fields are required for user signup?',
    timestamp: new Date(Date.now() - 240000), // 4 minutes ago
  },
  {
    id: '3',
    type: 'assistant',
    content: 'Based on your product requirements, the signup form needs:\n\n• Email (required)\n• Password (required)\n• Phone number (required for compliance)\n• Full name (required)\n• Terms acceptance (required)\n\nOptional fields:\n• Company name\n• Job title\n• Marketing preferences',
    timestamp: new Date(Date.now() - 180000), // 3 minutes ago
  },
  {
    id: '4',
    type: 'user',
    content: 'How should I respond to feedback about button colors?',
    timestamp: new Date(Date.now() - 120000), // 2 minutes ago
  },
  {
    id: '5',
    type: 'assistant',
    content: 'For subjective feedback like button colors, I recommend:\n\n"Thanks for the feedback! The current blue (#18A0FB) aligns with our brand guidelines and accessibility standards (4.5:1 contrast ratio). However, I\'d be happy to explore alternatives. Would you prefer:\n\n• A darker blue for more contrast?\n• A different color that still meets accessibility requirements?\n• A/B testing different options?\n\nLet me know your preference and I can create some variations."',
    timestamp: new Date(Date.now() - 60000), // 1 minute ago
  },
];

// Mock Design Review Results
export const mockDesignReviewResults: DesignReviewResult[] = [
  {
    id: '1',
    type: 'compliance',
    severity: 'high',
    title: 'Missing Required Phone Field',
    description: 'The signup form is missing a required phone number field based on compliance documentation.',
    suggestion: 'Add a phone number input field with proper validation and formatting.',
    status: 'new',
  },
  {
    id: '2',
    type: 'ux',
    severity: 'medium',
    title: 'Button Placement May Hurt Conversion',
    description: 'The primary CTA button placement might impact mobile conversion rates based on Q3 usability data.',
    suggestion: 'Consider moving the button above the fold or using a sticky footer for mobile.',
    status: 'acknowledged',
  },
  {
    id: '3',
    type: 'accessibility',
    severity: 'medium',
    title: 'Insufficient Color Contrast',
    description: 'Text color #999999 on white background has a contrast ratio of 2.85:1, below the WCAG AA standard.',
    suggestion: 'Change text color to #666666 or darker to achieve at least 4.5:1 contrast ratio.',
    status: 'new',
  },
  {
    id: '4',
    type: 'performance',
    severity: 'low',
    title: 'Large Image Assets',
    description: 'Hero images are not optimized and may impact loading times on slower connections.',
    suggestion: 'Compress images and consider using WebP format with fallbacks.',
    status: 'fixed',
  },
];

// Mock Feedback Analytics
export const mockFeedbackAnalytics: FeedbackAnalytics = {
  totalComments: 47,
  resolvedComments: 32,
  averageResponseTime: '2.3 hours',
  topIssues: [
    {
      issue: 'Color and styling feedback',
      count: 12,
      trend: 'down',
    },
    {
      issue: 'Accessibility concerns',
      count: 8,
      trend: 'up',
    },
    {
      issue: 'Layout and spacing',
      count: 6,
      trend: 'stable',
    },
    {
      issue: 'Content and copy',
      count: 5,
      trend: 'down',
    },
  ],
};

// Mock Jira Tickets
export const mockJiraTickets: JiraTicket[] = [
  {
    id: '1',
    key: 'DES-123',
    title: 'Add phone number field to signup form',
    status: 'In Progress',
    priority: 'High',
    assignee: 'Sarah Chen',
    created: new Date(Date.now() - 86400000), // 1 day ago
  },
  {
    id: '2',
    key: 'DES-124',
    title: 'Improve button contrast for accessibility',
    status: 'To Do',
    priority: 'Medium',
    assignee: 'Mike Johnson',
    created: new Date(Date.now() - 172800000), // 2 days ago
  },
  {
    id: '3',
    key: 'DES-125',
    title: 'Optimize hero images for performance',
    status: 'Done',
    priority: 'Low',
    assignee: 'Alex Rivera',
    created: new Date(Date.now() - 259200000), // 3 days ago
  },
];

// Quick Action Examples
export const quickActions = [
  {
    id: '1',
    title: 'Ask about requirements',
    description: 'Get instant answers about product specs',
    icon: '📋',
  },
  {
    id: '2',
    title: 'Get feedback help',
    description: 'Generate professional responses',
    icon: '💬',
  },
  {
    id: '3',
    title: 'Find design info',
    description: 'Search design system and guidelines',
    icon: '🔍',
  },
  {
    id: '4',
    title: 'Review design',
    description: 'Run compliance and UX checks',
    icon: '🔍',
  },
];

// Example Queries
export const exampleQueries = [
  'What are the required fields for user registration?',
  'How should I respond to color feedback?',
  'What\'s the accessibility standard for button contrast?',
  'Show me the latest design system updates',
  'Generate a response for layout feedback',
];
