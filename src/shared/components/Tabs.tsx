import React, { useState } from 'react';
import './Tabs.css';

interface Tab {
  id: string;
  label: string;
  content: React.ReactNode;
}

interface TabsProps {
  tabs: Tab[];
  defaultActiveId?: string;
}

export const Tabs: React.FC<TabsProps> = ({ tabs, defaultActiveId }) => {
  const [activeId, setActiveId] = useState(defaultActiveId || tabs[0]?.id);

  return (
    <div className="tabs-container">
      <div className="tabs-header">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`tab-btn ${activeId === tab.id ? 'active' : ''}`}
            onClick={() => setActiveId(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="tabs-content">
        {tabs.find((tab) => tab.id === activeId)?.content}
      </div>
    </div>
  );
};
