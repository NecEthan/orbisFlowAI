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
    <div style={tabStyles.container}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          style={{
            ...tabStyles.tab,
            ...(activeTab === tab.id ? { 
              color: '#18A0FB',
              borderBottomColor: '#18A0FB',
            } : {})
          }}
          onClick={() => onTabChange(tab.id)}
          className={activeTab === tab.id ? 'active' : ''}
        >
          {tab.icon && <span style={{ marginRight: '6px' }}>{tab.icon}</span>}
          {tab.label}
        </button>
      ))}
    </div>
  );
};

export default TabNavigation;
