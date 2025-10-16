import React, { useState } from 'react';
import { colors, spacing, typography, borderRadius, buttonStyles, inputStyles, cardStyles } from '../styles';
import { mockFeedbackAnalytics, mockJiraTickets, JiraTicket } from '../mockData';

const ManageFeedbackTab: React.FC = () => {
  const [activeSection, setActiveSection] = useState<'response' | 'analytics' | 'jira'>('response');
  const [feedbackInput, setFeedbackInput] = useState('');
  const [generatedResponse, setGeneratedResponse] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [newTicket, setNewTicket] = useState({
    title: '',
    description: '',
    priority: 'Medium' as 'Low' | 'Medium' | 'High',
  });

  const handleGenerateResponse = () => {
    if (!feedbackInput.trim()) return;

    setIsGenerating(true);
    
    // Simulate AI response generation
    setTimeout(() => {
      const mockResponse = `Thank you for the feedback! I appreciate you taking the time to share your thoughts.

Regarding your comment about "${feedbackInput}", I'd like to address this thoughtfully:

• I understand your concern and will review this with the team
• Let me provide some context about the design decisions made
• I'd be happy to explore alternative approaches if needed

Would you be available for a quick call to discuss this further? I'd love to hear more about your perspective and work together on a solution that meets everyone's needs.

Best regards,
Design Team`;

      setGeneratedResponse(mockResponse);
      setIsGenerating(false);
    }, 1500);
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
      backgroundColor: colors.background,
    }}>
      {/* Section Navigation */}
      <div style={{ 
        display: 'flex',
        borderBottom: `1px solid ${colors.border}`,
        backgroundColor: colors.white,
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
              borderBottom: activeSection === section.id ? `2px solid ${colors.primary}` : '2px solid transparent',
              backgroundColor: activeSection === section.id ? colors.backgroundSecondary : 'transparent',
              color: activeSection === section.id ? colors.primary : colors.textSecondary,
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: spacing.xs,
              fontSize: typography.fontSize.sm,
            }}
          >
            <span>{section.icon}</span>
            {section.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflowY: 'auto' }}>
        {activeSection === 'response' && (
          <div style={{ padding: spacing.md, display: 'flex', flexDirection: 'column', gap: spacing.md }}>
            <div>
              <h3 style={{ 
                margin: `0 0 ${spacing.sm} 0`,
                fontSize: typography.fontSize.md,
                fontWeight: typography.fontWeight.semibold,
                color: colors.textPrimary,
              }}>
                Generate Professional Response
              </h3>
              <p style={{ 
                margin: 0,
                fontSize: typography.fontSize.sm,
                color: colors.textSecondary,
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
                  minHeight: '80px',
                  resize: 'vertical',
                  fontFamily: typography.fontFamily,
                }}
              />
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

            {generatedResponse && (
              <div style={{
                ...cardStyles.base,
                backgroundColor: colors.backgroundSecondary,
              }}>
                <div style={{ 
                  fontSize: typography.fontSize.sm,
                  fontWeight: typography.fontWeight.medium,
                  color: colors.textPrimary,
                  marginBottom: spacing.sm,
                }}>
                  Generated Response:
                </div>
                <div style={{
                  fontSize: typography.fontSize.sm,
                  color: colors.textSecondary,
                  lineHeight: typography.lineHeight.normal,
                  whiteSpace: 'pre-wrap',
                }}>
                  {generatedResponse}
                </div>
                <button
                  onClick={() => navigator.clipboard.writeText(generatedResponse)}
                  style={{
                    ...buttonStyles.secondary,
                    marginTop: spacing.sm,
                    fontSize: typography.fontSize.xs,
                  }}
                >
                  📋 Copy to Clipboard
                </button>
              </div>
            )}
          </div>
        )}

        {activeSection === 'analytics' && (
          <div style={{ padding: spacing.md, display: 'flex', flexDirection: 'column', gap: spacing.md }}>
            <h3 style={{ 
              margin: 0,
              fontSize: typography.fontSize.md,
              fontWeight: typography.fontWeight.semibold,
              color: colors.textPrimary,
            }}>
              Feedback Analytics
            </h3>

            {/* Summary Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: spacing.sm }}>
              <div style={{ ...cardStyles.base, textAlign: 'center' }}>
                <div style={{ fontSize: '24px', fontWeight: typography.fontWeight.bold, color: colors.primary }}>
                  {mockFeedbackAnalytics.totalComments}
                </div>
                <div style={{ fontSize: typography.fontSize.xs, color: colors.textSecondary }}>
                  Total Comments
                </div>
              </div>
              <div style={{ ...cardStyles.base, textAlign: 'center' }}>
                <div style={{ fontSize: '24px', fontWeight: typography.fontWeight.bold, color: colors.success }}>
                  {mockFeedbackAnalytics.resolvedComments}
                </div>
                <div style={{ fontSize: typography.fontSize.xs, color: colors.textSecondary }}>
                  Resolved
                </div>
              </div>
            </div>

            <div style={{ ...cardStyles.base, textAlign: 'center' }}>
              <div style={{ fontSize: '24px', fontWeight: typography.fontWeight.bold, color: colors.warning }}>
                {mockFeedbackAnalytics.averageResponseTime}
              </div>
              <div style={{ fontSize: typography.fontSize.xs, color: colors.textSecondary }}>
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
          <div style={{ padding: spacing.md, display: 'flex', flexDirection: 'column', gap: spacing.md }}>
            <h3 style={{ 
              margin: 0,
              fontSize: typography.fontSize.md,
              fontWeight: typography.fontWeight.semibold,
              color: colors.textPrimary,
            }}>
              Jira Integration
            </h3>

            {/* Create Ticket Form */}
            <div style={{ ...cardStyles.base }}>
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
