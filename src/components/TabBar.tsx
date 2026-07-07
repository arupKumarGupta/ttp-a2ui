import React from 'react';
import type { OnA2UIAction } from '../a2ui/types';

interface TabBarProps {
  id: string;
  tabs: string[];
  activeTab: string;
  onAction?: OnA2UIAction;
}

export const TabBar: React.FC<TabBarProps> = ({ id, tabs, activeTab, onAction }) => {
  return (
    <div style={{ 
      display: "flex", 
      background: "var(--bg-card, #13151a)", 
      borderBottom: "1px solid var(--border-color, #242838)",
      width: "100%",
      marginBottom: "20px",
      borderRadius: "8px",
      overflow: "hidden"
    }}>
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => onAction?.({
            componentId: id,
            surface: "TabBar",
            actionType: "change_tab",
            payload: { tab },
            timestamp: new Date().toISOString()
          })}
          style={{
            flex: 1,
            padding: "14px",
            background: activeTab === tab ? "rgba(139, 92, 246, 0.1)" : "transparent",
            color: activeTab === tab ? "#8b5cf6" : "var(--text-secondary)",
            border: "none",
            borderBottom: activeTab === tab ? "2px solid #8b5cf6" : "none",
            fontWeight: 600,
            fontSize: "0.85rem",
            cursor: "pointer",
            transition: "all 0.2s"
          }}
        >
          {tab === "timesheet" ? "🕒 Timesheet Dashboard" : "📱 Kiosk View"}
        </button>
      ))}
    </div>
  );
};
export default TabBar;
