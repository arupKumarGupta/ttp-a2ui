import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Terminal, Cpu, Code2, Eye, HelpCircle } from "lucide-react";
import type { A2UISchema, A2UIActionEvent } from "./a2ui/types";
import { A2UIRenderer } from "./a2ui/A2UIRenderer";
import { TEMPLATES } from "./a2ui/templates";

// Styled Components definitions
const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
  background-color: var(--bg-app);
`;

const Header = styled.header`
  height: 64px;
  border-bottom: 1px solid var(--border-color);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  background-color: rgba(20, 22, 31, 0.7);
  backdrop-filter: blur(10px);
  z-index: 10;
  flex-shrink: 0;
`;

const TitleGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const Logo = styled.div`
  background: linear-gradient(135deg, var(--color-primary), var(--color-secondary));
  width: 32px;
  height: 32px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 0.95rem;
  color: white;
  box-shadow: 0 0 10px rgba(139, 92, 246, 0.3);
`;

const HeaderTitle = styled.h1`
  font-size: 1.1rem;
  margin: 0;
  font-weight: 600;
`;

const HeaderSubtitle = styled.p`
  font-size: 0.75rem;
  color: var(--text-secondary);
  margin: 0;
`;

const HeaderMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const ServerStatus = styled.span`
  font-size: 0.75rem;
  color: var(--text-muted);
  display: flex;
  align-items: center;
  gap: 6px;
`;

const PingButton = styled.button`
  background: var(--color-primary);
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: var(--radius-sm);
  font-family: var(--font-sans);
  font-weight: 500;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  
  &:hover {
    background: #7c3aed;
    box-shadow: 0 0 12px rgba(139, 92, 246, 0.4);
  }
`;

const QuickBanner = styled.div`
  display: flex;
  background: rgba(139, 92, 246, 0.05);
  border-bottom: 1px solid var(--border-color);
  padding: 10px 24px;
  justify-content: space-between;
  align-items: center;
  flex-shrink: 0;
`;

const BannerLinkText = styled.span`
  font-size: 0.75rem;
  color: var(--text-secondary);
`;

const BannerLink = styled.a`
  font-size: 0.75rem;
  color: #8b5cf6;
  font-weight: 600;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 4px;
  
  &:hover {
    text-decoration: underline;
  }
`;

const Workspace = styled.div`
  display: flex;
  flex: 1;
  overflow: hidden;
`;

const EditorPane = styled.section`
  width: 450px;
  border-right: 1px solid var(--border-color);
  display: flex;
  flex-direction: column;
  background-color: var(--bg-editor);
  overflow: hidden;
  flex-shrink: 0;
`;

const PromptBar = styled.div`
  padding: 12px 16px;
  border-bottom: 1px solid var(--border-color);
  background: linear-gradient(135deg, rgba(139, 92, 246, 0.08), rgba(59, 130, 246, 0.03));
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const PromptTitleGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--color-primary);
`;

const PromptForm = styled.form`
  display: flex;
  gap: 8px;
`;

const PromptInput = styled.input`
  flex: 1;
  background: var(--bg-input);
  border: 1px solid var(--border-color);
  border-radius: 4px;
  padding: 6px 10px;
  color: var(--text-primary);
  font-size: 0.8rem;
  outline: none;
  
  &:focus {
    border-color: var(--border-focus);
  }
`;

const PromptButton = styled.button`
  background: var(--color-primary);
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: var(--radius-sm);
  font-family: var(--font-sans);
  font-weight: 500;
  font-size: 0.75rem;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const PromptStatus = styled.span`
  font-size: 0.7rem;
  color: var(--color-warning);
`;

const PaneHeader = styled.div`
  height: 48px;
  border-bottom: 1px solid var(--border-color);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  background-color: rgba(20, 22, 31, 0.3);
  flex-shrink: 0;
`;

