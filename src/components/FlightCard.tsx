import React from "react";
import { Plane, FileText } from "lucide-react";
import type { OnA2UIAction } from "../a2ui/types";

interface FlightCardProps {
  id: string;
  airline: string;
  flightNumber: string;
  fromCode: string;
  fromCity: string;
  toCode: string;
  toCity: string;
  duration: string;
  departureTime: string;
  arrivalTime: string;
  date: string;
  gate: string;
  seat: string;
  boardingClass: string;
  boardingTime: string;
  status: "On Time" | "Delayed" | "Boarding";
  onAction?: OnA2UIAction;
}

export const FlightCard: React.FC<FlightCardProps> = ({
  id,
  airline,
  flightNumber,
  fromCode,
  fromCity,
  toCode,
  toCity,
  duration,
  departureTime,
  arrivalTime,
  date,
  gate,
  seat,
  boardingClass,
  boardingTime,
  status,
  onAction
}) => {
  const getStatusBadge = () => {
    switch (status) {
      case "Boarding":
        return <span className="badge badge-success">Boarding</span>;
      case "Delayed":
        return <span className="badge badge-danger">Delayed</span>;
      default:
        return <span className="badge badge-info">On Time</span>;
    }
  };

  const handleAction = (actionName: string) => {
    if (onAction) {
      onAction({
        componentId: id,
        surface: "FlightCard",
        actionType: actionName,
        payload: { flightNumber, fromCode, toCode },
        timestamp: new Date().toISOString()
      });
    }
  };

  return (
    <div className="flight-card animate-fade-in">
      {/* Ticket Top: Airline Name & Number */}
      <div className="flight-header">
        <div className="airline-info">
          <div className="airline-logo">
            <Plane size={16} />
          </div>
          <div>
            <div style={{ fontWeight: 600, fontSize: "0.9rem" }}>{airline}</div>
            <div className="flight-number">{flightNumber}</div>
          </div>
        </div>
        <div>
          {getStatusBadge()}
        </div>
      </div>

      {/* Ticket Mid: Route Details (Airport codes & plane graphics) */}
      <div className="flight-route">
        <div className="route-node left">
          <div className="airport-code">{fromCode}</div>
          <div className="airport-name">{fromCity}</div>
        </div>

        <div className="route-path">
          <div className="path-line"></div>
          <div className="path-plane">
            <Plane size={18} style={{ transform: "rotate(90deg)" }} />
          </div>
          <span className="duration">{duration}</span>
        </div>

        <div className="route-node right">
          <div className="airport-code">{toCode}</div>
          <div className="airport-name">{toCity}</div>
        </div>
      </div>

      {/* Ticket Details: Gate, Seat, Class, Boarding */}
      <div className="flight-details">
        <div className="detail-item">
          <span className="detail-label">Date</span>
          <span className="detail-value">{date}</span>
        </div>
        <div className="detail-item">
          <span className="detail-label">Gate</span>
          <span className="detail-value">{gate}</span>
        </div>
        <div className="detail-item">
          <span className="detail-label">Seat</span>
          <span className="detail-value">{seat}</span>
        </div>
        <div className="detail-item">
          <span className="detail-label">Class</span>
          <span className="detail-value">{boardingClass}</span>
        </div>
      </div>

      {/* Ticket Bottom: Timings & Actions */}
      <div className="flight-footer">
        <div className="flight-times">
          <div className="time-box">
            <span className="time-label">Boarding Time</span>
            <span className="time-value" style={{ color: "var(--color-success)" }}>{boardingTime}</span>
          </div>
          <div className="time-box">
            <span className="time-label">Departure</span>
            <span className="time-value">{departureTime}</span>
          </div>
          <div className="time-box">
            <span className="time-label">Arrival</span>
            <span className="time-value">{arrivalTime}</span>
          </div>
        </div>

        <div style={{ display: "flex", gap: "8px" }}>
          <button 
            className="action-btn"
            onClick={() => handleAction("view_boarding_pass")}
            title="View Details"
          >
            <FileText size={14} />
            Details
          </button>
          <button 
            className="action-btn btn-primary"
            onClick={() => handleAction("check_in")}
          >
            Check In
          </button>
        </div>
      </div>
    </div>
  );
};
