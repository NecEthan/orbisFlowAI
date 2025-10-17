import React, { useState, useEffect } from 'react';
import TabNavigation from './components/TabNavigation';
import CopilotChatTab from './components/CopilotChatTab';
import ReviewDesignTab from './components/ReviewDesignTab';
import ManageFeedbackTab from './components/ManageFeedbackTab';
import DesignStandardsTab from './components/DesignStandardsTab';
import CreateJiraTicketTab from './components/CreateJiraTicketTab';
import TeamsMeetingSummaryTab from './components/TeamsMeetingSummaryTab';
import SettingsTab from './components/SettingsTab';
import { colors, spacing, typography, borderRadius } from './styles';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('chat');

  const tabs = [
    { id: 'chat', label: 'Copilot Chat', icon: '🤖' },
    { id: 'review', label: 'Review Design', icon: '🔍' },
    { id: 'feedback', label: 'Manage Feedback', icon: '💬' },
    { id: 'standards', label: 'Design Standards', icon: '📋' },
    { id: 'jira', label: 'Create Jira Ticket', icon: '🎫' },
    { id: 'teams', label: 'Teams Meeting Summary', icon: '📝' },
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
      case 'standards':
        return <DesignStandardsTab />;
      case 'jira':
        return <CreateJiraTicketTab />;
      case 'teams':
        return <TeamsMeetingSummaryTab />;
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
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      fontFamily: typography.fontFamily,
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
      {/* Sidebar */}
      <div style={{
        width: '200px',
        background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.7) 100%)',
        borderRight: `1px solid rgba(102, 126, 234, 0.2)`,
        display: 'flex',
        flexDirection: 'column',
        backdropFilter: 'blur(20px)',
        position: 'relative',
        zIndex: 2,
      }}>
        {/* Header */}
        <div style={{ 
          padding: spacing.lg,
          borderBottom: `1px solid rgba(102, 126, 234, 0.2)`,
        }}>
          <h1 style={{ 
            margin: 0, 
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
                padding: `${spacing.md} ${spacing.lg}`,
                border: 'none',
                borderRadius: '12px',
                background: activeTab === tab.id 
                  ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                  : 'transparent',
                color: activeTab === tab.id ? 'white' : colors.textSecondary,
                fontSize: typography.fontSize.sm,
                fontWeight: activeTab === tab.id ? typography.fontWeight.semibold : typography.fontWeight.medium,
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                textAlign: 'left',
                width: '100%',
                boxShadow: activeTab === tab.id ? '0 4px 15px rgba(102, 126, 234, 0.3)' : 'none',
                transform: 'translateY(0)',
              }}
              onMouseEnter={(e) => {
                if (activeTab !== tab.id) {
                  e.currentTarget.style.background = 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)';
                  e.currentTarget.style.color = '#667eea';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                }
              }}
              onMouseLeave={(e) => {
                if (activeTab !== tab.id) {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = colors.textSecondary;
                  e.currentTarget.style.transform = 'translateY(0)';
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
        position: 'relative',
        zIndex: 2,
      }}>
        {/* Content Header */}
        <div style={{ 
          padding: `${spacing.lg} ${spacing.lg}`,
          borderBottom: `1px solid rgba(102, 126, 234, 0.2)`,
          background: 'linear-gradient(90deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.7) 100%)',
          backdropFilter: 'blur(20px)',
        }}>
          <h2 style={{ 
            margin: 0, 
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