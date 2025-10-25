import { io } from 'socket.io-client';
import { BASE_URL } from './ApiEndpoints';

class SocketService {
  constructor() {
    this.socket = null;
    this.isConnected = false;
    this.orderId = null;
    this.userId = null;
  }

  // Initialize socket connection
  connect(userId, orderId) {
    if (this.socket && this.isConnected) {
      console.log('Socket already connected');
      // Still join the staff room to ensure we receive all messages
      this.joinStaffRoom();
      return;
    }

    try {
      this.userId = userId;
      this.orderId = orderId;
      
      // Connect to socket server
      this.socket = io(BASE_URL, {
        transports: ['websocket', 'polling'],
        autoConnect: true,
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
        timeout: 20000,
        query: {
          userId: userId,
          orderId: orderId
        }
      });

      // Connection event handlers
      this.socket.on('connect', () => {
        console.log('Socket connected:', this.socket.id);
        this.isConnected = true;
        this.joinOrderChat();
        this.joinStaffRoom(); // Join staff room for all messages
        
        // Send a test message to verify connection
        setTimeout(() => {
          console.log('Sending test message after connection...');
          this.socket.emit('test', { message: 'Frontend connected successfully' });
        }, 1000);
      });

      this.socket.on('disconnect', (reason) => {
        console.log('Socket disconnected:', reason);
        this.isConnected = false;
      });

      this.socket.on('connect_error', (error) => {
        console.error('Socket connection error:', error);
        this.isConnected = false;
      });

      this.socket.on('reconnect', (attemptNumber) => {
        console.log('Socket reconnected after', attemptNumber, 'attempts');
        this.isConnected = true;
        this.joinOrderChat();
        this.joinStaffRoom();
      });

      this.socket.on('reconnect_error', (error) => {
        console.error('Socket reconnection error:', error);
      });

      this.socket.on('reconnect_failed', () => {
        console.error('Socket reconnection failed');
        this.isConnected = false;
      });

      // Listen for chat.message events directly
      this.socket.on('chat.message', (data) => {
        console.log('Direct chat.message received:', data);
      });

      // Listen for order join confirmation
      this.socket.on('order.joined', (data) => {
        console.log('Order joined successfully:', data);
      });

    } catch (error) {
      console.error('Error initializing socket:', error);
    }
  }

  // Join order chat room
  joinOrderChat() {
    if (this.socket && this.isConnected && this.orderId) {
      console.log('Joining order chat for order:', this.orderId);
      this.socket.emit('order.join', {
        order_id: this.orderId
      });
    }
  }

  // Join staff room to receive all messages
  joinStaffRoom() {
    if (this.socket && this.isConnected) {
      console.log('Joining staff room for all messages');
      this.socket.emit('chat.join', {
        room: 'staff:all',
        userId: this.userId
      });
    }
  }

  // Leave order chat room
  leaveOrderChat() {
    if (this.socket && this.isConnected && this.orderId) {
      console.log('Leaving order chat for order:', this.orderId);
      this.socket.emit('order.leave', {
        order_id: this.orderId
      });
    }
  }

  // Send message to chat
  sendMessage(message) {
    if (this.socket && this.isConnected && this.orderId) {
      const messageData = {
        orderId: this.orderId,
        userId: this.userId,
        message: message,
        timestamp: new Date().toISOString()
      };
      
      console.log('Sending message to server:', messageData);
      console.log('Socket connected:', this.isConnected);
      console.log('Socket ID:', this.socket.id);
      
      // Send message via socket with order ID
      this.socket.emit('chat.message', messageData);
      
      // Also emit a test event to see if socket is working
      this.socket.emit('test', { message: 'Test from frontend' });
    } else {
      console.error('Cannot send message: Socket not connected');
      console.error('Socket status:', {
        socket: !!this.socket,
        isConnected: this.isConnected,
        orderId: this.orderId,
        userId: this.userId
      });
    }
  }

  // Send message via API (HTTP) as backup
  async sendMessageViaAPI(message, orderId, userId) {
    try {
      // Import the API function to avoid duplication
      const { sendChatMessage } = await import('./chatApi');
      return await sendChatMessage(orderId, message, userId);
    } catch (error) {
      console.error('Error sending message via API:', error);
      throw error;
    }
  }


  // Listen for incoming messages
  onMessage(callback) {
    if (this.socket) {
      this.socket.on('chat.message', (data) => {
        console.log('Socket received chat.message:', data);
        callback(data);
      });
    }
  }

  // Listen for ticket-based messages
  onTicketMessage(callback) {
    if (this.socket) {
      this.socket.on('chat.message', (data) => {
        // Handle both orderId and ticket_id based messages
        if (data.ticket_id || data.orderId) {
          callback(data);
        }
      });
    }
  }

  // Listen for user joined notifications
  onUserJoined(callback) {
    if (this.socket) {
      this.socket.on('chat.userJoined', callback);
    }
  }

  // Listen for user left notifications
  onUserLeft(callback) {
    if (this.socket) {
      this.socket.on('chat.userLeft', callback);
    }
  }

  // Listen for order updates
  onOrderUpdate(callback) {
    if (this.socket) {
      this.socket.on('order.update', callback);
    }
  }

  // Listen for support messages
  onSupportMessage(callback) {
    if (this.socket) {
      this.socket.on('chat.supportMessage', callback);
    }
  }

  // Listen for ticket created event
  onTicketCreated(callback) {
    if (this.socket) {
      this.socket.on('ticket.created', callback);
    }
  }

  // Remove all listeners
  removeAllListeners() {
    if (this.socket) {
      this.socket.removeAllListeners();
    }
  }

  // Disconnect socket
  disconnect() {
    if (this.socket) {
      console.log('Disconnecting socket');
      this.leaveOrderChat();
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
      this.orderId = null;
      this.userId = null;
    }
  }

  // Get connection status
  getConnectionStatus() {
    return {
      isConnected: this.isConnected,
      socketId: this.socket?.id || null,
      orderId: this.orderId,
      userId: this.userId
    };
  }

  // Force reconnection
  forceReconnect() {
    console.log('Forcing socket reconnection...');
    this.disconnect();
    setTimeout(() => {
      this.connect(this.userId, this.orderId);
    }, 1000);
  }

  // Ensure connection is active
  ensureConnection() {
    if (!this.socket || !this.isConnected) {
      console.log('Ensuring socket connection...');
      this.connect(this.userId, this.orderId);
    }
  }
}

// Create singleton instance
const socketService = new SocketService();

export default socketService;
