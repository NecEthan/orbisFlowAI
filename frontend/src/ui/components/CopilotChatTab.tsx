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
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      position: 'relative',
    }}>
      {/* Background overlay for content readability */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        zIndex: 1,
      }} />
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
        padding: spacing.lg,
        display: 'flex',
        flexDirection: 'column',
        gap: spacing.md,
        position: 'relative',
        zIndex: 2,
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
                padding: `${spacing.md} ${spacing.lg}`,
                borderRadius: '16px',
                background: message.type === 'user' 
                  ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                  : 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.7) 100%)',
                border: message.type === 'user' 
                  ? 'none'
                  : '2px solid rgba(102, 126, 234, 0.2)',
                color: message.type === 'user' ? 'white' : colors.textPrimary,
                fontSize: typography.fontSize.sm,
                lineHeight: typography.lineHeight.normal,
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
                backdropFilter: 'blur(10px)',
                boxShadow: message.type === 'user'
                  ? '0 4px 15px rgba(102, 126, 234, 0.3)'
                  : '0 4px 15px rgba(102, 126, 234, 0.1)',
                transition: 'all 0.3s ease',
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
                padding: `${spacing.md} ${spacing.lg}`,
                borderRadius: '16px',
                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.7) 100%)',
                border: '2px solid rgba(102, 126, 234, 0.2)',
                color: colors.textPrimary,
                fontSize: typography.fontSize.sm,
                display: 'flex',
                alignItems: 'center',
                gap: spacing.xs,
                backdropFilter: 'blur(10px)',
                boxShadow: '0 4px 15px rgba(102, 126, 234, 0.1)',
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
        padding: `${spacing.lg} ${spacing.lg}`,
        borderTop: `1px solid rgba(102, 126, 234, 0.2)`,
        background: 'linear-gradient(90deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.7) 100%)',
        backdropFilter: 'blur(20px)',
        position: 'relative',
        zIndex: 2,
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
                padding: `${spacing.md} ${spacing.lg}`,
                background: 'rgba(255, 255, 255, 0.9)',
                border: '2px solid rgba(102, 126, 234, 0.2)',
                borderRadius: '12px',
                backdropFilter: 'blur(10px)',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 15px rgba(102, 126, 234, 0.1)',
              }}
              onFocus={(e) => {
                e.target.style.border = '2px solid #667eea';
                e.target.style.boxShadow = '0 4px 20px rgba(102, 126, 234, 0.2)';
              }}
              onBlur={(e) => {
                e.target.style.border = '2px solid rgba(102, 126, 234, 0.2)';
                e.target.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.1)';
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
              background: isLoading 
                ? 'linear-gradient(135deg, #a8a8a8 0%, #888888 100%)'
                : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              border: 'none',
              borderRadius: '12px',
              fontWeight: typography.fontWeight.semibold,
              color: 'white',
              boxShadow: '0 6px 20px rgba(102, 126, 234, 0.3)',
              transition: 'all 0.3s ease',
              transform: 'translateY(0)',
              cursor: isLoading ? 'not-allowed' : 'pointer',
            }}
            onMouseEnter={(e) => {
              if (!isLoading) {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 8px 25px rgba(102, 126, 234, 0.4)';
              }
            }}
            onMouseLeave={(e) => {
              if (!isLoading) {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.3)';
              }
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
