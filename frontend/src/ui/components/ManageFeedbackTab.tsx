import React, { useState } from 'react';
import { colors, spacing, typography, borderRadius, buttonStyles, inputStyles, cardStyles } from '../styles';
import { mockFeedbackAnalytics, mockJiraTickets, JiraTicket } from '../mockData';
import { apiClient } from '../../lib/apiClient';

const ManageFeedbackTab: React.FC = () => {
  const [activeSection, setActiveSection] = useState<'response' | 'analytics' | 'jira'>('response');
  const [feedbackInput, setFeedbackInput] = useState('');
  const [generatedResponse, setGeneratedResponse] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [feedbackType, setFeedbackType] = useState<'subjective' | 'objective'>('subjective');
  const [responseLength, setResponseLength] = useState<'short' | 'medium' | 'long'>('medium');
  const [newTicket, setNewTicket] = useState({
    title: '',
    description: '',
    priority: 'Medium' as 'Low' | 'Medium' | 'High',
  });

  const handleGenerateResponse = async () => {
    if (!feedbackInput.trim()) return;

    setIsGenerating(true);
    setError(null);
    setGeneratedResponse('');
    
    try {
      const response = await apiClient('/api/feedback-response', {
        method: 'POST',
        body: JSON.stringify({ 
          feedback: feedbackInput.trim(),
          feedbackType: feedbackType,
          responseLength: responseLength
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate response');
      }

      const data = await response.json();
      setGeneratedResponse(data.response);
    } catch (err: any) {
      setError(err.message || 'An error occurred while generating the response');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCreateTicket = () => {
    if (!newTicket.title.trim()) return;

    // Simulate ticket creation
    const ticket: JiraTicket = {
      id: Date.now().toString(),
      key: `DES-${Math.floor(Math.random() * 1000)}`,
      title: newTicket.title,
      status: 'To Do',
      priority: newTicket.priority,
      assignee: 'Unassigned',
      created: new Date(),
    };

    // In a real app, this would make an API call
    console.log('Creating ticket:', ticket);
    
    // Reset form
    setNewTicket({
      title: '',
      description: '',
      priority: 'Medium',
    });
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return '📈';
      case 'down': return '📉';
      case 'stable': return '➡️';
      default: return '➡️';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return colors.error;
      case 'Medium': return colors.warning;
      case 'Low': return colors.success;
      default: return colors.gray500;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'To Do': return colors.gray500;
      case 'In Progress': return colors.primary;
      case 'Done': return colors.success;
      default: return colors.gray500;
    }
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
      
      {/* Section Navigation */}
      <div style={{ 
        display: 'flex',
        borderBottom: `1px solid rgba(102, 126, 234, 0.2)`,
        background: 'linear-gradient(90deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.7) 100%)',
        backdropFilter: 'blur(20px)',
        position: 'relative',
        zIndex: 2,
      }}>
        {[
          { id: 'response', label: 'Response Generator', icon: '💬' },
          { id: 'analytics', label: 'Analytics', icon: '📊' },
          { id: 'jira', label: 'Jira Integration', icon: '🎫' },
        ].map((section) => (
          <button
            key={section.id}
            onClick={() => setActiveSection(section.id as any)}
            style={{
              ...buttonStyles.secondary,
              border: 'none',
              borderRadius: 0,
              borderBottom: activeSection === section.id ? `3px solid #667eea` : '3px solid transparent',
              background: activeSection === section.id 
                ? 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)'
                : 'transparent',
              color: activeSection === section.id ? '#667eea' : colors.textSecondary,
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: spacing.xs,
              fontSize: typography.fontSize.sm,
              fontWeight: activeSection === section.id ? typography.fontWeight.semibold : typography.fontWeight.medium,
              transition: 'all 0.3s ease',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <span>{section.icon}</span>
            {section.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflowY: 'auto', position: 'relative', zIndex: 2 }}>
        {activeSection === 'response' && (
          <div style={{ 
            padding: spacing.lg, 
            display: 'flex', 
            flexDirection: 'column', 
            gap: spacing.lg,
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
            backdropFilter: 'blur(10px)',
            borderRadius: '20px 20px 0 0',
            margin: '0 10px',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderBottom: 'none',
          }}>
            <div>
              <h3 style={{ 
                margin: `0 0 ${spacing.sm} 0`,
                fontSize: typography.fontSize.lg,
                fontWeight: typography.fontWeight.bold,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>
                ✨ Generate Professional Response
              </h3>
              <p style={{ 
                margin: 0,
                fontSize: typography.fontSize.sm,
                color: colors.textSecondary,
                opacity: 0.8,
              }}>
                Paste stakeholder feedback below to generate a respectful, professional response.
              </p>
            </div>

            <div>
              <label style={{ 
                display: 'block',
                fontSize: typography.fontSize.sm,
                fontWeight: typography.fontWeight.medium,
                color: colors.textPrimary,
                marginBottom: spacing.xs,
              }}>
                Feedback to respond to:
              </label>
              <textarea
                value={feedbackInput}
                onChange={(e) => setFeedbackInput(e.target.value)}
                placeholder="Paste the feedback comment here..."
                style={{
                  ...inputStyles.base,
                  minHeight: '100px',
                  resize: 'vertical',
                  fontFamily: typography.fontFamily,
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

            {/* Response Options - Compact */}
            <div style={{ display: 'flex', gap: spacing.md, alignItems: 'center' }}>
              {/* Feedback Type Toggle */}
              <div style={{ display: 'flex', alignItems: 'center', gap: spacing.xs }}>
                <span style={{ 
                  fontSize: typography.fontSize.xs,
                  fontWeight: typography.fontWeight.medium,
                  color: colors.textSecondary,
                }}>
                  Type:
                </span>
                <div style={{ display: 'flex', gap: '4px' }}>
                  {[
                    { value: 'subjective', label: 'Subjective', icon: '🎨' },
                    { value: 'objective', label: 'Objective', icon: '📋' }
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setFeedbackType(option.value as 'subjective' | 'objective')}
                      style={{
                        padding: '4px 8px',
                        border: `1px solid ${feedbackType === option.value ? '#667eea' : 'rgba(102, 126, 234, 0.2)'}`,
                        borderRadius: '6px',
                        background: feedbackType === option.value 
                          ? 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)'
                          : 'rgba(255, 255, 255, 0.5)',
                        color: feedbackType === option.value ? '#667eea' : colors.textSecondary,
                        fontSize: '11px',
                        fontWeight: typography.fontWeight.medium,
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        backdropFilter: 'blur(10px)',
                        boxShadow: feedbackType === option.value 
                          ? '0 1px 4px rgba(102, 126, 234, 0.2)'
                          : '0 1px 2px rgba(102, 126, 234, 0.1)',
                      }}
                      onMouseEnter={(e) => {
                        if (feedbackType !== option.value) {
                          e.currentTarget.style.background = 'rgba(102, 126, 234, 0.05)';
                          e.currentTarget.style.border = '1px solid rgba(102, 126, 234, 0.3)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (feedbackType !== option.value) {
                          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.5)';
                          e.currentTarget.style.border = '1px solid rgba(102, 126, 234, 0.2)';
                        }
                      }}
                    >
                      <span style={{ fontSize: '12px' }}>{option.icon}</span>
                      <span>{option.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Response Length Toggle */}
              <div style={{ display: 'flex', alignItems: 'center', gap: spacing.xs }}>
                <span style={{ 
                  fontSize: typography.fontSize.xs,
                  fontWeight: typography.fontWeight.medium,
                  color: colors.textSecondary,
                }}>
                  Length:
                </span>
                <div style={{ display: 'flex', gap: '4px' }}>
                  {[
                    { value: 'short', label: 'Short', icon: '📝' },
                    { value: 'medium', label: 'Medium', icon: '📄' },
                    { value: 'long', label: 'Long', icon: '📋' }
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setResponseLength(option.value as 'short' | 'medium' | 'long')}
                      style={{
                        padding: '4px 8px',
                        border: `1px solid ${responseLength === option.value ? '#667eea' : 'rgba(102, 126, 234, 0.2)'}`,
                        borderRadius: '6px',
                        background: responseLength === option.value 
                          ? 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)'
                          : 'rgba(255, 255, 255, 0.5)',
                        color: responseLength === option.value ? '#667eea' : colors.textSecondary,
                        fontSize: '11px',
                        fontWeight: typography.fontWeight.medium,
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        backdropFilter: 'blur(10px)',
                        boxShadow: responseLength === option.value 
                          ? '0 1px 4px rgba(102, 126, 234, 0.2)'
                          : '0 1px 2px rgba(102, 126, 234, 0.1)',
                      }}
                      onMouseEnter={(e) => {
                        if (responseLength !== option.value) {
                          e.currentTarget.style.background = 'rgba(102, 126, 234, 0.05)';
                          e.currentTarget.style.border = '1px solid rgba(102, 126, 234, 0.3)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (responseLength !== option.value) {
                          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.5)';
                          e.currentTarget.style.border = '1px solid rgba(102, 126, 234, 0.2)';
                        }
                      }}
                    >
                      <span style={{ fontSize: '12px' }}>{option.icon}</span>
                      <span>{option.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={handleGenerateResponse}
              disabled={!feedbackInput.trim() || isGenerating}
              style={{
                ...buttonStyles.primary,
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: spacing.sm,
                background: isGenerating 
                  ? 'linear-gradient(135deg, #a8a8a8 0%, #888888 100%)'
                  : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                border: 'none',
                borderRadius: '12px',
                padding: `${spacing.md} ${spacing.lg}`,
                fontSize: typography.fontSize.md,
                fontWeight: typography.fontWeight.semibold,
                color: 'white',
                boxShadow: '0 6px 20px rgba(102, 126, 234, 0.3)',
                transition: 'all 0.3s ease',
                transform: 'translateY(0)',
                cursor: isGenerating ? 'not-allowed' : 'pointer',
              }}
              onMouseEnter={(e) => {
                if (!isGenerating) {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 8px 25px rgba(102, 126, 234, 0.4)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isGenerating) {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.3)';
                }
              }}
            >
              {isGenerating ? (
                <>
                  <span>🔄</span>
                  Generating Response...
                </>
              ) : (
                <>
                  <span>✨</span>
                  Generate Response
                </>
              )}
            </button>

            {error && (
              <div style={{
                ...cardStyles.base,
                background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(220, 38, 38, 0.1) 100%)',
                border: '2px solid rgba(239, 68, 68, 0.3)',
                borderRadius: '12px',
                backdropFilter: 'blur(10px)',
                boxShadow: '0 4px 15px rgba(239, 68, 68, 0.1)',
              }}>
                <div style={{ 
                  fontSize: typography.fontSize.sm,
                  fontWeight: typography.fontWeight.semibold,
                  color: '#DC2626',
                  marginBottom: spacing.sm,
                  display: 'flex',
                  alignItems: 'center',
                  gap: spacing.xs,
                }}>
                  ⚠️ Error:
                </div>
                <div style={{
                  fontSize: typography.fontSize.sm,
                  color: '#DC2626',
                  lineHeight: typography.lineHeight.normal,
                }}>
                  {error}
                </div>
              </div>
            )}

            {generatedResponse && (
              <div style={{
                ...cardStyles.base,
                background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, rgba(16, 185, 129, 0.1) 100%)',
                border: '2px solid rgba(34, 197, 94, 0.3)',
                borderRadius: '12px',
                backdropFilter: 'blur(10px)',
                boxShadow: '0 4px 15px rgba(34, 197, 94, 0.1)',
              }}>
                <div style={{ 
                  fontSize: typography.fontSize.sm,
                  fontWeight: typography.fontWeight.semibold,
                  color: '#059669',
                  marginBottom: spacing.sm,
                  display: 'flex',
                  alignItems: 'center',
                  gap: spacing.xs,
                }}>
                  ✨ Generated Response:
                </div>
                <div style={{
                  fontSize: typography.fontSize.sm,
                  color: colors.textSecondary,
                  lineHeight: typography.lineHeight.normal,
                  whiteSpace: 'pre-wrap',
                  background: 'rgba(255, 255, 255, 0.5)',
                  padding: spacing.md,
                  borderRadius: '8px',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                }}>
                  {generatedResponse}
                </div>
                <button
                  onClick={() => navigator.clipboard.writeText(generatedResponse)}
                  style={{
                    ...buttonStyles.secondary,
                    marginTop: spacing.sm,
                    fontSize: typography.fontSize.xs,
                    background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, rgba(16, 185, 129, 0.1) 100%)',
                    border: '1px solid rgba(34, 197, 94, 0.3)',
                    borderRadius: '8px',
                    color: '#059669',
                    fontWeight: typography.fontWeight.medium,
                    transition: 'all 0.3s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'linear-gradient(135deg, rgba(34, 197, 94, 0.2) 0%, rgba(16, 185, 129, 0.2) 100%)';
                    e.currentTarget.style.transform = 'translateY(-1px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, rgba(16, 185, 129, 0.1) 100%)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  📋 Copy to Clipboard
                </button>
              </div>
            )}
          </div>
        )}

        {activeSection === 'analytics' && (
          <div style={{ 
            padding: spacing.lg, 
            display: 'flex', 
            flexDirection: 'column', 
            gap: spacing.lg,
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
            backdropFilter: 'blur(10px)',
            borderRadius: '20px 20px 0 0',
            margin: '0 10px',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderBottom: 'none',
          }}>
            <h3 style={{ 
              margin: 0,
              fontSize: typography.fontSize.lg,
              fontWeight: typography.fontWeight.bold,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              📊 Feedback Analytics
            </h3>

            {/* Summary Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: spacing.md }}>
              <div style={{ 
                ...cardStyles.base, 
                textAlign: 'center',
                background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
                border: '2px solid rgba(102, 126, 234, 0.2)',
                borderRadius: '12px',
                backdropFilter: 'blur(10px)',
                boxShadow: '0 4px 15px rgba(102, 126, 234, 0.1)',
              }}>
                <div style={{ 
                  fontSize: '28px', 
                  fontWeight: typography.fontWeight.bold, 
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}>
                  {mockFeedbackAnalytics.totalComments}
                </div>
                <div style={{ fontSize: typography.fontSize.sm, color: colors.textSecondary, fontWeight: typography.fontWeight.medium }}>
                  Total Comments
                </div>
              </div>
              <div style={{ 
                ...cardStyles.base, 
                textAlign: 'center',
                background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, rgba(16, 185, 129, 0.1) 100%)',
                border: '2px solid rgba(34, 197, 94, 0.2)',
                borderRadius: '12px',
                backdropFilter: 'blur(10px)',
                boxShadow: '0 4px 15px rgba(34, 197, 94, 0.1)',
              }}>
                <div style={{ 
                  fontSize: '28px', 
                  fontWeight: typography.fontWeight.bold, 
                  color: '#059669',
                }}>
                  {mockFeedbackAnalytics.resolvedComments}
                </div>
                <div style={{ fontSize: typography.fontSize.sm, color: colors.textSecondary, fontWeight: typography.fontWeight.medium }}>
                  Resolved
                </div>
              </div>
            </div>

            <div style={{ 
              ...cardStyles.base, 
              textAlign: 'center',
              background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.1) 0%, rgba(217, 119, 6, 0.1) 100%)',
              border: '2px solid rgba(245, 158, 11, 0.2)',
              borderRadius: '12px',
              backdropFilter: 'blur(10px)',
              boxShadow: '0 4px 15px rgba(245, 158, 11, 0.1)',
            }}>
              <div style={{ 
                fontSize: '28px', 
                fontWeight: typography.fontWeight.bold, 
                color: '#D97706',
              }}>
                {mockFeedbackAnalytics.averageResponseTime}
              </div>
              <div style={{ fontSize: typography.fontSize.sm, color: colors.textSecondary, fontWeight: typography.fontWeight.medium }}>
                Avg Response Time
              </div>
            </div>

            {/* Top Issues */}
            <div>
              <h4 style={{ 
                margin: `0 0 ${spacing.sm} 0`,
                fontSize: typography.fontSize.sm,
                fontWeight: typography.fontWeight.medium,
                color: colors.textPrimary,
              }}>
                Top Issues
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.sm }}>
                {mockFeedbackAnalytics.topIssues.map((issue, index) => (
                  <div key={index} style={{ ...cardStyles.base, padding: spacing.sm }}>
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}>
                      <span style={{ 
                        fontSize: typography.fontSize.sm,
                        color: colors.textPrimary,
                      }}>
                        {issue.issue}
                      </span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: spacing.sm }}>
                        <span style={{ 
                          fontSize: typography.fontSize.sm,
                          fontWeight: typography.fontWeight.medium,
                          color: colors.textPrimary,
                        }}>
                          {issue.count}
                        </span>
                        <span style={{ fontSize: '14px' }}>
                          {getTrendIcon(issue.trend)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeSection === 'jira' && (
          <div style={{ 
            padding: spacing.lg, 
            display: 'flex', 
            flexDirection: 'column', 
            gap: spacing.lg,
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
            backdropFilter: 'blur(10px)',
            borderRadius: '20px 20px 0 0',
            margin: '0 10px',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderBottom: 'none',
          }}>
            <h3 style={{ 
              margin: 0,
              fontSize: typography.fontSize.lg,
              fontWeight: typography.fontWeight.bold,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              🎫 Jira Integration
            </h3>

            {/* Create Ticket Form */}
            <div style={{ 
              ...cardStyles.base,
              background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
              border: '2px solid rgba(102, 126, 234, 0.2)',
              borderRadius: '12px',
              backdropFilter: 'blur(10px)',
              boxShadow: '0 4px 15px rgba(102, 126, 234, 0.1)',
            }}>
              <h4 style={{ 
                margin: `0 0 ${spacing.sm} 0`,
                fontSize: typography.fontSize.sm,
                fontWeight: typography.fontWeight.medium,
                color: colors.textPrimary,
              }}>
                Create New Ticket
              </h4>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.sm }}>
                <input
                  type="text"
                  placeholder="Ticket title..."
                  value={newTicket.title}
                  onChange={(e) => setNewTicket({ ...newTicket, title: e.target.value })}
                  style={inputStyles.base}
                />
                
                <textarea
                  placeholder="Description..."
                  value={newTicket.description}
                  onChange={(e) => setNewTicket({ ...newTicket, description: e.target.value })}
                  style={{
                    ...inputStyles.base,
                    minHeight: '60px',
                    resize: 'vertical',
                  }}
                />
                
                <select
                  value={newTicket.priority}
                  onChange={(e) => setNewTicket({ ...newTicket, priority: e.target.value as any })}
                  style={inputStyles.base}
                >
                  <option value="Low">Low Priority</option>
                  <option value="Medium">Medium Priority</option>
                  <option value="High">High Priority</option>
                </select>
                
                <button
                  onClick={handleCreateTicket}
                  disabled={!newTicket.title.trim()}
                  style={{
                    ...buttonStyles.primary,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: spacing.sm,
                  }}
                >
                  <span>🎫</span>
                  Create Ticket
                </button>
              </div>
            </div>

            {/* Recent Tickets */}
            <div>
              <h4 style={{ 
                margin: `0 0 ${spacing.sm} 0`,
                fontSize: typography.fontSize.sm,
                fontWeight: typography.fontWeight.medium,
                color: colors.textPrimary,
              }}>
                Recent Tickets
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.sm }}>
                {mockJiraTickets.map((ticket) => (
                  <div key={ticket.id} style={{ ...cardStyles.base, padding: spacing.sm }}>
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      marginBottom: spacing.xs,
                    }}>
                      <div>
                        <div style={{ 
                          fontSize: typography.fontSize.sm,
                          fontWeight: typography.fontWeight.medium,
                          color: colors.textPrimary,
                        }}>
                          {ticket.key}: {ticket.title}
                        </div>
                        <div style={{ 
                          fontSize: typography.fontSize.xs,
                          color: colors.textSecondary,
                        }}>
                          Assigned to {ticket.assignee}
                        </div>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: spacing.xs }}>
                        <span style={{
                          padding: `${spacing.xs} ${spacing.sm}`,
                          borderRadius: borderRadius.sm,
                          fontSize: typography.fontSize.xs,
                          fontWeight: typography.fontWeight.medium,
                          backgroundColor: getStatusColor(ticket.status),
                          color: colors.white,
                        }}>
                          {ticket.status}
                        </span>
                        <span style={{
                          padding: `${spacing.xs} ${spacing.sm}`,
                          borderRadius: borderRadius.sm,
                          fontSize: typography.fontSize.xs,
                          fontWeight: typography.fontWeight.medium,
                          backgroundColor: getPriorityColor(ticket.priority),
                          color: colors.white,
                        }}>
                          {ticket.priority}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageFeedbackTab;
