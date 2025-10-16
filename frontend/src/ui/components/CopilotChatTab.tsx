import React, { useState } from 'react';
import { colors, spacing, typography, borderRadius, buttonStyles, inputStyles } from '../styles';
import { mockChatMessages, quickActions, exampleQueries, ChatMessage } from '../mockData';

const CopilotChatTab: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>(mockChatMessages);
  const [inputValue, setInputValue] = useState('');

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages([...messages, newMessage]);
    setInputValue('');

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: 'I understand your question. Let me help you with that. This is a mock response - in the real implementation, this would connect to your AI backend.',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiResponse]);
    }, 1000);
  };

  const handleQuickAction = (action: string) => {
    setInputValue(action);
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
      </div>

      {/* Quick Actions */}
      <div style={{ 
        padding: `${spacing.sm} ${spacing.md}`,
        borderTop: `1px solid ${colors.border}`,
        backgroundColor: colors.backgroundSecondary,
      }}>
        <div style={{ 
          fontSize: typography.fontSize.xs, 
          color: colors.textSecondary, 
          marginBottom: spacing.sm,
          fontWeight: typography.fontWeight.medium,
        }}>
          Quick Actions
        </div>
        <div style={{ 
          display: 'flex', 
          gap: spacing.sm, 
          flexWrap: 'wrap',
        }}>
          {quickActions.map((action) => (
            <button
              key={action.id}
              onClick={() => handleQuickAction(action.title)}
              style={{
                ...buttonStyles.secondary,
                padding: `${spacing.xs} ${spacing.sm}`,
                fontSize: typography.fontSize.xs,
                display: 'flex',
                alignItems: 'center',
                gap: spacing.xs,
              }}
            >
              <span>{action.icon}</span>
              {action.title}
            </button>
          ))}
        </div>
      </div>

      {/* Example Queries */}
      <div style={{ 
        padding: `${spacing.sm} ${spacing.md}`,
        borderTop: `1px solid ${colors.border}`,
        backgroundColor: colors.backgroundSecondary,
      }}>
        <div style={{ 
          fontSize: typography.fontSize.xs, 
          color: colors.textSecondary, 
          marginBottom: spacing.sm,
          fontWeight: typography.fontWeight.medium,
        }}>
          Try asking:
        </div>
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column',
          gap: spacing.xs,
        }}>
          {exampleQueries.slice(0, 3).map((query, index) => (
            <button
              key={index}
              onClick={() => setInputValue(query)}
              style={{
                ...buttonStyles.secondary,
                padding: `${spacing.xs} ${spacing.sm}`,
                fontSize: typography.fontSize.xs,
                textAlign: 'left',
                justifyContent: 'flex-start',
                backgroundColor: 'transparent',
                border: 'none',
                color: colors.textSecondary,
                cursor: 'pointer',
              }}
            >
              "{query}"
            </button>
          ))}
        </div>
      </div>

      {/* Input Area */}
      <div style={{ 
        padding: spacing.md,
        borderTop: `1px solid ${colors.border}`,
        backgroundColor: colors.white,
      }}>
        <div style={{ display: 'flex', gap: spacing.sm }}>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Ask me anything about your design..."
            style={{
              ...inputStyles.base,
              flex: 1,
              fontSize: typography.fontSize.sm,
            }}
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputValue.trim()}
            style={{
              ...buttonStyles.primary,
              padding: `${spacing.sm} ${spacing.md}`,
              fontSize: typography.fontSize.sm,
            }}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default CopilotChatTab;
