import React, { useState } from 'react';
import { colors, spacing, typography, borderRadius, buttonStyles, inputStyles } from '../styles';
import { exampleQueries, ChatMessage } from '../mockData';

const CopilotChatTab: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      type: 'assistant',
      content: 'Hello! I\'m your AI Design Copilot. I can help you with feedback responses, design critiques, and design system questions. What would you like to know?',
      timestamp: new Date(),
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, newMessage]);
    setInputValue('');
    setIsLoading(true);
    setError(null);

    try {
      // Convert messages to OpenAI format
      const openaiMessages = messages.map(msg => ({
        role: msg.type === 'user' ? 'user' as const : 'assistant' as const,
        content: msg.content
      }));

      // Add the new user message
      openaiMessages.push({
        role: 'user',
        content: inputValue
      });

      const response = await fetch('http://localhost:3000/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messages: openaiMessages }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to get AI response');
      }

      const data = await response.json();
      
      const aiResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: data.message,
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, aiResponse]);
    } catch (err: any) {
      console.error('Chat error:', err);
      setError(err.message || 'Failed to get AI response');
      
      // Add error message to chat
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: `Sorry, I encountered an error: ${err.message || 'Failed to get AI response'}. Please check your API key and try again.`,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };


  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      height: '100%',
      backgroundColor: colors.background,
    }}>
      <style>
        {`
          @keyframes typing {
            0%, 60%, 100% {
              transform: translateY(0);
              opacity: 0.4;
            }
            30% {
              transform: translateY(-10px);
              opacity: 1;
            }
          }
        `}
      </style>
      {/* Messages Area */}
      <div style={{ 
        flex: 1, 
        overflowY: 'auto', 
        padding: spacing.md,
        display: 'flex',
        flexDirection: 'column',
        gap: spacing.md,
      }}>
        {messages.map((message) => (
          <div
            key={message.id}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: message.type === 'user' ? 'flex-end' : 'flex-start',
            }}
          >
            <div
              style={{
                maxWidth: '80%',
                padding: `${spacing.sm} ${spacing.md}`,
                borderRadius: borderRadius.lg,
                backgroundColor: message.type === 'user' ? colors.primary : colors.backgroundSecondary,
                color: message.type === 'user' ? colors.textInverse : colors.textPrimary,
                fontSize: typography.fontSize.sm,
                lineHeight: typography.lineHeight.normal,
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
              }}
            >
              {message.content}
            </div>
            <div
              style={{
                fontSize: typography.fontSize.xs,
                color: colors.textTertiary,
                marginTop: spacing.xs,
                padding: `0 ${spacing.sm}`,
              }}
            >
              {formatTime(message.timestamp)}
            </div>
          </div>
        ))}
        
        {/* Typing Indicator */}
        {isLoading && (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
            }}
          >
            <div
              style={{
                maxWidth: '80%',
                padding: `${spacing.sm} ${spacing.md}`,
                borderRadius: borderRadius.lg,
                backgroundColor: colors.backgroundSecondary,
                color: colors.textPrimary,
                fontSize: typography.fontSize.sm,
                display: 'flex',
                alignItems: 'center',
                gap: spacing.xs,
              }}
            >
              <span>AI is thinking</span>
              <div style={{ display: 'flex', gap: '2px' }}>
                <div
                  style={{
                    width: '4px',
                    height: '4px',
                    borderRadius: '50%',
                    backgroundColor: colors.textSecondary,
                    animation: 'typing 1.4s infinite ease-in-out',
                  }}
                />
                <div
                  style={{
                    width: '4px',
                    height: '4px',
                    borderRadius: '50%',
                    backgroundColor: colors.textSecondary,
                    animation: 'typing 1.4s infinite ease-in-out 0.2s',
                  }}
                />
                <div
                  style={{
                    width: '4px',
                    height: '4px',
                    borderRadius: '50%',
                    backgroundColor: colors.textSecondary,
                    animation: 'typing 1.4s infinite ease-in-out 0.4s',
                  }}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div style={{ 
        padding: `${spacing.md} ${spacing.lg}`,
        borderTop: `1px solid ${colors.border}`,
        backgroundColor: colors.white,
      }}>
        <div style={{ display: 'flex', gap: spacing.md, alignItems: 'flex-end' }}>
          <div style={{ flex: 1 }}>
            <label style={{
              display: 'block',
              fontSize: typography.fontSize.sm,
              fontWeight: typography.fontWeight.medium,
              color: colors.textPrimary,
              marginBottom: spacing.xs,
            }}>
              Ask your AI Design Copilot:
            </label>
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="What fields are required for user signup? How should I respond to feedback about colors?"
              style={{
                ...inputStyles.base,
                width: '100%',
                fontSize: typography.fontSize.sm,
                padding: `${spacing.md} ${spacing.md}`,
              }}
            />
          </div>
          <button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isLoading}
            style={{
              ...buttonStyles.primary,
              padding: `${spacing.md} ${spacing.lg}`,
              fontSize: typography.fontSize.sm,
              minWidth: '80px',
              opacity: (!inputValue.trim() || isLoading) ? 0.6 : 1,
              cursor: (!inputValue.trim() || isLoading) ? 'not-allowed' : 'pointer',
            }}
          >
            {isLoading ? 'Sending...' : 'Send'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CopilotChatTab;