const PaneTitle = styled.div`
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const TemplateSelect = styled.select`
  background-color: var(--bg-input);
  border: 1px solid var(--border-color);
  color: var(--text-primary);
  padding: 4px 8px;
  border-radius: var(--radius-sm);
  font-family: var(--font-sans);
  font-size: 0.8rem;
  cursor: pointer;
  outline: none;
  
  &:focus {
    border-color: var(--border-focus);
  }
`;

const CodeEditorContainer = styled.div`
  flex: 1;
  position: relative;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const JsonTextarea = styled.textarea`
  flex: 1;
  background-color: var(--bg-editor);
  color: #e5c07b;
  font-family: var(--font-mono);
  font-size: 0.85rem;
  padding: 16px;
  border: none;
  resize: none;
  outline: none;
  line-height: 1.5;
  tab-size: 2;
  overflow-y: auto;
`;

const PaneFooter = styled.div`
  padding: 12px 16px;
  border-top: 1px solid var(--border-color);
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: rgba(20, 22, 31, 0.3);
  flex-shrink: 0;
`;

const EditorStatus = styled.div`
  font-size: 0.75rem;
  display: flex;
  align-items: center;
  gap: 6px;
`;

const StatusIndicator = styled.span<{ $error: boolean }>`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: ${props => props.$error ? 'var(--color-danger)' : 'var(--color-success)'};
`;

const ErrorText = styled.span`
  font-size: 0.7rem;
  color: #f87171;
  max-width: 220px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const VisualizerPane = styled.section`
  flex: 1;
  display: flex;
  flex-direction: column;
  background-color: var(--bg-app);
  overflow: hidden;
`;

const RenderArea = styled.div`
  flex: 1;
  padding: 32px;
  overflow-y: auto;
  display: flex;
  justify-content: center;
  background: radial-gradient(circle at top left, rgba(139, 92, 246, 0.03), transparent 40%),
              radial-gradient(circle at bottom right, rgba(59, 130, 246, 0.03), transparent 40%);
`;

const RenderContainer = styled.div`
  width: 100%;
  max-width: 800px;
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const RenderHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: -12px;
`;

const RenderHeaderLabel = styled.span`
  font-size: 0.75rem;
  color: var(--text-muted);
  display: flex;
  align-items: center;
  gap: 6px;
`;

const RenderHeaderInfo = styled.span`
  font-size: 0.75rem;
  color: var(--text-muted);
`;

const EmptyStateContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: var(--text-secondary);
  height: 100%;
  text-align: center;
  gap: 12px;
`;

const EmptyStateText = styled.p`
  font-size: 0.85rem;
  max-width: 320px;
  color: var(--text-secondary);
`;

const ConsolePane = styled.div`
  height: 180px;
  border-top: 1px solid var(--border-color);
  background-color: var(--bg-editor);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  flex-shrink: 0;
`;

const ConsoleHeader = styled.div`
  height: 48px;
  border-bottom: 1px solid var(--border-color);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  background-color: rgba(20, 22, 31, 0.3);
  flex-shrink: 0;
`;

const ClearLogsButton = styled.button`
  background-color: var(--bg-input);
  border: 1px solid var(--border-color);
  color: var(--text-primary);
  padding: 2px 8px;
  border-radius: var(--radius-sm);
  font-family: var(--font-sans);
  font-weight: 500;
  font-size: 0.7rem;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: rgba(139, 92, 246, 0.15);
    border-color: var(--color-primary);
  }
`;

const LogList = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 12px 16px;
  font-family: var(--font-mono);
  font-size: 0.75rem;
  display: flex;
  flex-direction: column-reverse;
  gap: 8px;
`;

const EmptyLogsText = styled.div`
  color: var(--text-muted);
  font-size: 0.75rem;
  padding: 12px;
  text-align: center;
