import React, { useState, useEffect } from "react";
import { Terminal, Cpu, Code2, Eye, HelpCircle } from "lucide-react";
import "./App.css";

import type { A2UISchema, A2UIActionEvent } from "./a2ui/types";
import { A2UIRenderer } from "./a2ui/A2UIRenderer";
import { TEMPLATES } from "./a2ui/templates";

export default function App() {
  // Simple hash router state
  const [route, setRoute] = useState<string>(window.location.hash || "#/");

  useEffect(() => {
    const handleHashChange = () => {
      setRoute(window.location.hash || "#/");
    };
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  const isTimesheetRoute = route.startsWith("#/timesheet") || window.location.pathname === "/timesheet";

  // Common rendering schemas & logs
  const [schema, setSchema] = useState<A2UISchema | null>(null);
  const [jsonInput, setJsonInput] = useState<string>("");
  const [parseError, setParseError] = useState<string | null>(null);
  const [actionLogs, setActionLogs] = useState<A2UIActionEvent[]>([]);

  // Agent Chat States (only for playground)
  const [agentPrompt, setAgentPrompt] = useState<string>("");
  const [agentLoading, setAgentLoading] = useState<boolean>(false);
  const [agentStatus, setAgentStatus] = useState<string>("");
  const [socket, setSocket] = useState<WebSocket | null>(null);

  const [selectedTemplate, setSelectedTemplate] = useState<string>("travelDashboard");

  // Initialize templates if in playground route
  useEffect(() => {
    if (!isTimesheetRoute) {
      const defaultTemplate = TEMPLATES.travelDashboard;
      const initialJson = JSON.stringify(defaultTemplate.schema, null, 2);
      setJsonInput(initialJson);
      setSchema(defaultTemplate.schema);
    }
  }, [isTimesheetRoute]);

  // Establish WebSocket connection based on the active route
  useEffect(() => {
    let ws: WebSocket;
    let reconnectTimeout: number;

    const connect = () => {
      setSchema(null);
      setJsonInput("");
      
      const path = isTimesheetRoute ? "timesheet" : "agent";
      console.log(`Connecting to WebSocket: ws://localhost:8000/ws/${path}`);
      ws = new WebSocket(`ws://localhost:8000/ws/${path}`);

      ws.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data);
          
          if (isTimesheetRoute) {
            // Fullscreen Timesheet receives Compiled Layouts directly from Agent
            setSchema(msg as A2UISchema);
            setJsonInput(JSON.stringify(msg, null, 2));
            setParseError(null);
          } else {
            // Playground receives wrapper messages
            if (msg.type === "status") {
              setAgentStatus(msg.message);
              if (msg.schema) {
                setSchema(msg.schema);
              }
            } else if (msg.type === "schema") {
              setAgentLoading(false);
              setAgentStatus("");
              const jsonStr = JSON.stringify(msg.schema, null, 2);
              setJsonInput(jsonStr);
              setSchema(msg.schema);
              setParseError(null);
              
              // Log successful generation
              const logEvent: A2UIActionEvent = {
                componentId: "ai_agent_server",
                surface: "Agent",
                actionType: "generate_layout",
                payload: { success: true },
                timestamp: new Date().toISOString()
              };
              setActionLogs(prev => [logEvent, ...prev]);
            }
          }
        } catch (err) {
          console.error("Error parsing message from agent server:", err);
        }
      };

      ws.onclose = () => {
        console.log(`WebSocket /ws/${path} closed. Reconnecting...`);
        setAgentLoading(false);
        setAgentStatus("");
        reconnectTimeout = window.setTimeout(connect, 3000);
      };

      setSocket(ws);
    };

    connect();

    return () => {
      if (ws) {
        ws.onclose = null;
        ws.close();
      }
      clearTimeout(reconnectTimeout);
    };
  }, [isTimesheetRoute]);

  // Send prompt to the AI Agent (Playground only)
  const handleAgentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agentPrompt.trim() || agentLoading || !socket) return;

    setAgentLoading(true);
    setAgentStatus("Sending query to Gemini Agent...");
    
    socket.send(JSON.stringify({
      prompt: agentPrompt.trim()
    }));
    
    setAgentPrompt("");
  };

  // Handle updates in JSON editor
  const handleJsonChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setJsonInput(value);

    if (!value.trim()) {
      setSchema(null);
      setParseError("Editor is empty. Provide an A2UI JSON payload.");
      return;
    }

    try {
      const parsed = JSON.parse(value);
      if (!parsed || typeof parsed !== "object") {
        setParseError("Payload must be a valid JSON object.");
        return;
      }
      if (!parsed.id) {
        setParseError("Validation Warning: Root component is missing a unique 'id' field.");
        return;
      }
      if (!parsed.surface) {
        setParseError("Validation Warning: Root component is missing 'surface' field.");
        return;
      }

      setSchema(parsed);
      setParseError(null);
    } catch (err: any) {
      setParseError(err.message || "Malformed JSON syntax");
    }
  };

  // Change templates via dropdown (Playground only)
  const handleTemplateSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const key = e.target.value;
    setSelectedTemplate(key);
    
    const template = TEMPLATES[key];
    if (template) {
      const jsonStr = JSON.stringify(template.schema, null, 2);
      setJsonInput(jsonStr);
      setSchema(template.schema);
      setParseError(null);
    }
  };

  // Listen to UI interaction callbacks from dynamic widgets
  const handleUIAction = (event: A2UIActionEvent) => {
    setActionLogs(prev => [event, ...prev]);

    // Send actions back to server for bidirectional state mutation (like Timesheet CRUD)
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify(event));
    }
  };

  // Format log timestamps
  const formatTime = (isoString: string) => {
    const d = new Date(isoString);
    return d.toTimeString().split(" ")[0];
  };

  // Clear action console logs
  const clearLogs = () => {
    setActionLogs([]);
  };

  // Render Full Screen Mode for Timesheet Route
  if (isTimesheetRoute) {
    return (
      <div className="fullscreen-timesheet-container" style={{ 
        minHeight: "100vh", 
        width: "100vw", 
        background: "var(--bg-app, #0a0b0e)",
        color: "var(--text-primary, #f3f4f6)",
        padding: "40px 24px",
        boxSizing: "border-box",
        display: "flex",
        justifyContent: "center",
        overflowY: "auto"
      }}>
        <div style={{ width: "100%", maxWidth: "1200px" }}>
          {schema ? (
            <A2UIRenderer schema={schema} onAction={handleUIAction} />
          ) : (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "80vh" }}>
              <div className="spinner"></div>
              <p style={{ marginTop: "16px", color: "var(--text-secondary)" }}>Connecting to Agent Timesheet Server...</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Render playground view
  return (
    <div className="app-container">
      {/* 1. Global Navigation Bar */}
      <header className="app-header">
        <div className="header-title-group">
          <div className="app-logo">A2</div>
          <div>
            <h1 style={{ fontSize: "1.1rem", margin: 0, fontWeight: 600 }}>Deterministic A2UI Builder</h1>
            <p style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>
              Step-by-step Agent-to-UI rendering playground
            </p>
          </div>
        </div>

        <div className="header-meta">
          <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", display: "flex", alignItems: "center", gap: "6px" }}>
            <Cpu size={14} /> Agent Server Connected (Port 8000)
          </span>
          <button 
            className="btn-header"
            onClick={() => {
              const infoEvent: A2UIActionEvent = {
                componentId: "system_trigger",
                surface: "System",
                actionType: "ping_agent",
                payload: { message: "Hello! Current schema size is " + jsonInput.length + " bytes." },
                timestamp: new Date().toISOString()
              };
              handleUIAction(infoEvent);
            }}
          >
            Send Ping to Agent
          </button>
        </div>
      </header>

      {/* 2. Short Quick navigation link to Timesheet portal */}
      <div style={{ 
        display: "flex", 
        background: "rgba(139, 92, 246, 0.05)", 
        borderBottom: "1px solid var(--border-color)",
        padding: "10px 24px",
        justifyContent: "space-between",
        alignItems: "center"
      }}>
        <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>
          Want to view the full screen A2UI application?
        </span>
        <a 
          href="#/timesheet" 
          style={{ 
            fontSize: "0.75rem", 
            color: "#8b5cf6", 
            fontWeight: 600, 
            textDecoration: "none",
            display: "flex",
            alignItems: "center",
            gap: "4px"
          }}
        >
          Open Fullscreen Timesheet Portal ➜
        </a>
      </div>

      {/* 3. Main split-pane workspace */}
      <div className="main-content">
        
        {/* Left Side: Schema JSON Editor */}
        <section className="editor-pane">
          
          {/* AI Agent prompt bar */}
          <div style={{ 
            padding: "12px 16px", 
            borderBottom: "1px solid var(--border-color)", 
            background: "linear-gradient(135deg, rgba(139, 92, 246, 0.08), rgba(59, 130, 246, 0.03))",
            display: "flex",
            flexDirection: "column",
            gap: "8px"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "0.8rem", fontWeight: 600, color: "var(--color-primary)" }}>
              <Cpu size={14} />
              <span>Ask AI Agent to Generate UI</span>
            </div>
            
            <form onSubmit={handleAgentSubmit} style={{ display: "flex", gap: "8px" }}>
              <input
                type="text"
                value={agentPrompt}
                onChange={(e) => setAgentPrompt(e.target.value)}
                placeholder="e.g. Flight from JFK to LHR with stormy weather..."
                style={{
                  flex: 1,
                  background: "var(--bg-input)",
                  border: "1px solid var(--border-color)",
                  borderRadius: "4px",
                  padding: "6px 10px",
                  color: "var(--text-primary)",
                  fontSize: "0.8rem",
                  outline: "none"
                }}
                disabled={agentLoading}
              />
              <button 
                type="submit" 
                disabled={agentLoading || !agentPrompt.trim()}
                className="btn-header"
                style={{ padding: "6px 12px", fontSize: "0.75rem" }}
              >
                {agentLoading ? "Thinking..." : "Generate"}
              </button>
            </form>
            {agentStatus && (
              <span style={{ fontSize: "0.7rem", color: "var(--color-warning)" }}>
                ● {agentStatus}
              </span>
            )}
          </div>

          <div className="pane-header">
            <div className="pane-title">
              <Code2 size={15} style={{ color: "var(--color-primary)" }} />
              Agent Schema Payload
            </div>
            
            <select 
              className="template-selector"
              value={selectedTemplate} 
              onChange={handleTemplateSelect}
            >
              {Object.entries(TEMPLATES).map(([key, val]) => (
                <option key={key} value={key}>
                  {val.name}
                </option>
              ))}
            </select>
          </div>

          <div className="code-editor-container">
            <textarea
              className="json-textarea"
              value={jsonInput}
              onChange={handleJsonChange}
              spellCheck="false"
              placeholder='{\n  "id": "root",\n  "surface": "Card",\n  "data": {\n    "body": "Write JSON here..."\n  }\n}'
            />
          </div>

          <div className="editor-footer">
            <div className="editor-status">
              <span className={`status-indicator ${parseError ? "status-err" : "status-ok"}`}></span>
              <span style={{ color: parseError ? "#f87171" : "var(--text-secondary)" }}>
                {parseError ? "JSON Compile Error" : "Schema Compiled OK"}
              </span>
            </div>
            {parseError && (
              <span style={{ fontSize: "0.7rem", color: "#f87171", maxWidth: "220px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {parseError}
              </span>
            )}
          </div>
        </section>

        {/* Right Side: Visual Output and Events Terminal */}
        <section className="visualizer-pane">
          {/* Dynamic Preview Area */}
          <div className="render-area">
            {schema ? (
              <div className="render-container">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "-12px" }}>
                  <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", display: "flex", alignItems: "center", gap: "6px" }}>
                    <Eye size={12} /> Dynamic Preview
                  </span>
                  <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                    Schema Root: <code>{schema.surface}</code>
                  </span>
                </div>
                
                {/* Recursive Mountpoint */}
                <A2UIRenderer schema={schema} onAction={handleUIAction} />
              </div>
            ) : (
              <div className="empty-state">
                <HelpCircle className="empty-state-icon" />
                <h3>Connecting / Loading Layout</h3>
                <p style={{ fontSize: "0.85rem", maxWidth: "320px" }}>
                  Establishing WebSocket connection to python agent server and loading layout schema...
                </p>
              </div>
            )}
          </div>

          {/* Action LogConsole Terminal */}
          <div className="console-pane">
            <div className="pane-header" style={{ borderTop: "1px solid var(--border-color)", borderBottom: "none" }}>
              <div className="pane-title" style={{ fontSize: "0.8rem" }}>
                <Terminal size={14} style={{ color: "var(--color-success)" }} />
                Bidirectional Event Logs (A2UI Actions Console)
              </div>
              {actionLogs.length > 0 && (
                <button 
                  onClick={clearLogs} 
                  className="action-btn" 
                  style={{ padding: "2px 8px", fontSize: "0.7rem" }}
                >
                  Clear Console
                </button>
              )}
            </div>

            <div className="log-list">
              {actionLogs.length === 0 ? (
                <div style={{ color: "var(--text-muted)", fontSize: "0.75rem", padding: "12px", textAlign: "center" }}>
                  No interaction events captured. Click buttons, toggle checkboxes, or submit forms in the preview canvas to see events bubble up here.
                </div>
              ) : (
                actionLogs.map((log, idx) => (
                  <div key={idx} className="log-entry log-action">
                    <div className="log-meta">
                      <span className="log-time">[{formatTime(log.timestamp)}]</span>
                      <span className="log-badge">ACTION</span>
                      <span className="log-msg">
                        {log.surface} (<code>{log.componentId}</code>) emitted <strong>{log.actionType}</strong>
                      </span>
                    </div>
                    <span className="log-payload">
                      Payload: <code>{JSON.stringify(log.payload)}</code>
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
