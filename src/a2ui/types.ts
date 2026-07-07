/**
 * Represents a single dynamic UI element sent by the Agent.
 */
export interface A2UISchema {
  id: string;              // Unique identifier for the element
  surface: string;         // Name of the component to render (e.g. "FlightCard")
  data: Record<string, any>; // Properties/content specific to this component
  children?: A2UISchema[]; // Nested components if this acts as a layout container
}

/**
 * Details of an interactive action triggered by the user inside a dynamically rendered component.
 */
export interface A2UIActionEvent {
  componentId: string;     // The id of the component that triggered the event
  surface: string;         // The surface type of the component
  actionType: string;      // The action type (e.g., "click", "submit", "toggle")
  payload: Record<string, any>; // Data associated with the action (e.g., input values)
  timestamp: string;       // ISO timestamp of when it occurred
}

/**
 * The callback function signature passed down to all dynamic components to report user interaction.
 */
export type OnA2UIAction = (event: A2UIActionEvent) => void;