`;

const LogEntry = styled.div`
  padding: 6px 12px;
  border-radius: var(--radius-sm);
  background-color: rgba(26, 29, 40, 0.5);
  border-left: 3px solid var(--color-primary);
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  animation: fadeIn 0.25s ease-out;
`;

const LogMeta = styled.div`
  display: flex;
  gap: 12px;
`;

const LogTime = styled.span`
  color: var(--text-muted);
`;

const LogBadge = styled.span`
  color: var(--color-primary);
  font-weight: 600;
`;

const LogMsg = styled.span`
  color: var(--text-primary);
`;

const LogPayload = styled.span`
  color: var(--text-secondary);
  font-size: 0.7rem;
`;

export default function PlaygroundView() {
  const [schema, setSchema] = useState<A2UISchema | null>(null);
  const [jsonInput, setJsonInput] = useState<string>("");
  const [parseError, setParseError] = useState<string | null>(null);
  const [actionLogs, setActionLogs] = useState<A2UIActionEvent[]>([]);

  // Agent Chat States
  const [agentPrompt, setAgentPrompt] = useState<string>("");
  const [agentLoading, setAgentLoading] = useState<boolean>(false);
  const [agentStatus, setAgentStatus] = useState<string>("");
  const [socket, setSocket] = useState<WebSocket | null>(null);

  const [selectedTemplate, setSelectedTemplate] = useState<string>("travelDashboard");

  // Initialize templates
  useEffect(() => {
    const defaultTemplate = TEMPLATES.travelDashboard;
    const initialJson = JSON.stringify(defaultTemplate.schema, null, 2);
    setJsonInput(initialJson);
    setSchema(defaultTemplate.schema);
  }, []);

  // Establish WebSocket connection
  useEffect(() => {
    let ws: WebSocket;
    let reconnectTimeout: number;

    const connect = () => {
      console.log("Connecting to WebSocket: ws://localhost:8000/ws/agent");
      ws = new WebSocket("ws://localhost:8000/ws/agent");

      ws.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data);
          
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
        } catch (err) {
          console.error("Error parsing message from agent server:", err);
        }
      };

      ws.onclose = () => {
        console.log("WebSocket /ws/agent closed. Reconnecting...");
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
  }, []);

  // Send prompt to the AI Agent
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

  // Change templates via dropdown
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

    // Send actions back to server for bidirectional state mutation
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

  return (
    <Container>
      {/* 1. Global Navigation Bar */}
      <Header>
        <TitleGroup>
          <Logo>A2</Logo>
          <div>
            <HeaderTitle>Deterministic A2UI Builder</HeaderTitle>
            <HeaderSubtitle>
              Step-by-step Agent-to-UI rendering playground
            </HeaderSubtitle>
          </div>
        </TitleGroup>

        <HeaderMeta>
          <ServerStatus>
            <Cpu size={14} /> Agent Server Connected (Port 8000)
          </ServerStatus>
          <PingButton 
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
          </PingButton>
        </HeaderMeta>
      </Header>

      {/* 2. Short Quick navigation link to Timesheet portal */}
      <QuickBanner>
        <BannerLinkText>
          Want to view the full screen A2UI application?
        </BannerLinkText>
        <BannerLink href="#/timesheet">
          Open Fullscreen Timesheet Portal ➜
        </BannerLink>
      </QuickBanner>

      {/* 3. Main split-pane workspace */}
      <Workspace>
        
        {/* Left Side: Schema JSON Editor */}
        <EditorPane>
          {/* AI Agent prompt bar */}
          <PromptBar>
            <PromptTitleGroup>
              <Cpu size={14} />
              <span>Ask AI Agent to Generate UI</span>
            </PromptTitleGroup>
            
            <PromptForm onSubmit={handleAgentSubmit}>
              <PromptInput
                type="text"
                value={agentPrompt}
                onChange={(e) => setAgentPrompt(e.target.value)}
                placeholder="e.g. Flight from JFK to LHR with stormy weather..."
                disabled={agentLoading}
              />
              <PromptButton type="submit" disabled={agentLoading || !agentPrompt.trim()}>
                {agentLoading ? "Thinking..." : "Generate"}
              </PromptButton>
            </PromptForm>
            {agentStatus && <PromptStatus>● {agentStatus}</PromptStatus>}
          </PromptBar>

          <PaneHeader>
            <PaneTitle>
              <Code2 size={15} style={{ color: "var(--color-primary)" }} />
              Agent Schema Payload
            </PaneTitle>
            
            <TemplateSelect value={selectedTemplate} onChange={handleTemplateSelect}>
              {Object.entries(TEMPLATES).map(([key, val]) => (
                <option key={key} value={key}>
                  {val.name}
                </option>
              ))}
            </TemplateSelect>
          </PaneHeader>

          <CodeEditorContainer>
            <JsonTextarea
              value={jsonInput}
              onChange={handleJsonChange}
              spellCheck="false"
              placeholder='{\n  "id": "root",\n  "surface": "Card",\n  "data": {\n    "body": "Write JSON here..."\n  }\n}'
            />
          </CodeEditorContainer>

          <PaneFooter>
            <EditorStatus>
              <StatusIndicator $error={!!parseError} />
              <span style={{ color: parseError ? "#f87171" : "var(--text-secondary)" }}>
                {parseError ? "JSON Compile Error" : "Schema Compiled OK"}
              </span>
            </EditorStatus>
            {parseError && <ErrorText>{parseError}</ErrorText>}
          </PaneFooter>
        </EditorPane>

        {/* Right Side: Visual Output and Events Terminal */}
        <VisualizerPane>
          <RenderArea>
            {schema ? (
              <RenderContainer>
                <RenderHeader>
                  <RenderHeaderLabel>
                    <Eye size={12} /> Dynamic Preview
                  </RenderHeaderLabel>
                  <RenderHeaderInfo>
                    Schema Root: <code>{schema.surface}</code>
                  </RenderHeaderInfo>
                </RenderHeader>
                
                <A2UIRenderer schema={schema} onAction={handleUIAction} />
              </RenderContainer>
            ) : (
              <EmptyStateContainer>
                <HelpCircle style={{ color: "var(--text-muted)", width: "48px", height: "48px" }} />
                <h3>Connecting / Loading Layout</h3>
                <EmptyStateText>
                  Establishing WebSocket connection to python agent server and loading layout schema...
                </EmptyStateText>
              </EmptyStateContainer>
            )}
          </RenderArea>

          <ConsolePane>
            <ConsoleHeader>
              <PaneTitle style={{ fontSize: "0.8rem" }}>
                <Terminal size={14} style={{ color: "var(--color-success)" }} />
                Bidirectional Event Logs (A2UI Actions Console)
              </PaneTitle>
              {actionLogs.length > 0 && (
                <ClearLogsButton onClick={clearLogs}>Clear Console</ClearLogsButton>
              )}
            </ConsoleHeader>

            <LogList>
              {actionLogs.length === 0 ? (
                <EmptyLogsText>
                  No interaction events captured. Click buttons, toggle checkboxes, or submit forms in the preview canvas to see events bubble up here.
                </EmptyLogsText>
              ) : (
                actionLogs.map((log, idx) => (
                  <LogEntry key={idx}>
                    <LogMeta>
                      <LogTime>[{formatTime(log.timestamp)}]</LogTime>
                      <LogBadge>ACTION</LogBadge>
                      <LogMsg>
                        {log.surface} (<code>{log.componentId}</code>) emitted <strong>{log.actionType}</strong>
                      </LogMsg>
                    </LogMeta>
                    <LogPayload>
                      Payload: <code>{JSON.stringify(log.payload)}</code>
                    </LogPayload>
                  </LogEntry>
                ))
              )}
            </LogList>
          </ConsolePane>
        </VisualizerPane>

      </Workspace>
    </Container>
  );
}
