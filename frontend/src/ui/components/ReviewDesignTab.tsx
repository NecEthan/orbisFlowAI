import React, { useState } from 'react';
import { colors, spacing, typography, borderRadius, buttonStyles, cardStyles } from '../styles';
import { mockDesignReviewResults, DesignReviewResult } from '../mockData';

const ReviewDesignTab: React.FC = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<DesignReviewResult[]>(mockDesignReviewResults);
  const [selectedResult, setSelectedResult] = useState<DesignReviewResult | null>(null);

  const handleRunReview = () => {
    setIsRunning(true);
    
    // Simulate review process
    setTimeout(() => {
      setIsRunning(false);
      // Results are already set from mock data
    }, 2000);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return colors.error;
      case 'medium': return colors.warning;
      case 'low': return colors.success;
      default: return colors.gray500;
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'high': return '🔴';
      case 'medium': return '🟡';
      case 'low': return '🟢';
      default: return '⚪';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'compliance': return '📋';
      case 'ux': return '🎯';
      case 'accessibility': return '♿';
      case 'performance': return '⚡';
      default: return '📝';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return colors.primary;
      case 'acknowledged': return colors.warning;
      case 'fixed': return colors.success;
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
      {/* Header */}
      <div style={{ 
        padding: spacing.lg,
        borderBottom: `1px solid rgba(102, 126, 234, 0.2)`,
        background: 'linear-gradient(90deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.7) 100%)',
        backdropFilter: 'blur(20px)',
        position: 'relative',
        zIndex: 2,
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
          🔍 Design Review
        </h3>
        <p style={{ 
          margin: `${spacing.xs} 0 0 0`,
          fontSize: typography.fontSize.sm,
          color: colors.textSecondary,
        }}>
          Get proactive feedback on your designs against product docs and metrics
        </p>
        
        <button
          onClick={handleRunReview}
          disabled={isRunning}
          style={{
            ...buttonStyles.primary,
            marginTop: spacing.md,
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: spacing.sm,
            background: isRunning 
              ? 'linear-gradient(135deg, #a8a8a8 0%, #888888 100%)'
              : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            border: 'none',
            borderRadius: '12px',
            fontWeight: typography.fontWeight.semibold,
            color: 'white',
            boxShadow: '0 6px 20px rgba(102, 126, 234, 0.3)',
            transition: 'all 0.3s ease',
            transform: 'translateY(0)',
            cursor: isRunning ? 'not-allowed' : 'pointer',
          }}
          onMouseEnter={(e) => {
            if (!isRunning) {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 8px 25px rgba(102, 126, 234, 0.4)';
            }
          }}
          onMouseLeave={(e) => {
            if (!isRunning) {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.3)';
            }
          }}
        >
          {isRunning ? (
            <>
              <span>🔄</span>
              Running Review...
            </>
          ) : (
            <>
              <span>🔍</span>
              Run Design Review
            </>
          )}
        </button>
      </div>

      {/* Results */}
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
        {results.length === 0 ? (
          <div style={{
            ...cardStyles.base,
            textAlign: 'center',
            padding: spacing.xl,
            color: colors.textSecondary,
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
            border: '2px solid rgba(102, 126, 234, 0.2)',
            borderRadius: '12px',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 4px 15px rgba(102, 126, 234, 0.1)',
          }}>
            <div style={{ fontSize: '24px', marginBottom: spacing.sm }}>🔍</div>
            <p>No review results yet. Click "Run Design Review" to analyze your design.</p>
          </div>
        ) : (
          results.map((result) => (
            <div
              key={result.id}
              style={{
                ...cardStyles.base,
                cursor: 'pointer',
                background: selectedResult?.id === result.id 
                  ? 'linear-gradient(135deg, rgba(102, 126, 234, 0.2) 0%, rgba(118, 75, 162, 0.2) 100%)'
                  : 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
                border: selectedResult?.id === result.id 
                  ? `2px solid #667eea` 
                  : `2px solid rgba(102, 126, 234, 0.2)`,
                borderRadius: '12px',
                backdropFilter: 'blur(10px)',
                boxShadow: selectedResult?.id === result.id
                  ? '0 6px 20px rgba(102, 126, 234, 0.2)'
                  : '0 4px 15px rgba(102, 126, 234, 0.1)',
                transition: 'all 0.3s ease',
                transform: 'translateY(0)',
              }}
              onClick={() => setSelectedResult(result)}
              onMouseEnter={(e) => {
                if (selectedResult?.id !== result.id) {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.15)';
                }
              }}
              onMouseLeave={(e) => {
                if (selectedResult?.id !== result.id) {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.1)';
                }
              }}
            >
              <div style={{ 
                display: 'flex', 
                alignItems: 'flex-start', 
                gap: spacing.sm,
                marginBottom: spacing.sm,
              }}>
                <div style={{ fontSize: '16px' }}>
                  {getTypeIcon(result.type)}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: spacing.sm,
                    marginBottom: spacing.xs,
                  }}>
                    <span style={{ fontSize: '12px' }}>
                      {getSeverityIcon(result.severity)}
                    </span>
                    <h4 style={{ 
                      margin: 0, 
                      fontSize: typography.fontSize.md,
                      fontWeight: typography.fontWeight.medium,
                      color: colors.textPrimary,
                    }}>
                      {result.title}
                    </h4>
                    <span style={{
                      padding: `${spacing.xs} ${spacing.sm}`,
                      borderRadius: borderRadius.sm,
                      fontSize: typography.fontSize.xs,
                      fontWeight: typography.fontWeight.medium,
                      backgroundColor: getStatusColor(result.status),
                      color: colors.white,
                      textTransform: 'capitalize',
                    }}>
                      {result.status}
                    </span>
                  </div>
                  <p style={{ 
                    margin: 0,
                    fontSize: typography.fontSize.sm,
                    color: colors.textSecondary,
                    lineHeight: typography.lineHeight.normal,
                  }}>
                    {result.description}
                  </p>
                </div>
              </div>
              
              {selectedResult?.id === result.id && (
                <div style={{
                  marginTop: spacing.sm,
                  padding: spacing.sm,
                  backgroundColor: colors.backgroundSecondary,
                  borderRadius: borderRadius.md,
                  border: `1px solid ${colors.border}`,
                }}>
                  <div style={{ 
                    fontSize: typography.fontSize.sm,
                    fontWeight: typography.fontWeight.medium,
                    color: colors.textPrimary,
                    marginBottom: spacing.xs,
                  }}>
                    💡 Suggestion:
                  </div>
                  <p style={{ 
                    margin: 0,
                    fontSize: typography.fontSize.sm,
                    color: colors.textSecondary,
                    lineHeight: typography.lineHeight.normal,
                  }}>
                    {result.suggestion}
                  </p>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Summary */}
      {results.length > 0 && (
        <div style={{ 
          padding: spacing.md,
          borderTop: `1px solid ${colors.border}`,
          backgroundColor: colors.backgroundSecondary,
        }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: typography.fontSize.sm,
            color: colors.textSecondary,
          }}>
            <span>
              {results.length} issues found
            </span>
            <div style={{ display: 'flex', gap: spacing.md }}>
              <span style={{ color: colors.error }}>
                {results.filter(r => r.severity === 'high').length} high
              </span>
              <span style={{ color: colors.warning }}>
                {results.filter(r => r.severity === 'medium').length} medium
              </span>
              <span style={{ color: colors.success }}>
                {results.filter(r => r.severity === 'low').length} low
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewDesignTab;
