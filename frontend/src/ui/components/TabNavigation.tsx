import React from 'react';
import { tabStyles } from '../styles';

export interface Tab {
  id: string;
  label: string;
  icon?: string;
}

interface TabNavigationProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

const TabNavigation: React.FC<TabNavigationProps> = ({ tabs, activeTab, onTabChange }) => {
  return (
    <div style={{
      ...tabStyles.container,
      background: 'linear-gradient(90deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.7) 100%)',
      backdropFilter: 'blur(20px)',
      borderBottom: '1px solid rgba(102, 126, 234, 0.2)',
    }}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          style={{
            ...tabStyles.tab,
            background: activeTab === tab.id 
              ? 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)'
              : 'transparent',
            color: activeTab === tab.id ? '#667eea' : '#666',
            borderBottom: activeTab === tab.id ? '3px solid #667eea' : '3px solid transparent',
            fontWeight: activeTab === tab.id ? '600' : '500',
            transition: 'all 0.3s ease',
            position: 'relative',
            overflow: 'hidden',
          }}
          onClick={() => onTabChange(tab.id)}
          className={activeTab === tab.id ? 'active' : ''}
          onMouseEnter={(e) => {
            if (activeTab !== tab.id) {
              e.currentTarget.style.background = 'rgba(102, 126, 234, 0.05)';
              e.currentTarget.style.color = '#667eea';
            }
          }}
          onMouseLeave={(e) => {
            if (activeTab !== tab.id) {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.color = '#666';
            }
          }}
        >
          {tab.icon && <span style={{ marginRight: '6px' }}>{tab.icon}</span>}
          {tab.label}
        </button>
      ))}
    </div>
  );
};

export default TabNavigation;
