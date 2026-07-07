import type { A2UISchema } from "./types";

export interface TemplateDefinition {
  name: string;
  description: string;
  schema: A2UISchema;
}

export const TEMPLATES: Record<string, TemplateDefinition> = {
  travelDashboard: {
    name: "Travel Dashboard",
    description: "Combined flight ticket, destination weather, and packing checklist.",
    schema: {
      id: "travel_dashboard_root",
      surface: "Stack",
      data: { gap: "24px" },
      children: [
        {
          id: "flight_ticket_101",
          surface: "FlightCard",
          data: {
            airline: "Pacific Horizon",
            flightNumber: "PH-782",
            fromCode: "SFO",
            fromCity: "San Francisco",
            toCode: "SEA",
            toCity: "Seattle",
            duration: "2h 15m",
            departureTime: "10:30 AM",
            arrivalTime: "12:45 PM",
            date: "July 15, 2026",
            gate: "A12",
            seat: "14F",
            boardingClass: "Premium Cabin",
            boardingTime: "09:50 AM",
            status: "On Time"
          }
        },
        {
          id: "seattle_weather",
          surface: "WeatherWidget",
          data: {
            location: "Seattle, WA",
            date: "Wednesday, July 15",
            temperature: 64,
            unit: "F",
            condition: "Rainy",
            humidity: "78%",
            wind: "14 mph SSE",
            uvIndex: "2 (Low)",
            recommendations: [
              "Carry a light waterproof jacket or umbrella.",
              "Expect minor traffic delay on I-5 due to wet roads."
            ]
          }
        },
        {
          id: "trip_tasks",
          surface: "TaskBoard",
          data: {
            title: "Seattle Trip Checklist",
            tasks: [
              { taskId: "task_1", label: "Check in online", completed: false, priority: "high" },
              { taskId: "task_2", label: "Pack umbrella & raincoat", completed: true, priority: "high" },
              { taskId: "task_3", label: "Download offline maps for Washington", completed: false, priority: "medium" },
              { taskId: "task_4", label: "Pre-book airport parking spot", completed: false, priority: "low" }
            ]
          }
        }
      ]
    }
  },

  bookingAssistant: {
    name: "Booking Assistant",
    description: "Support query card leading to an interactive booking modification form.",
    schema: {
      id: "booking_assistant_root",
      surface: "Stack",
      data: { gap: "20px" },
      children: [
        {
          id: "info_banner",
          surface: "Card",
          data: {
            title: "Support Assistant",
            subtitle: "Reservation modification requests",
            body: "Hi! I noticed your flight was rescheduled. You can modify your itinerary or request a travel voucher for free using the form below. Please submit your preferences.",
            iconName: "Sparkles",
            statusText: "Free Upgrade Eligible",
            statusType: "success"
          }
        },
        {
          id: "modification_form",
          surface: "FormWidget",
          data: {
            title: "Request Change",
            subtitle: "Select your preferred alternate destination & flight class.",
            submitLabel: "Submit Request to Agent",
            fields: [
              {
                name: "requested_destination",
                label: "Select New Destination",
                type: "select",
                defaultValue: "Portland (PDX)",
                options: ["Portland (PDX)", "Vancouver (YVR)", "Los Angeles (LAX)", "Las Vegas (LAS)"]
              },
              {
                name: "preferred_class",
                label: "Preferred Seating Class",
                type: "select",
                defaultValue: "Economy Plus",
                options: ["First Class", "Economy Plus", "Standard Economy"]
              },
              {
                name: "contact_phone",
                label: "Notification Phone Number",
                type: "text",
                placeholder: "+1 (555) 019-2834"
              }
            ]
          }
        }
      ]
    }
  },

  weatherGrid: {
    name: "Multi-city Weather Grid",
    description: "Responsive multi-column grid layout displaying different weather surfaces.",
    schema: {
      id: "weather_grid_root",
      surface: "Stack",
      data: { gap: "24px" },
      children: [
        {
          id: "weather_intro",
          surface: "Card",
          data: {
            title: "Global Forecast",
            subtitle: "Comparing flight routes",
            body: "Here is a comparison of your primary hub locations. The weather looks ideal in Honolulu, but storm activity is reported in London.",
            iconName: "Compass",
            statusText: "Travel Alerts Active",
            statusType: "warning",
            actions: [
              { label: "View Travel Advisories", actionType: "view_advisories", primary: true },
              { label: "Mute Notifications", actionType: "mute_alerts", primary: false }
            ]
          }
        },
        {
          id: "cities_grid",
          surface: "Grid",
          data: { columns: 2, gap: "20px" },
          children: [
            {
              id: "honolulu_weather",
              surface: "WeatherWidget",
              data: {
                location: "Honolulu, HI",
                date: "Wednesday, July 15",
                temperature: 84,
                unit: "F",
                condition: "Sunny",
                humidity: "52%",
                wind: "8 mph ENE",
                uvIndex: "10 (Very High)",
                recommendations: [
                  "Wear SPF 50 sunscreen.",
                  "Perfect beach conditions."
                ]
              }
            },
            {
              id: "london_weather",
              surface: "WeatherWidget",
              data: {
                location: "London, UK",
                date: "Wednesday, July 15",
                temperature: 58,
                unit: "C", // Triggering Celsius to show custom render units
                condition: "Stormy",
                humidity: "90%",
                wind: "28 mph WSW",
                uvIndex: "1 (Low)",
                recommendations: [
                  "Heavy thunderstorms forecast. Avoid outdoor commutes.",
                  "Check for tube disruptions on London Underground."
                ]
              }
            }
          ]
        }
      ]
    }
  }
};
