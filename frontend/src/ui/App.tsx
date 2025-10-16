import React, { useState, useEffect } from 'react';
import TabNavigation from './components/TabNavigation';
import CopilotChatTab from './components/CopilotChatTab';
import ReviewDesignTab from './components/ReviewDesignTab';
import ManageFeedbackTab from './components/ManageFeedbackTab';
import SettingsTab from './components/SettingsTab';
import { colors, spacing, typography, borderRadius } from './styles';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('chat');

  const tabs = [
    { id: 'chat', label: 'Copilot Chat', icon: '🤖' },
    { id: 'review', label: 'Review Design', icon: '🔍' },
    { id: 'feedback', label: 'Manage Feedback', icon: '💬' },
    { id: 'settings', label: 'Settings', icon: '⚙️' },
  ];

  useEffect(() => {
    const handleResize = (e: MouseEvent) => {
      const newWidth = Math.max(300, e.clientX);
      const newHeight = Math.max(200, e.clientY);
      
      parent.postMessage({
        pluginMessage: {
          type: 'resize',
          size: { width: newWidth, height: newHeight }
        }
      }, '*');
    };

    const resizer = document.getElementById('resizer');
    if (resizer) {
      let isResizing = false;

      const onMouseDown = (e: MouseEvent) => {
        e.preventDefault();
        isResizing = true;
        
        const startX = e.clientX;
        const startY = e.clientY;
        const startWidth = window.innerWidth;
        const startHeight = window.innerHeight;

        const onMouseMove = (e: MouseEvent) => {
          if (!isResizing) return;
          
          const newWidth = Math.max(300, startWidth + (e.clientX - startX));
          const newHeight = Math.max(200, startHeight + (e.clientY - startY));
          
          parent.postMessage({
            pluginMessage: {
              type: 'resize',
              size: { width: newWidth, height: newHeight }
            }
          }, '*');
        };

        const onMouseUp = () => {
          isResizing = false;
          document.removeEventListener('mousemove', onMouseMove);
          document.removeEventListener('mouseup', onMouseUp);
        };

        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
      };

      resizer.addEventListener('mousedown', onMouseDown);
      
      return () => {
        resizer.removeEventListener('mousedown', onMouseDown);
      };
    }
  }, []);

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'chat':
        return <CopilotChatTab />;
      case 'review':
        return <ReviewDesignTab />;
      case 'feedback':
        return <ManageFeedbackTab />;
      case 'settings':
        return <SettingsTab />;
      default:
        return <CopilotChatTab />;
    }
  };

  return (
    <div style={{ 
      display: 'flex', 
      height: '100vh',
      backgroundColor: colors.background,
      fontFamily: typography.fontFamily,
    }}>
      {/* Sidebar */}
      <div style={{
        width: '200px',
        backgroundColor: colors.white,
        borderRight: `1px solid ${colors.border}`,
        display: 'flex',
        flexDirection: 'column',
      }}>
        {/* Header */}
        <div style={{ 
          padding: spacing.md,
          borderBottom: `1px solid ${colors.border}`,
        }}>
          <h1 style={{ 
            margin: 0, 
            fontSize: typography.fontSize.md, 
            fontWeight: typography.fontWeight.semibold,
            color: colors.textPrimary,
            display: 'flex',
            alignItems: 'center',
            gap: spacing.sm,
          }}>
            🎨 AI Copilot
          </h1>
          <p style={{ 
            margin: `${spacing.xs} 0 0 0`,
            fontSize: typography.fontSize.xs,
            color: colors.textSecondary,
          }}>
            Your design assistant
          </p>
        </div>

        {/* Navigation */}
        <div style={{ 
          flex: 1,
          padding: spacing.sm,
          display: 'flex',
          flexDirection: 'column',
          gap: spacing.xs,
        }}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: spacing.sm,
                padding: `${spacing.sm} ${spacing.md}`,
                border: 'none',
                borderRadius: borderRadius.md,
                backgroundColor: activeTab === tab.id ? colors.primary : 'transparent',
                color: activeTab === tab.id ? colors.textInverse : colors.textSecondary,
                fontSize: typography.fontSize.sm,
                fontWeight: typography.fontWeight.medium,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                textAlign: 'left',
                width: '100%',
              }}
              onMouseEnter={(e) => {
                if (activeTab !== tab.id) {
                  e.currentTarget.style.backgroundColor = colors.backgroundSecondary;
                  e.currentTarget.style.color = colors.textPrimary;
                }
              }}
              onMouseLeave={(e) => {
                if (activeTab !== tab.id) {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = colors.textSecondary;
                }
              }}
            >
              <span style={{ fontSize: '16px' }}>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div style={{ 
        flex: 1, 
        display: 'flex', 
        flexDirection: 'column',
        overflow: 'hidden',
      }}>
        {/* Content Header */}
        <div style={{ 
          padding: `${spacing.md} ${spacing.lg}`,
          borderBottom: `1px solid ${colors.border}`,
          backgroundColor: colors.white,
        }}>
          <h2 style={{ 
            margin: 0, 
            fontSize: typography.fontSize.lg, 
            fontWeight: typography.fontWeight.semibold,
            color: colors.textPrimary,
            display: 'flex',
            alignItems: 'center',
            gap: spacing.sm,
          }}>
            {tabs.find(tab => tab.id === activeTab)?.icon} {tabs.find(tab => tab.id === activeTab)?.label}
          </h2>
        </div>

        {/* Content Area */}
        <div style={{ flex: 1, overflow: 'hidden' }}>
          {renderActiveTab()}
        </div>
      </div>

      {/* Resizer */}
      <div
        id="resizer"
        style={{
          position: 'absolute',
          bottom: 0,
          right: 0,
          width: '16px',
          height: '16px',
          cursor: 'nwse-resize',
          background: `linear-gradient(-45deg, transparent 30%, ${colors.border} 30%, ${colors.border} 40%, transparent 40%, transparent 60%, ${colors.border} 60%, ${colors.border} 70%, transparent 70%)`,
          zIndex: 1000,
        }}
      />
    </div>
  );
};

export default App;