import React, { useState } from 'react';
import { colors, spacing, typography, borderRadius, buttonStyles, cardStyles } from '../styles';

const SettingsTab: React.FC = () => {
  const [settings, setSettings] = useState({
    privacy: {
      dataCollection: true,
      analytics: true,
      feedbackSharing: false,
    },
    integrations: {
      jira: false,
      slack: false,
      confluence: false,
    },
    notifications: {
      designReviews: true,
      feedbackAlerts: true,
      systemUpdates: false,
    },
  });

  const handleToggle = (category: string, setting: string) => {
    setSettings(prev => {
      const categoryKey = category as keyof typeof prev;
      const settingKey = setting as keyof typeof prev[typeof categoryKey];
      return {
        ...prev,
        [category]: {
          ...prev[categoryKey],
          [setting]: !prev[categoryKey][settingKey],
        },
      };
    });
  };

  const handleExportData = () => {
    // Simulate data export
    console.log('Exporting data...');
    alert('Data export initiated. You will receive an email when ready.');
  };

  const handleDeleteData = () => {
    if (confirm('Are you sure you want to delete all your data? This action cannot be undone.')) {
      console.log('Deleting all data...');
      alert('All data has been deleted.');
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
      <div style={{ 
        flex: 1, 
        overflowY: 'auto', 
        padding: spacing.lg,
        display: 'flex',
        flexDirection: 'column',
        gap: spacing.lg,
        position: 'relative',
        zIndex: 2,
      }}>
        {/* Privacy Settings */}
        <div style={{ 
          ...cardStyles.base,
          background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
          border: '2px solid rgba(102, 126, 234, 0.2)',
          borderRadius: '12px',
          backdropFilter: 'blur(10px)',
          boxShadow: '0 4px 15px rgba(102, 126, 234, 0.1)',
        }}>
          <h3 style={{ 
            margin: `0 0 ${spacing.md} 0`,
            fontSize: typography.fontSize.md,
            fontWeight: typography.fontWeight.semibold,
            color: colors.textPrimary,
            display: 'flex',
            alignItems: 'center',
            gap: spacing.sm,
          }}>
            🔒 Privacy Settings
          </h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.md }}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
              <div>
                <div style={{ 
                  fontSize: typography.fontSize.sm,
                  fontWeight: typography.fontWeight.medium,
                  color: colors.textPrimary,
                }}>
                  Data Collection
                </div>
                <div style={{ 
                  fontSize: typography.fontSize.xs,
                  color: colors.textSecondary,
                }}>
                  Allow collection of usage data to improve the plugin
                </div>
              </div>
              <button
                onClick={() => handleToggle('privacy', 'dataCollection')}
                style={{
                  width: '44px',
                  height: '24px',
                  borderRadius: '12px',
                  border: 'none',
                  backgroundColor: settings.privacy.dataCollection ? colors.primary : colors.gray300,
                  cursor: 'pointer',
                  position: 'relative',
                  transition: 'background-color 0.2s ease',
                }}
              >
                <div style={{
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  backgroundColor: colors.white,
                  position: 'absolute',
                  top: '2px',
                  left: settings.privacy.dataCollection ? '22px' : '2px',
                  transition: 'left 0.2s ease',
                  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.2)',
                }} />
              </button>
            </div>

            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
              <div>
                <div style={{ 
                  fontSize: typography.fontSize.sm,
                  fontWeight: typography.fontWeight.medium,
                  color: colors.textPrimary,
                }}>
                  Analytics
                </div>
                <div style={{ 
                  fontSize: typography.fontSize.xs,
                  color: colors.textSecondary,
                }}>
                  Share anonymous usage analytics
                </div>
              </div>
              <button
                onClick={() => handleToggle('privacy', 'analytics')}
                style={{
                  width: '44px',
                  height: '24px',
                  borderRadius: '12px',
                  border: 'none',
                  backgroundColor: settings.privacy.analytics ? colors.primary : colors.gray300,
                  cursor: 'pointer',
                  position: 'relative',
                  transition: 'background-color 0.2s ease',
                }}
              >
                <div style={{
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  backgroundColor: colors.white,
                  position: 'absolute',
                  top: '2px',
                  left: settings.privacy.analytics ? '22px' : '2px',
                  transition: 'left 0.2s ease',
                  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.2)',
                }} />
              </button>
            </div>

            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
              <div>
                <div style={{ 
                  fontSize: typography.fontSize.sm,
                  fontWeight: typography.fontWeight.medium,
                  color: colors.textPrimary,
                }}>
                  Feedback Sharing
                </div>
                <div style={{ 
                  fontSize: typography.fontSize.xs,
                  color: colors.textSecondary,
                }}>
                  Allow sharing feedback examples for training
                </div>
              </div>
              <button
                onClick={() => handleToggle('privacy', 'feedbackSharing')}
                style={{
                  width: '44px',
                  height: '24px',
                  borderRadius: '12px',
                  border: 'none',
                  backgroundColor: settings.privacy.feedbackSharing ? colors.primary : colors.gray300,
                  cursor: 'pointer',
                  position: 'relative',
                  transition: 'background-color 0.2s ease',
                }}
              >
                <div style={{
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  backgroundColor: colors.white,
                  position: 'absolute',
                  top: '2px',
                  left: settings.privacy.feedbackSharing ? '22px' : '2px',
                  transition: 'left 0.2s ease',
                  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.2)',
                }} />
              </button>
            </div>
          </div>
        </div>

        {/* Integrations */}
        <div style={{ 
          ...cardStyles.base,
          background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, rgba(16, 185, 129, 0.1) 100%)',
          border: '2px solid rgba(34, 197, 94, 0.2)',
          borderRadius: '12px',
          backdropFilter: 'blur(10px)',
          boxShadow: '0 4px 15px rgba(34, 197, 94, 0.1)',
        }}>
          <h3 style={{ 
            margin: `0 0 ${spacing.md} 0`,
            fontSize: typography.fontSize.md,
            fontWeight: typography.fontWeight.semibold,
            color: colors.textPrimary,
            display: 'flex',
            alignItems: 'center',
            gap: spacing.sm,
          }}>
            🔗 Connected Integrations
          </h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.md }}>
            {[
              { key: 'jira', name: 'Jira', description: 'Create and manage tickets', icon: '🎫' },
              { key: 'slack', name: 'Slack', description: 'Share updates and notifications', icon: '💬' },
              { key: 'confluence', name: 'Confluence', description: 'Access product documentation', icon: '📚' },
            ].map((integration) => (
              <div key={integration.key} style={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: spacing.sm,
                border: `1px solid ${colors.border}`,
                borderRadius: borderRadius.md,
                backgroundColor: settings.integrations[integration.key as keyof typeof settings.integrations] ? colors.backgroundSecondary : colors.white,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: spacing.sm }}>
                  <span style={{ fontSize: '16px' }}>{integration.icon}</span>
                  <div>
                    <div style={{ 
                      fontSize: typography.fontSize.sm,
                      fontWeight: typography.fontWeight.medium,
                      color: colors.textPrimary,
                    }}>
                      {integration.name}
                    </div>
                    <div style={{ 
                      fontSize: typography.fontSize.xs,
                      color: colors.textSecondary,
                    }}>
                      {integration.description}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => handleToggle('integrations', integration.key)}
                  style={{
                    ...buttonStyles.secondary,
                    padding: `${spacing.xs} ${spacing.sm}`,
                    fontSize: typography.fontSize.xs,
                    backgroundColor: settings.integrations[integration.key as keyof typeof settings.integrations] ? colors.primary : colors.white,
                    color: settings.integrations[integration.key as keyof typeof settings.integrations] ? colors.white : colors.textPrimary,
                  }}
                >
                  {settings.integrations[integration.key as keyof typeof settings.integrations] ? 'Connected' : 'Connect'}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Notifications */}
        <div style={{ 
          ...cardStyles.base,
          background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, rgba(16, 185, 129, 0.1) 100%)',
          border: '2px solid rgba(34, 197, 94, 0.2)',
          borderRadius: '12px',
          backdropFilter: 'blur(10px)',
          boxShadow: '0 4px 15px rgba(34, 197, 94, 0.1)',
        }}>
          <h3 style={{ 
            margin: `0 0 ${spacing.md} 0`,
            fontSize: typography.fontSize.md,
            fontWeight: typography.fontWeight.semibold,
            color: colors.textPrimary,
            display: 'flex',
            alignItems: 'center',
            gap: spacing.sm,
          }}>
            🔔 Notifications
          </h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.md }}>
            {[
              { key: 'designReviews', name: 'Design Reviews', description: 'Get notified when reviews complete' },
              { key: 'feedbackAlerts', name: 'Feedback Alerts', description: 'New feedback on your designs' },
              { key: 'systemUpdates', name: 'System Updates', description: 'Plugin updates and new features' },
            ].map((notification) => (
              <div key={notification.key} style={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
                <div>
                  <div style={{ 
                    fontSize: typography.fontSize.sm,
                    fontWeight: typography.fontWeight.medium,
                    color: colors.textPrimary,
                  }}>
                    {notification.name}
                  </div>
                  <div style={{ 
                    fontSize: typography.fontSize.xs,
                    color: colors.textSecondary,
                  }}>
                    {notification.description}
                  </div>
                </div>
                <button
                  onClick={() => handleToggle('notifications', notification.key)}
                  style={{
                    width: '44px',
                    height: '24px',
                    borderRadius: '12px',
                    border: 'none',
                    backgroundColor: settings.notifications[notification.key as keyof typeof settings.notifications] ? colors.primary : colors.gray300,
                    cursor: 'pointer',
                    position: 'relative',
                    transition: 'background-color 0.2s ease',
                  }}
                >
                  <div style={{
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    backgroundColor: colors.white,
                    position: 'absolute',
                    top: '2px',
                    left: settings.notifications[notification.key as keyof typeof settings.notifications] ? '22px' : '2px',
                    transition: 'left 0.2s ease',
                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.2)',
                  }} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Data Management */}
        <div style={{ 
          ...cardStyles.base,
          background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, rgba(16, 185, 129, 0.1) 100%)',
          border: '2px solid rgba(34, 197, 94, 0.2)',
          borderRadius: '12px',
          backdropFilter: 'blur(10px)',
          boxShadow: '0 4px 15px rgba(34, 197, 94, 0.1)',
        }}>
          <h3 style={{ 
            margin: `0 0 ${spacing.md} 0`,
            fontSize: typography.fontSize.md,
            fontWeight: typography.fontWeight.semibold,
            color: colors.textPrimary,
            display: 'flex',
            alignItems: 'center',
            gap: spacing.sm,
          }}>
            💾 Data Management
          </h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.sm }}>
            <button
              onClick={handleExportData}
              style={{
                ...buttonStyles.secondary,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: spacing.sm,
              }}
            >
              <span>📤</span>
              Export My Data
            </button>
            
            <button
              onClick={handleDeleteData}
              style={{
                ...buttonStyles.secondary,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: spacing.sm,
                backgroundColor: colors.error,
                color: colors.white,
                borderColor: colors.error,
              }}
            >
              <span>🗑️</span>
              Delete All Data
            </button>
          </div>
        </div>

        {/* About */}
        <div style={{ 
          ...cardStyles.base,
          background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, rgba(16, 185, 129, 0.1) 100%)',
          border: '2px solid rgba(34, 197, 94, 0.2)',
          borderRadius: '12px',
          backdropFilter: 'blur(10px)',
          boxShadow: '0 4px 15px rgba(34, 197, 94, 0.1)',
        }}>
          <h3 style={{ 
            margin: `0 0 ${spacing.md} 0`,
            fontSize: typography.fontSize.md,
            fontWeight: typography.fontWeight.semibold,
            color: colors.textPrimary,
            display: 'flex',
            alignItems: 'center',
            gap: spacing.sm,
          }}>
            ℹ️ About
          </h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.sm }}>
            <div style={{ 
              fontSize: typography.fontSize.sm,
              color: colors.textSecondary,
            }}>
              <strong>AI Design Copilot</strong> v1.0.0
            </div>
            <div style={{ 
              fontSize: typography.fontSize.xs,
              color: colors.textTertiary,
              lineHeight: typography.lineHeight.normal,
            }}>
              Your intelligent design assistant for Figma. Get instant feedback responses, 
              proactive design reviews, and access to your team's knowledge base - all 
              while maintaining privacy and security.
            </div>
            <div style={{ 
              fontSize: typography.fontSize.xs,
              color: colors.textTertiary,
              marginTop: spacing.sm,
            }}>
              Made with ❤️ for designers
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsTab;
