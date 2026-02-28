export interface MCPClientOptions {
  baseUrl: string;          // e.g. "http://localhost:4000"
  wsUrl?: string;           // e.g. "ws://localhost:4000/ws"
  autoConnectWS?: boolean;
}