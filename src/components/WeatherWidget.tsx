import React from "react";
import { Sun, Cloud, CloudRain, Snowflake, CloudLightning, Droplets, Wind, ShieldAlert, Sparkles, RefreshCw } from "lucide-react";
import type { OnA2UIAction } from "../a2ui/types";

interface WeatherWidgetProps {
  id: string;
  location: string;
  date: string;
  temperature: number;
  unit?: "C" | "F";
  condition: "Sunny" | "Cloudy" | "Rainy" | "Snowy" | "Stormy";
  humidity: string;
  wind: string;
  uvIndex: string;
  recommendations?: string[];
  onAction?: OnA2UIAction;
}

export const WeatherWidget: React.FC<WeatherWidgetProps> = ({
  id,
  location,
  date,
  temperature,
  unit = "F",
  condition,
  humidity,
  wind,
  uvIndex,
  recommendations = [],
  onAction
}) => {
  // Map condition strings to Lucide React icons
  const getWeatherIcon = () => {
    const iconSize = 48;
    switch (condition) {
      case "Sunny":
        return <Sun size={iconSize} className="weather-icon-large" style={{ color: "#f59e0b" }} />;
      case "Cloudy":
        return <Cloud size={iconSize} className="weather-icon-large" style={{ color: "#9ca3af" }} />;
      case "Rainy":
        return <CloudRain size={iconSize} className="weather-icon-large" style={{ color: "#3b82f6" }} />;
      case "Snowy":
        return <Snowflake size={iconSize} className="weather-icon-large" style={{ color: "#60a5fa" }} />;
      case "Stormy":
        return <CloudLightning size={iconSize} className="weather-icon-large" style={{ color: "#8b5cf6" }} />;
      default:
        return <Cloud size={iconSize} className="weather-icon-large" />;
    }
  };

  const handleRefresh = () => {
    if (onAction) {
      onAction({
        componentId: id,
        surface: "WeatherWidget",
        actionType: "refresh",
        payload: { location },
        timestamp: new Date().toISOString()
      });
    }
  };

  return (
    <div className="weather-widget animate-fade-in">
      <div className="weather-header">
        <div>
          <h3 className="weather-location">{location}</h3>
          <p className="weather-date">{date}</p>
        </div>
        <button 
          className="action-btn" 
          onClick={handleRefresh}
          style={{ padding: "6px", borderRadius: "50%" }}
          title="Refresh weather"
        >
          <RefreshCw size={14} />
        </button>
      </div>

      <div className="weather-main">
        <div className="weather-temp-group">
          <span className="weather-temp">{temperature}</span>
          <span className="weather-unit">°{unit}</span>
        </div>
        
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          {getWeatherIcon()}
          <div className="weather-condition">
            <span className="condition-text">{condition}</span>
            <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>Feels like {temperature - 2}°</span>
          </div>
        </div>
      </div>

      {/* Grid of stats */}
      <div className="weather-stats">
        <div className="stat-box">
          <Droplets size={16} className="stat-icon" />
          <div className="stat-info">
            <span className="stat-val">{humidity}</span>
            <span className="stat-lbl">Humidity</span>
          </div>
        </div>

        <div className="stat-box">
          <Wind size={16} className="stat-icon" />
          <div className="stat-info">
            <span className="stat-val">{wind}</span>
            <span className="stat-lbl">Wind Speed</span>
          </div>
        </div>

        <div className="stat-box">
          <ShieldAlert size={16} className="stat-icon" />
          <div className="stat-info">
            <span className="stat-val">{uvIndex}</span>
            <span className="stat-lbl">UV Index</span>
          </div>
        </div>
      </div>

      {/* Recommendations block */}
      {recommendations.length > 0 && (
        <div className="weather-recommendations">
          <h4 className="rec-title">
            <Sparkles size={12} style={{ marginRight: "6px", display: "inline" }} />
            AI Recommendations
          </h4>
          <div className="rec-list">
            {recommendations.map((rec, index) => (
              <div key={index} className="rec-item">
                <span>{rec}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
