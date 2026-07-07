import React from "react";
import * as Icons from "lucide-react";
import type { OnA2UIAction } from "../a2ui/types";

interface CardAction {
  label: string;
  actionType: string;
  payload?: Record<string, any>;
  primary?: boolean;
}

interface CardProps {
  id: string;
  title?: string;
  subtitle?: string;
  body: string;
  iconName?: string;
  statusText?: string;
  statusType?: "success" | "warning" | "info" | "danger";
  actions?: CardAction[];
  onAction?: OnA2UIAction;
}

export const Card: React.FC<CardProps> = ({
  id,
  title,
  subtitle,
  body,
  iconName,
  statusText,
  statusType = "info",
  actions = [],
  onAction
}) => {
  // Dynamically resolve the Lucide icon component by name
  const IconComponent = iconName ? (Icons as any)[iconName] : null;

  const handleActionClick = (action: CardAction) => {
    if (onAction) {
      onAction({
        componentId: id,
        surface: "Card",
        actionType: action.actionType,
        payload: action.payload || {},
        timestamp: new Date().toISOString()
      });
    }
  };

  const getBadgeClass = () => {
    switch (statusType) {
      case "success": return "badge-success";
      case "warning": return "badge-warning";
      case "danger": return "badge-danger";
      default: return "badge-info";
    }
  };

  return (
    <div className="a2ui-card animate-fade-in">
      {(title || iconName || statusText) && (
        <div className="card-header">
          <div className="card-title-group">
            {IconComponent && (
              <div className="card-icon-container">
                <IconComponent size={20} />
              </div>
            )}
            <div>
              {title && <h3 className="card-title">{title}</h3>}
              {subtitle && <p className="card-subtitle">{subtitle}</p>}
            </div>
          </div>
          {statusText && (
            <span className={`badge ${getBadgeClass()}`}>
              {statusText}
            </span>
          )}
        </div>
      )}

      <div className="card-body">
        <p>{body}</p>
      </div>

      {actions.length > 0 && (
        <div className="card-actions">
          {actions.map((action, idx) => (
            <button
              key={idx}
              className={`action-btn ${action.primary ? "btn-primary" : ""}`}
              onClick={() => handleActionClick(action)}
            >
              {action.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
