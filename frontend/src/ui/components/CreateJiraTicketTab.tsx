import React, { useState } from 'react';
import { colors, spacing, typography, borderRadius, buttonStyles, inputStyles, cardStyles } from '../styles';
import { apiClient } from '../../lib/apiClient';

interface JiraTicket {
  title: string;
  description: string;
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  type: 'Bug' | 'Task' | 'Story' | 'Epic';
  labels: string;
  assignee: string;
  project: string;
}

const CreateJiraTicketTab: React.FC = () => {
  const [ticket, setTicket] = useState<JiraTicket>({
    title: '',
    description: '',
    priority: 'Medium',
    type: 'Task',
    labels: '',
    assignee: '',
    project: 'DES',
  });
  const [rawInput, setRawInput] = useState('');
  const [useDesignStandards, setUseDesignStandards] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedTicket, setGeneratedTicket] = useState<JiraTicket | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [createMessage, setCreateMessage] = useState<string | null>(null);

  const handleGenerateTicket = async () => {
    if (!rawInput.trim()) return;

    setIsGenerating(true);
    setError(null);
    setGeneratedTicket(null);

    try {
      const response = await apiClient('/api/generate-jira-ticket', {
        method: 'POST',
        body: JSON.stringify({
          input: rawInput.trim(),
          useDesignStandards: useDesignStandards,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate ticket');
      }

      const data = await response.json();
      setGeneratedTicket(data.ticket);
    } catch (err: any) {
      setError(err.message || 'An error occurred while generating the ticket');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCreateTicket = async () => {
    if (!generatedTicket) return;

    setIsCreating(true);
    setCreateMessage(null);

    try {
      // In a real app, this would make an API call to Jira
      // For now, we'll simulate the creation
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setCreateMessage('Ticket created successfully! (This is a simulation)');
      
      // Reset form
      setRawInput('');
      setGeneratedTicket(null);
      setTicket({
        title: '',
        description: '',
        priority: 'Medium',
        type: 'Task',
        labels: '',
        assignee: '',
        project: 'DES',
      });
    } catch (err: any) {
      setCreateMessage('Failed to create ticket. Please try again.');
    } finally {
      setIsCreating(false);
    }
  };

  const handleManualInputChange = (field: keyof JiraTicket, value: string) => {
    setTicket(prev => ({ ...prev, [field]: value }));
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      height: '100%',
      overflowY: 'auto',
    }}>
      {/* Header */}
      <div style={{ 
        padding: spacing.lg,
        borderBottom: `1px solid rgba(102, 126, 234, 0.2)`,
        background: 'linear-gradient(90deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.85) 100%)',
        backdropFilter: 'blur(20px)',
        position: 'relative',
        zIndex: 2,
      }}>
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: spacing.lg,
            marginBottom: spacing.md,
          }}>
            <div style={{
              fontSize: '32px',
              padding: spacing.md,
              background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
              borderRadius: '16px',
              border: '2px solid rgba(102, 126, 234, 0.2)',
              backdropFilter: 'blur(10px)',
              boxShadow: '0 4px 16px rgba(102, 126, 234, 0.1)',
            }}>
              🎫
            </div>
            <div>
              <h3 style={{ 
                margin: 0, 
                fontSize: typography.fontSize.xl, 
                fontWeight: typography.fontWeight.bold,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                marginBottom: spacing.xs,
              }}>
                Create Jira Ticket
              </h3>
              <p style={{ 
                margin: 0,
                fontSize: typography.fontSize.md,
                color: colors.textSecondary,
                opacity: 0.9,
                lineHeight: typography.lineHeight.relaxed,
              }}>
                Generate well-structured Jira tickets from design feedback or requirements
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div style={{ 
        flex: 1, 
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
        {/* AI Generation Section */}
        <div style={{
          ...cardStyles.base,
          background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
          border: '2px solid rgba(102, 126, 234, 0.2)',
          borderRadius: '12px',
          backdropFilter: 'blur(10px)',
          boxShadow: '0 4px 15px rgba(102, 126, 234, 0.1)',
        }}>
          <h4 style={{ 
            margin: `0 0 ${spacing.md} 0`,
            fontSize: typography.fontSize.lg,
            fontWeight: typography.fontWeight.bold,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            display: 'flex',
            alignItems: 'center',
            gap: spacing.sm,
          }}>
            ✨ AI Ticket Generation
          </h4>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.md }}>
            <div>
              <label style={{ 
                display: 'block',
                fontSize: typography.fontSize.sm,
                fontWeight: typography.fontWeight.medium,
                color: colors.textPrimary,
                marginBottom: spacing.xs,
              }}>
                Describe the issue or requirement:
              </label>
              <textarea
                value={rawInput}
                onChange={(e) => setRawInput(e.target.value)}
                placeholder="Paste design feedback, describe a bug, or outline a new feature requirement..."
                style={{
                  ...inputStyles.base,
                  minHeight: '120px',
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

            {/* Design Standards Toggle */}
            <div style={{ display: 'flex', alignItems: 'center', gap: spacing.sm }}>
              <input
                type="checkbox"
                id="useDesignStandards"
                checked={useDesignStandards}
                onChange={(e) => setUseDesignStandards(e.target.checked)}
                style={{
                  width: '18px',
                  height: '18px',
                  accentColor: '#667eea',
                }}
              />
              <label htmlFor="useDesignStandards" style={{
                fontSize: typography.fontSize.sm,
                fontWeight: typography.fontWeight.medium,
                color: colors.textPrimary,
                cursor: 'pointer',
              }}>
                Use Design Standards context for better ticket generation
              </label>
            </div>

            <button
              onClick={handleGenerateTicket}
              disabled={!rawInput.trim() || isGenerating}
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
                  Generating Ticket...
                </>
              ) : (
                <>
                  <span>✨</span>
                  Generate Ticket
                </>
              )}
            </button>
          </div>
        </div>

        {/* Error Display */}
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

        {/* Generated Ticket Preview */}
        {generatedTicket && (
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
              marginBottom: spacing.md,
              display: 'flex',
              alignItems: 'center',
              gap: spacing.xs,
            }}>
              ✨ Generated Ticket Preview:
            </div>
            
            <div style={{
              background: 'rgba(255, 255, 255, 0.5)',
              padding: spacing.lg,
              borderRadius: '8px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              marginBottom: spacing.md,
            }}>
              <div style={{ marginBottom: spacing.sm }}>
                <strong style={{ color: colors.textPrimary }}>Title:</strong>
                <div style={{ marginTop: spacing.xs, color: colors.textSecondary }}>
                  {generatedTicket.title}
                </div>
              </div>
              
              <div style={{ marginBottom: spacing.sm }}>
                <strong style={{ color: colors.textPrimary }}>Description:</strong>
                <div style={{ 
                  marginTop: spacing.xs, 
                  color: colors.textSecondary,
                  whiteSpace: 'pre-wrap',
                  lineHeight: typography.lineHeight.normal,
                }}>
                  {generatedTicket.description}
                </div>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: spacing.sm }}>
                <div>
                  <strong style={{ color: colors.textPrimary }}>Priority:</strong>
                  <div style={{ marginTop: spacing.xs, color: colors.textSecondary }}>
                    {generatedTicket.priority}
                  </div>
                </div>
                <div>
                  <strong style={{ color: colors.textPrimary }}>Type:</strong>
                  <div style={{ marginTop: spacing.xs, color: colors.textSecondary }}>
                    {generatedTicket.type}
                  </div>
                </div>
                <div>
                  <strong style={{ color: colors.textPrimary }}>Project:</strong>
                  <div style={{ marginTop: spacing.xs, color: colors.textSecondary }}>
                    {generatedTicket.project}
                  </div>
                </div>
                <div>
                  <strong style={{ color: colors.textPrimary }}>Labels:</strong>
                  <div style={{ marginTop: spacing.xs, color: colors.textSecondary }}>
                    {generatedTicket.labels || 'None'}
                  </div>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: spacing.sm, flexWrap: 'wrap' }}>
              <button
                onClick={() => copyToClipboard(JSON.stringify(generatedTicket, null, 2))}
                style={{
                  ...buttonStyles.secondary,
                  fontSize: typography.fontSize.sm,
                  background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, rgba(16, 185, 129, 0.1) 100%)',
                  border: '1px solid rgba(34, 197, 94, 0.3)',
                  borderRadius: '8px',
                  color: '#059669',
                  fontWeight: typography.fontWeight.medium,
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: spacing.xs,
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
                📋 Copy JSON
              </button>
              
              <button
                onClick={handleCreateTicket}
                disabled={isCreating}
                style={{
                  ...buttonStyles.primary,
                  fontSize: typography.fontSize.sm,
                  background: isCreating 
                    ? 'linear-gradient(135deg, #a8a8a8 0%, #888888 100%)'
                    : 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                  border: 'none',
                  borderRadius: '8px',
                  color: 'white',
                  fontWeight: typography.fontWeight.semibold,
                  transition: 'all 0.3s ease',
                  cursor: isCreating ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: spacing.xs,
                }}
                onMouseEnter={(e) => {
                  if (!isCreating) {
                    e.currentTarget.style.transform = 'translateY(-1px)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(5, 150, 105, 0.3)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isCreating) {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }
                }}
              >
                {isCreating ? '🔄' : '🎫'} {isCreating ? 'Creating...' : 'Create Ticket'}
              </button>
            </div>
          </div>
        )}

        {/* Create Message */}
        {createMessage && (
          <div style={{
            ...cardStyles.base,
            background: createMessage.includes('success') 
              ? 'linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, rgba(16, 185, 129, 0.1) 100%)'
              : 'linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(220, 38, 38, 0.1) 100%)',
            border: `2px solid ${createMessage.includes('success') ? 'rgba(34, 197, 94, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
            borderRadius: '12px',
            backdropFilter: 'blur(10px)',
            boxShadow: `0 4px 15px ${createMessage.includes('success') ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)'}`,
          }}>
            <div style={{
              fontSize: typography.fontSize.sm,
              fontWeight: typography.fontWeight.medium,
              color: createMessage.includes('success') ? '#059669' : '#DC2626',
              display: 'flex',
              alignItems: 'center',
              gap: spacing.xs,
            }}>
              {createMessage.includes('success') ? '✅' : '⚠️'} {createMessage}
            </div>
          </div>
        )}

        {/* Manual Form Section */}
        <div style={{
          ...cardStyles.base,
          background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.1) 0%, rgba(217, 119, 6, 0.1) 100%)',
          border: '2px solid rgba(245, 158, 11, 0.2)',
          borderRadius: '12px',
          backdropFilter: 'blur(10px)',
          boxShadow: '0 4px 15px rgba(245, 158, 11, 0.1)',
        }}>
          <h4 style={{ 
            margin: `0 0 ${spacing.md} 0`,
            fontSize: typography.fontSize.lg,
            fontWeight: typography.fontWeight.bold,
            color: '#D97706',
            display: 'flex',
            alignItems: 'center',
            gap: spacing.sm,
          }}>
            📝 Manual Ticket Creation
          </h4>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: spacing.md }}>
            <div>
              <label style={{ 
                display: 'block',
                fontSize: typography.fontSize.sm,
                fontWeight: typography.fontWeight.medium,
                color: colors.textPrimary,
                marginBottom: spacing.xs,
              }}>
                Title:
              </label>
              <input
                type="text"
                value={ticket.title}
                onChange={(e) => handleManualInputChange('title', e.target.value)}
                placeholder="Ticket title..."
                style={inputStyles.base}
              />
            </div>
            
            <div>
              <label style={{ 
                display: 'block',
                fontSize: typography.fontSize.sm,
                fontWeight: typography.fontWeight.medium,
                color: colors.textPrimary,
                marginBottom: spacing.xs,
              }}>
                Priority:
              </label>
              <select
                value={ticket.priority}
                onChange={(e) => handleManualInputChange('priority', e.target.value)}
                style={inputStyles.base}
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Critical">Critical</option>
              </select>
            </div>
            
            <div>
              <label style={{ 
                display: 'block',
                fontSize: typography.fontSize.sm,
                fontWeight: typography.fontWeight.medium,
                color: colors.textPrimary,
                marginBottom: spacing.xs,
              }}>
                Type:
              </label>
              <select
                value={ticket.type}
                onChange={(e) => handleManualInputChange('type', e.target.value)}
                style={inputStyles.base}
              >
                <option value="Bug">Bug</option>
                <option value="Task">Task</option>
                <option value="Story">Story</option>
                <option value="Epic">Epic</option>
              </select>
            </div>
            
            <div>
              <label style={{ 
                display: 'block',
                fontSize: typography.fontSize.sm,
                fontWeight: typography.fontWeight.medium,
                color: colors.textPrimary,
                marginBottom: spacing.xs,
              }}>
                Project:
              </label>
              <input
                type="text"
                value={ticket.project}
                onChange={(e) => handleManualInputChange('project', e.target.value)}
                placeholder="Project key..."
                style={inputStyles.base}
              />
            </div>
          </div>
          
          <div style={{ marginTop: spacing.md }}>
            <label style={{ 
              display: 'block',
              fontSize: typography.fontSize.sm,
              fontWeight: typography.fontWeight.medium,
              color: colors.textPrimary,
              marginBottom: spacing.xs,
            }}>
              Description:
            </label>
            <textarea
              value={ticket.description}
              onChange={(e) => handleManualInputChange('description', e.target.value)}
              placeholder="Detailed description..."
              style={{
                ...inputStyles.base,
                minHeight: '100px',
                resize: 'vertical',
              }}
            />
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: spacing.md, marginTop: spacing.md }}>
            <div>
              <label style={{ 
                display: 'block',
                fontSize: typography.fontSize.sm,
                fontWeight: typography.fontWeight.medium,
                color: colors.textPrimary,
                marginBottom: spacing.xs,
              }}>
                Labels (comma-separated):
              </label>
              <input
                type="text"
                value={ticket.labels}
                onChange={(e) => handleManualInputChange('labels', e.target.value)}
                placeholder="design, ui, bug..."
                style={inputStyles.base}
              />
            </div>
            
            <div>
              <label style={{ 
                display: 'block',
                fontSize: typography.fontSize.sm,
                fontWeight: typography.fontWeight.medium,
                color: colors.textPrimary,
                marginBottom: spacing.xs,
              }}>
                Assignee:
              </label>
              <input
                type="text"
                value={ticket.assignee}
                onChange={(e) => handleManualInputChange('assignee', e.target.value)}
                placeholder="Username or email..."
                style={inputStyles.base}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateJiraTicketTab;
