import React from "react";
import { AlertTriangle } from "lucide-react";
import type { A2UISchema, OnA2UIAction } from "./types";
import { A2UIRegistry, isComponentRegistered } from "./registry";

interface A2UIRendererProps {
  schema: A2UISchema;
  onAction: OnA2UIAction;
}

export const A2UIRenderer: React.FC<A2UIRendererProps> = ({ schema, onAction }) => {
  // 1. Guard against null or invalid schema structure
  if (!schema || typeof schema !== "object" || !schema.surface) {
    return (
      <div className="render-error">
        <div className="render-error-title">
          <AlertTriangle size={16} /> Invalid Schema Node
        </div>
        <p>The schema node is null or missing the required "surface" property.</p>
      </div>
    );
  }

  // 2. Lookup surface in the component registry
  if (!isComponentRegistered(schema.surface)) {
    return (
      <div className="render-error">
        <div className="render-error-title">
          <AlertTriangle size={16} /> Unregistered Surface: "{schema.surface}"
        </div>
        <p>
          The Agent requested a surface called <code>{schema.surface}</code>, 
          but this component is not registered on the client.
        </p>
      </div>
    );
  }

  const Component = A2UIRegistry[schema.surface];

  // 3. Recursively resolve children elements if they exist
  let renderedChildren: React.ReactNode = null;
  if (schema.children && Array.isArray(schema.children)) {
    renderedChildren = schema.children.map((childNode, idx) => {
      // Fallback unique key: use childNode.id or index combined with current node
      const fallbackKey = `${schema.id}-child-${idx}`;
      return (
        <A2UIRenderer 
          key={childNode.id || fallbackKey} 
          schema={childNode} 
          onAction={onAction} 
        />
      );
    });
  }

  // 4. Safely render the component with props and error boundary handling
  try {
    return (
      <Component 
        id={schema.id} 
        onAction={onAction} 
        {...(schema.data || {})}
      >
        {renderedChildren}
      </Component>
    );
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    return (
      <div className="render-error">
        <div className="render-error-title">
          <AlertTriangle size={16} /> Runtime Error inside "{schema.surface}"
        </div>
        <p>Failed to render surface <code>{schema.id}</code> due to a code error:</p>
        <pre style={{ marginTop: "8px", overflowX: "auto" }}>{errorMsg}</pre>
      </div>
    );
  }
};
