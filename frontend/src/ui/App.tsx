import React, { useState } from 'react';
import TabNavigation from './components/TabNavigation';
import CopilotChatTab from './components/CopilotChatTab';
import ReviewDesignTab from './components/ReviewDesignTab';
import ManageFeedbackTab from './components/ManageFeedbackTab';
import SettingsTab from './components/SettingsTab';
import { colors, spacing, typography } from './styles';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('chat');

  const tabs = [
    { id: 'chat', label: 'Copilot Chat', icon: '🤖' },
    { id: 'review', label: 'Review Design', icon: '🔍' },
    { id: 'feedback', label: 'Manage Feedback', icon: '💬' },
    { id: 'settings', label: 'Settings', icon: '⚙️' },
  ];

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
      flexDirection: 'column', 
      height: '100vh',
      backgroundColor: colors.background,
      fontFamily: typography.fontFamily,
    }}>
      {/* Header */}
      <div style={{ 
        padding: `${spacing.md} ${spacing.md} ${spacing.sm} ${spacing.md}`,
        borderBottom: `1px solid ${colors.border}`,
        backgroundColor: colors.white,
      }}>
        <h1 style={{ 
          margin: 0, 
          fontSize: typography.fontSize.lg, 
          fontWeight: typography.fontWeight.semibold,
          color: colors.textPrimary,
          display: 'flex',
          alignItems: 'center',
          gap: spacing.sm,
        }}>
          🎨 AI Design Copilot
        </h1>
        <p style={{ 
          margin: `${spacing.xs} 0 0 0`,
          fontSize: typography.fontSize.sm,
          color: colors.textSecondary,
        }}>
          Your intelligent design assistant for Figma
        </p>
      </div>

      {/* Tab Navigation */}
      <TabNavigation 
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {/* Tab Content */}
      <div style={{ flex: 1, overflow: 'hidden' }}>
        {renderActiveTab()}
      </div>
    </div>
  );
};

export default App;