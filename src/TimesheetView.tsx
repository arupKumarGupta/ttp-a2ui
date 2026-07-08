import { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import type { A2UISchema, A2UIActionEvent } from './a2ui/types';
import { A2UIRenderer } from './a2ui/A2UIRenderer';

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const ViewContainer = styled.div`
  min-height: 100vh;
  width: 100vw;
  background: var(--bg-app, #0a0b0e);
  color: var(--text-primary, #f3f4f6);
  padding: 40px 24px;
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  overflow-y: auto;
`;

const ContentWrapper = styled.div`
  width: 100%;
  max-width: 1200px;
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 80vh;
`;

const Spinner = styled.div`
  width: 40px;
  height: 40px;
  border: 3px solid rgba(139, 92, 246, 0.1);
  border-radius: 50%;
  border-top-color: #8b5cf6;
  animation: ${spin} 1s linear infinite;
`;

const LoadingText = styled.p`
  margin-top: 16px;
  color: var(--text-secondary, #9ca3af);
  font-size: 0.9rem;
`;

export default function TimesheetView() {
  const [schema, setSchema] = useState<A2UISchema | null>(null);
  const [socket, setSocket] = useState<WebSocket | null>(null);

  useEffect(() => {
    let ws: WebSocket;
    let reconnectTimeout: number;

    const connect = () => {
      setSchema(null);
      console.log("Connecting to WebSocket: ws://localhost:8000/ws/timesheet");
      ws = new WebSocket("ws://localhost:8000/ws/timesheet");

      ws.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data);
          setSchema(msg as A2UISchema);
        } catch (err) {
          console.error("Error parsing message from agent timesheet server:", err);
        }
      };

      ws.onclose = () => {
        console.log("WebSocket /ws/timesheet closed. Reconnecting...");
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

  const handleUIAction = (event: A2UIActionEvent) => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify(event));
    }
  };

  return (
    <ViewContainer>
      <ContentWrapper>
        {schema ? (
          <A2UIRenderer schema={schema} onAction={handleUIAction} />
        ) : (
          <LoadingContainer>
            <Spinner />
            <LoadingText>Connecting to Agent Timesheet Server...</LoadingText>
          </LoadingContainer>
        )}
      </ContentWrapper>
    </ViewContainer>
  );
}
