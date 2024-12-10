import { io, Socket } from 'socket.io-client';

class WebSocketClient {
  private socket: Socket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;

  connect(url: string) {
    this.socket = io(url, {
      reconnection: true,
      reconnectionAttempts: this.maxReconnectAttempts,
      reconnectionDelay: this.reconnectDelay,
    });

    this.socket.on('connect', () => {
      console.log('WebSocket connected');
      this.reconnectAttempts = 0;
    });

    this.socket.on('connect_error', (error) => {
      console.error('WebSocket connection error:', error);
      this.reconnectAttempts++;
    });

    this.socket.on('disconnect', (reason) => {
      console.log('WebSocket disconnected:', reason);
    });

    return this.socket;
  }

  subscribe(event: string, callback: (data: any) => void) {
    if (!this.socket) {
      throw new Error('WebSocket not connected');
    }
    this.socket.on(event, callback);
  }

  unsubscribe(event: string, callback: (data: any) => void) {
    if (!this.socket) {
      throw new Error('WebSocket not connected');
    }
    this.socket.off(event, callback);
  }

  emit(event: string, data: any) {
    if (!this.socket) {
      throw new Error('WebSocket not connected');
    }
    this.socket.emit(event, data);
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }
}

export const wsClient = new WebSocketClient();