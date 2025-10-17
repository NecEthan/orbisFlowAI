import React, { useState } from 'react';
import { colors, spacing, typography, borderRadius, buttonStyles, inputStyles, cardStyles } from '../styles';

interface MeetingSummary {
  keyDecisions: string[];
  actionItems: Array<{
    task: string;
    owner?: string;
    dueDate?: string;
  }>;
  designDiscussion: string[];
  followUpTasks: string[];
  attendees: string[];
  meetingDate: string;
  duration: string;
}

const TeamsMeetingSummaryTab: React.FC = () => {
  const [transcript, setTranscript] = useState('');
  const [useDesignStandards, setUseDesignStandards] = useState(true);
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [summary, setSummary] = useState<MeetingSummary | null>(null);

  const handleSummarize = async () => {
    if (!transcript.trim()) return;

    setIsSummarizing(true);
    setError(null);
    setSummary(null);

    try {
      const response = await fetch('http://localhost:3000/api/summarize-meeting', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          transcript: transcript.trim(),
          useDesignStandards: useDesignStandards,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to summarize meeting');
      }

      const data = await response.json();
      setSummary(data.summary);
    } catch (err: any) {
      setError(err.message || 'An error occurred while summarizing the meeting');
    } finally {
      setIsSummarizing(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const downloadAsMarkdown = () => {
    if (!summary) return;

    const markdown = `# Meeting Summary

**Date:** ${summary.meetingDate}
**Duration:** ${summary.duration}
**Attendees:** ${summary.attendees.join(', ')}

## Key Decisions
${summary.keyDecisions.map(decision => `- ${decision}`).join('\n')}

## Action Items
${summary.actionItems.map(item => 
  `- ${item.task}${item.owner ? ` (Owner: ${item.owner})` : ''}${item.dueDate ? ` (Due: ${item.dueDate})` : ''}`
).join('\n')}

## Design Discussion
${summary.designDiscussion.map(discussion => `- ${discussion}`).join('\n')}

## Follow-up Tasks
${summary.followUpTasks.map(task => `- ${task}`).join('\n')}
`;

    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `meeting-summary-${new Date().toISOString().split('T')[0]}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const formatSummaryForCopy = () => {
    if (!summary) return '';

    return `Meeting Summary

Date: ${summary.meetingDate}
Duration: ${summary.duration}
Attendees: ${summary.attendees.join(', ')}

Key Decisions:
${summary.keyDecisions.map(decision => `• ${decision}`).join('\n')}

Action Items:
${summary.actionItems.map(item => 
  `• ${item.task}${item.owner ? ` (Owner: ${item.owner})` : ''}${item.dueDate ? ` (Due: ${item.dueDate})` : ''}`
).join('\n')}

Design Discussion:
${summary.designDiscussion.map(discussion => `• ${discussion}`).join('\n')}

Follow-up Tasks:
${summary.followUpTasks.map(task => `• ${task}`).join('\n')}`;
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
              📝
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
                Teams Meeting Summary
              </h3>
              <p style={{ 
                margin: 0,
                fontSize: typography.fontSize.md,
                color: colors.textSecondary,
                opacity: 0.9,
                lineHeight: typography.lineHeight.relaxed,
              }}>
                AI-powered meeting transcript analysis and summarization
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
        {/* Input Section */}
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
            🎤 Meeting Transcript Input
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
                Paste your meeting transcript or notes:
              </label>
              <textarea
                value={transcript}
                onChange={(e) => setTranscript(e.target.value)}
                placeholder="Paste the full meeting transcript, notes, or recording transcript here. The AI will extract key decisions, action items, design discussions, and follow-up tasks..."
                style={{
                  ...inputStyles.base,
                  minHeight: '200px',
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
                Use Design Standards context to better understand design discussions
              </label>
            </div>

            <button
              onClick={handleSummarize}
              disabled={!transcript.trim() || isSummarizing}
              style={{
                ...buttonStyles.primary,
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: spacing.sm,
                background: isSummarizing 
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
                cursor: isSummarizing ? 'not-allowed' : 'pointer',
              }}
              onMouseEnter={(e) => {
                if (!isSummarizing) {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 8px 25px rgba(102, 126, 234, 0.4)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isSummarizing) {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.3)';
                }
              }}
            >
              {isSummarizing ? (
                <>
                  <span>🔄</span>
                  Analyzing Meeting...
                </>
              ) : (
                <>
                  <span>📊</span>
                  Generate Summary
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

        {/* Summary Display */}
        {summary && (
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
              marginBottom: spacing.lg,
              display: 'flex',
              alignItems: 'center',
              gap: spacing.xs,
            }}>
              📊 Meeting Summary Generated
            </div>
            
            {/* Meeting Info */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.5)',
              padding: spacing.md,
              borderRadius: '8px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              marginBottom: spacing.lg,
            }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: spacing.md }}>
                <div>
                  <strong style={{ color: colors.textPrimary }}>Date:</strong>
                  <div style={{ marginTop: spacing.xs, color: colors.textSecondary }}>
                    {summary.meetingDate}
                  </div>
                </div>
                <div>
                  <strong style={{ color: colors.textPrimary }}>Duration:</strong>
                  <div style={{ marginTop: spacing.xs, color: colors.textSecondary }}>
                    {summary.duration}
                  </div>
                </div>
                <div>
                  <strong style={{ color: colors.textPrimary }}>Attendees:</strong>
                  <div style={{ marginTop: spacing.xs, color: colors.textSecondary }}>
                    {summary.attendees.join(', ')}
                  </div>
                </div>
              </div>
            </div>

            {/* Key Decisions */}
            {summary.keyDecisions.length > 0 && (
              <div style={{ marginBottom: spacing.lg }}>
                <h5 style={{ 
                  margin: `0 0 ${spacing.sm} 0`,
                  fontSize: typography.fontSize.md,
                  fontWeight: typography.fontWeight.semibold,
                  color: colors.textPrimary,
                  display: 'flex',
                  alignItems: 'center',
                  gap: spacing.xs,
                }}>
                  🎯 Key Decisions
                </h5>
                <div style={{
                  background: 'rgba(255, 255, 255, 0.5)',
                  padding: spacing.md,
                  borderRadius: '8px',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                }}>
                  {summary.keyDecisions.map((decision, index) => (
                    <div key={index} style={{ 
                      marginBottom: spacing.xs,
                      color: colors.textSecondary,
                      lineHeight: typography.lineHeight.normal,
                    }}>
                      • {decision}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Action Items */}
            {summary.actionItems.length > 0 && (
              <div style={{ marginBottom: spacing.lg }}>
                <h5 style={{ 
                  margin: `0 0 ${spacing.sm} 0`,
                  fontSize: typography.fontSize.md,
                  fontWeight: typography.fontWeight.semibold,
                  color: colors.textPrimary,
                  display: 'flex',
                  alignItems: 'center',
                  gap: spacing.xs,
                }}>
                  ✅ Action Items
                </h5>
                <div style={{
                  background: 'rgba(255, 255, 255, 0.5)',
                  padding: spacing.md,
                  borderRadius: '8px',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                }}>
                  {summary.actionItems.map((item, index) => (
                    <div key={index} style={{ 
                      marginBottom: spacing.xs,
                      color: colors.textSecondary,
                      lineHeight: typography.lineHeight.normal,
                    }}>
                      • {item.task}
                      {item.owner && <span style={{ fontWeight: typography.fontWeight.medium, color: colors.textPrimary }}> (Owner: {item.owner})</span>}
                      {item.dueDate && <span style={{ fontWeight: typography.fontWeight.medium, color: colors.textPrimary }}> (Due: {item.dueDate})</span>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Design Discussion */}
            {summary.designDiscussion.length > 0 && (
              <div style={{ marginBottom: spacing.lg }}>
                <h5 style={{ 
                  margin: `0 0 ${spacing.sm} 0`,
                  fontSize: typography.fontSize.md,
                  fontWeight: typography.fontWeight.semibold,
                  color: colors.textPrimary,
                  display: 'flex',
                  alignItems: 'center',
                  gap: spacing.xs,
                }}>
                  🎨 Design Discussion
                </h5>
                <div style={{
                  background: 'rgba(255, 255, 255, 0.5)',
                  padding: spacing.md,
                  borderRadius: '8px',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                }}>
                  {summary.designDiscussion.map((discussion, index) => (
                    <div key={index} style={{ 
                      marginBottom: spacing.xs,
                      color: colors.textSecondary,
                      lineHeight: typography.lineHeight.normal,
                    }}>
                      • {discussion}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Follow-up Tasks */}
            {summary.followUpTasks.length > 0 && (
              <div style={{ marginBottom: spacing.lg }}>
                <h5 style={{ 
                  margin: `0 0 ${spacing.sm} 0`,
                  fontSize: typography.fontSize.md,
                  fontWeight: typography.fontWeight.semibold,
                  color: colors.textPrimary,
                  display: 'flex',
                  alignItems: 'center',
                  gap: spacing.xs,
                }}>
                  📋 Follow-up Tasks
                </h5>
                <div style={{
                  background: 'rgba(255, 255, 255, 0.5)',
                  padding: spacing.md,
                  borderRadius: '8px',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                }}>
                  {summary.followUpTasks.map((task, index) => (
                    <div key={index} style={{ 
                      marginBottom: spacing.xs,
                      color: colors.textSecondary,
                      lineHeight: typography.lineHeight.normal,
                    }}>
                      • {task}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Export Actions */}
            <div style={{ display: 'flex', gap: spacing.sm, flexWrap: 'wrap' }}>
              <button
                onClick={() => copyToClipboard(formatSummaryForCopy())}
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
                📋 Copy Summary
              </button>
              
              <button
                onClick={downloadAsMarkdown}
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
                📄 Download Markdown
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeamsMeetingSummaryTab;
