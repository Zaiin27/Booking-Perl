import React, { useState, useEffect, useRef } from "react";
import { Send, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { getChatMessages, sendChatMessage, markMessagesAsRead } from "../../../../services/chatApi";
import { useClaimTicketMutation } from "../../../../services/admin/adminApi";
import socketService from "../../../../services/socketService";
import LoadingSpinner from "../../../../components/LoadingSpinner";
import { toastUtils } from "../../../../utils/toastUtils";

const ChatWindow = ({ selectedChat, onBackToChats }) => {
  const navigate = useNavigate();
  const [message, setMessage] = useState("");

  const [messages, setMessages] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [unreadMessageIds, setUnreadMessageIds] = useState([]);
  const [isClaiming, setIsClaiming] = useState(false);
  const messagesEndRef = useRef(null);

  // Claim ticket mutation
  const [claimTicket] = useClaimTicketMutation();

  // Scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Handle claim ticket
  const handleClaimTicket = async () => {
    if (!selectedChat?.ticketId) {
      toastUtils.error("Ticket ID not found");
      return;
    }

    setIsClaiming(true);
    try {
      const loadingToast = toastUtils.loading(`Claiming ticket ${selectedChat.ticketId}...`);
      
      await claimTicket(selectedChat.ticketId).unwrap();
      
      toastUtils.dismiss(loadingToast);
      toastUtils.success(`Ticket ${selectedChat.ticketId} claimed successfully!`);
      
      // Update the selected chat to reflect claimed status
      if (selectedChat) {
        selectedChat.claimedBy = "Staff";
        selectedChat.isClaimed = true;
      }
      
    } catch (error) {
      toastUtils.error(`Failed to claim ticket ${selectedChat.ticketId}. Please try again.`);
      console.error('Error claiming ticket:', error);
    } finally {
      setIsClaiming(false);
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initialize chat when a chat is selected
  useEffect(() => {
    if (selectedChat) {
      // Load existing messages for this order (initial load)
      loadChatHistory(selectedChat.order_id || selectedChat.orderId, true);
      
      // Set up message listeners
      setupMessageListeners();
      
      // Check connection status and ensure connection
      const connectionStatus = socketService.getConnectionStatus();
      console.log('Current connection status:', connectionStatus);
      
      if (!connectionStatus.isConnected) {
        console.log('Socket not connected, attempting to connect...');
        socketService.connect('staff', selectedChat.order_id || selectedChat.orderId);
      }
      
      setIsConnected(connectionStatus.isConnected);
      
      // Set up periodic connection check
      const connectionCheckInterval = setInterval(() => {
        const status = socketService.getConnectionStatus();
        console.log('Periodic connection check:', status);
        setIsConnected(status.isConnected);
        
        if (!status.isConnected) {
          console.log('Connection lost, attempting to reconnect...');
          socketService.connect('staff', selectedChat.order_id || selectedChat.orderId);
        }
      }, 5000); // Check every 5 seconds

      // Periodic message refresh to catch any missed messages
      const messageRefreshInterval = setInterval(() => {
        if (selectedChat?.order_id || selectedChat?.orderId) {
          console.log('Refreshing messages for order:', selectedChat.order_id || selectedChat.orderId);
          loadChatHistory(selectedChat.order_id || selectedChat.orderId, false); // Not initial load
        }
      }, 30000); // Refresh every 30 seconds (reduced frequency)
      
      return () => {
        clearInterval(connectionCheckInterval);
        clearInterval(messageRefreshInterval);
      };
    }

    return () => {
  
    };
  }, [selectedChat]);

  const setupMessageListeners = () => {
    console.log('Setting up message listeners for order:', selectedChat?.order_id || selectedChat?.orderId);
    
    socketService.onMessage((messageData) => {
      console.log('New message received in staff chat window:', messageData);
      
      const isForCurrentOrder = 
        messageData.orderId === (selectedChat?.order_id || selectedChat?.orderId) || 
        messageData.ticket_id === (selectedChat?.order_id || selectedChat?.orderId) ||
        messageData.ticket_id === selectedChat?.ticketId;
      
      if (isForCurrentOrder) {
        console.log('Adding message via onMessage listener');
        const newMessage = {
          id: Date.now() + Math.random(),
          sender: messageData.userId === 'staff' ? 'agent' : 'customer',
          message: messageData.message,
          timestamp: formatTime(messageData.timestamp),
          avatar: messageData.userId === 'staff' 
            ? "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face"
            : selectedChat?.avatar,
          originalId: messageData.messageId || messageData._id || messageData.id
        };
        
        setMessages(prev => [...prev, newMessage]);
        
        if (newMessage.sender === 'customer' && newMessage.originalId) {
          console.log('Marking new customer message as read via onMessage:', newMessage.originalId);
          markMessagesAsReadHandler([newMessage.originalId]);
        }
      }
    });

    if (socketService.socket) {
     
      socketService.socket.off('chat.message');
      
      socketService.socket.on('chat.message', (messageData) => {
        console.log('Direct chat.message received in staff chat:', messageData);
        console.log('Current order ID:', selectedChat?.order_id || selectedChat?.orderId);
        
    
        const isForCurrentOrder = 
          messageData.orderId === (selectedChat?.order_id || selectedChat?.orderId) || 
          messageData.ticket_id === (selectedChat?.order_id || selectedChat?.orderId) ||
          messageData.ticket_id === selectedChat?.ticketId ||
          messageData.order_id === (selectedChat?.order_id || selectedChat?.orderId);
        
        console.log('Is message for current order?', isForCurrentOrder);
        
        if (isForCurrentOrder) {
          console.log('Message is for current order, adding to staff chat');
          const newMessage = {
            id: Date.now() + Math.random(),
            sender: messageData.userId === 'staff' ? 'agent' : 'customer', // Messages from backend are from customers
            message: messageData.message,
            timestamp: formatTime(messageData.timestamp || new Date().toISOString()),
            avatar: messageData.userId === 'staff' 
              ? "staff"
              : "user",
            originalId: messageData.messageId || messageData._id || messageData.id
          };
          
          setMessages(prev => [...prev, newMessage]);
          
          
          if (newMessage.sender === 'customer' && newMessage.originalId) {
            console.log('Marking new customer message as read:', newMessage.originalId);
            markMessagesAsReadHandler([newMessage.originalId]);
          }
        } else {
          console.log('Message not for current order:', {
            messageOrderId: messageData.order_id,
            messageTicketId: messageData.ticket_id,
            currentOrderId: selectedChat?.order_id || selectedChat?.orderId
          });
        }
      });
      console.log('Direct chat.message listener set up for staff chat');
    } else {
      console.error('❌ Socket not available for chat.message listener');
    }

    
    socketService.onTicketMessage((messageData) => {
      console.log('Ticket message received in staff chat window:', messageData);
      
      
      const isForCurrentOrder = 
        messageData.orderId === (selectedChat?.order_id || selectedChat?.orderId) || 
        messageData.ticket_id === (selectedChat?.order_id || selectedChat?.orderId) ||
        messageData.ticket_id === selectedChat?.ticketId;
      
      if (isForCurrentOrder) {
        const newMessage = {
          id: Date.now() + Math.random(),
          sender: 'customer',
          message: messageData.message,
          timestamp: formatTime(messageData.timestamp),
          avatar: selectedChat?.avatar,
          originalId: messageData.messageId || messageData._id || messageData.id
        };
        
        setMessages(prev => [...prev, newMessage]);
        
        
        if (newMessage.originalId) {
          console.log('Marking new customer message as read via onTicketMessage:', newMessage.originalId);
          markMessagesAsReadHandler([newMessage.originalId]);
        }
      }
    });

    
    socketService.onSupportMessage((messageData) => {
      console.log('Support message received in staff chat window:', messageData);
      
      const isForCurrentOrder = 
        messageData.orderId === (selectedChat?.order_id || selectedChat?.orderId) || 
        messageData.ticket_id === (selectedChat?.order_id || selectedChat?.orderId) ||
        messageData.ticket_id === selectedChat?.ticketId;
      
      if (isForCurrentOrder) {
        const newMessage = {
          id: Date.now() + Math.random(),
          sender: 'customer',
          message: messageData.message,
          timestamp: formatTime(messageData.timestamp),
          avatar: selectedChat?.avatar,
          originalId: messageData.messageId || messageData._id || messageData.id
        };
        
        setMessages(prev => [...prev, newMessage]);
        
        
        if (newMessage.originalId) {
          console.log('Marking new customer message as read via onSupportMessage:', newMessage.originalId);
          markMessagesAsReadHandler([newMessage.originalId]);
        }
      }
    });

    
    socketService.socket?.on('connect', () => {
      console.log('Socket connected in staff chat window');
      setIsConnected(true);
    });

    socketService.socket?.on('disconnect', () => {
      console.log('Socket disconnected in staff chat window');
      setIsConnected(false);
    });

    socketService.socket?.on('reconnect', () => {
      console.log('Socket reconnected in staff chat window');
      setIsConnected(true);
    });
  };

  
  const markMessagesAsReadHandler = async (messageIds) => {
    if (!messageIds || messageIds.length === 0) return;
    
    try {
      console.log('Marking messages as read:', messageIds);
      await markMessagesAsRead(messageIds);
      console.log('Messages marked as read successfully');
    } catch (error) {
      console.error('Error marking messages as read:', error);
    }
  };

  const loadChatHistory = async (orderId, isInitialLoad = false) => {
    if (!orderId) return;
    
    try {
      if (isInitialLoad) {
        setIsLoading(true);
      }
      console.log('Loading chat history for order:', orderId, isInitialLoad ? '(initial load)' : '(refresh)');
      
      const response = await getChatMessages(orderId);
      
      if (response && response.chats && Array.isArray(response.chats)) {
        const formattedMessages = response.chats.map((msg, index) => ({
          id: msg._id || msg.id || Date.now() + index,
          sender: msg.sender_id?.role === 'admin' || msg.sender_id?.role === 'staff' ? 'agent' : 'customer',
          message: msg.message || msg.content,
          timestamp: formatTime(msg.timestamp || msg.createdAt || msg.created_at),
          avatar: msg.sender_id?.role === 'admin' || msg.sender_id?.role === 'staff'
            ? "staff"
            : "user",
          isRead: msg.isRead || false,
          originalId: msg._id || msg.id
        }));
        
        setMessages(formattedMessages);
        
        // Collect unread message IDs for marking as read
        const unreadIds = formattedMessages
          .filter(msg => !msg.isRead && msg.sender === 'customer')
          .map(msg => msg.originalId)
          .filter(id => id);
        
        setUnreadMessageIds(unreadIds);
        
        // Mark messages as read if this is initial load and there are unread messages
        if (isInitialLoad && unreadIds.length > 0) {
          console.log('Marking unread messages as read on chat open:', unreadIds);
          await markMessagesAsReadHandler(unreadIds);
        }
        
        console.log('Chat history loaded from API:', formattedMessages.length, 'messages');
      } else {
        // No messages found, show empty state
        if (isInitialLoad) {
          setMessages([]);
        }
        console.log('No messages found in API response');
      }
    } catch (error) {
      console.error('Error loading chat history from API:', error);
      // If API fails (ticket not found), show empty state
      // Socket will handle real-time communication
      if (isInitialLoad) {
        setMessages([]);
      }
      console.log('API failed, using socket-only communication');
    } finally {
      if (isInitialLoad) {
        setIsLoading(false);
      }
    }
  };

  // Format timestamp
  const formatTime = (timestamp) => {
    if (!timestamp) return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (message.trim() && selectedChat) {
      const messageText = message.trim();
      const orderId = selectedChat.order_id || selectedChat.orderId;
      
      // Add message to UI immediately for better UX
      const newMessage = {
        id: Date.now() + Math.random(),
        sender: 'agent',
        message: messageText,
        timestamp: formatTime(new Date().toISOString()),
        avatar: "staff"
      };
      
      setMessages(prev => [...prev, newMessage]);
      setMessage("");

      
      try {
        // Send via both API and socket for reliability
        if (socketService.getConnectionStatus().isConnected) {
          console.log('Sending message via socket:', messageText);
          socketService.sendMessage(messageText);
        }
        
        // Also try to send via API (may fail, but that's okay)
        try {
          console.log('Sending message via API:', messageText);
          await sendChatMessage(orderId, messageText, 'staff');
        } catch (apiError) {
          console.log('API send failed (expected for orders), socket will handle it');
        }
        
      } catch (error) {
        console.error('Error sending message:', error);
        // Message is already added to UI, so user sees it immediately
      }
    }
  };

  if (!selectedChat) {
    return (
      <div className="bg-[#171D41] border border-[#3A3A4E] rounded-xl p-6 h-[500px] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-[#14F19533] rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M8 12H8.01M12 12H12.01M16 12H16.01M21 12C21 16.9706 16.9706 21 12 21C10.6829 21 9.43081 20.7663 8.3 20.3459L3 21L3.65408 15.7C3.23369 14.5692 3 13.3171 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                stroke="#14F195"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">
            No Chat Selected
          </h3>
          <p className="text-[#AEB9E1]">
            Select a chat from the list to start the conversation
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#171D41] border border-[#3A3A4E] rounded-xl overflow-hidden h-[80vh] flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-[#3A3A4E]">
        <div className="flex items-center gap-3 mb-2">
          <button
            onClick={() => navigate('/staff/tickets')}
            className="p-2 hover:bg-[#3A3A4E] rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <h3 className="text-2xl font-semibold text-white">
            Chatting With Customer
          </h3>
        </div>

        {/* Customer Profile */}

        <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-[#454A67] flex items-center justify-center">
              <span className="text-white text-sm font-bold">U</span>
            </div>
            {/* Online indicator */}
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-[#14F195] border-2 border-[#171D41] rounded-full"></div>
          </div>
          <div>
            <p className="text-white text-lg font-semibold">{selectedChat.name}</p>
            <p className="text-[#AEB9E1] text-sm">{selectedChat.email}</p>

              <div className="flex items-center gap-2 mt-1">
              
                <span className={`text-xs px-2 py-1 rounded-full ${
                  selectedChat.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                  selectedChat.status === 'placed' ? 'bg-green-500/20 text-green-400' :
                  selectedChat.status === 'cancelled' ? 'bg-red-500/20 text-red-400' :
                  'bg-gray-500/20 text-gray-400'
                }`}>
                  {selectedChat.status?.toUpperCase() || 'UNKNOWN'}
                </span>
                {selectedChat.payment && (
                  <span className="text-xs text-[#AEB9E1] bg-[#3A3A4E] px-2 py-1 rounded-full">
                    {selectedChat.payment.toUpperCase()}
                  </span>
                )}
              </div>
            </div>
          </div>
          
          {/* Connection Status and Claim Button */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-[#14F195]' : 'bg-red-500'}`}></div>
              <span className="text-xs text-[#AEB9E1]">
                {isConnected ? 'Connected' : 'Disconnected'}
              </span>
            </div>
            
          </div>
        </div>
      </div>


      {/* Messages */}
      <div className="flex-1 p-6 overflow-y-auto space-y-4">

        {isLoading ? (
          <div className="flex items-center justify-center h-32">
            <LoadingSpinner message="Loading messages..." size="sm" textSize="sm" />
          </div>
        ) : messages.length === 0 ? (
          <div className="flex items-center justify-center h-32">
            <div className="text-center">
              <div className="text-[#AEB9E1] mb-2">No messages yet</div>
              <div className="text-sm text-[#AEB9E1]">Start a conversation with the customer</div>
            </div>
          </div>
        ) : (
          messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-3 ${
              msg.sender === "agent" ? "justify-end" : "justify-start"
            }`}
          >
            {msg.sender === "customer" && (
              <div className="w-8 h-8 rounded-full bg-[#454A67] flex items-center justify-center flex-shrink-0">
                <span className="text-white text-xs font-bold">U</span>
              </div>
            )}

            <div
              className={`max-w-[70%] ${
                msg.sender === "agent"
                  ? "bg-[#454A67] text-white"
                  : "bg-[#081028] text-white"
              } rounded-lg p-3`}
            >
              <p className="text-sm">{msg.message}</p>
              <p className="text-xs text-[#AEB9E1] mt-1">{msg.timestamp}</p>
            </div>


              {msg.sender === "agent" && (
                <div className="w-8 h-8 rounded-full bg-[#454A67] flex items-center justify-center flex-shrink-0">
                  <img
                    src="/logo.svg"
                    alt="Meal Logo"
                    className="w-6 h-6 object-contain"
                  />
                </div>
              )}
          </div>

          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="p-6 bg-[#081028]">
        <form onSubmit={handleSendMessage} className="flex items-center gap-3">
          <div className="flex-1 relative">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type a message"
              className="w-full bg-[#081028] rounded-lg px-4 py-3 text-white text-xs font-inter font-medium placeholder-white focus:outline-none focus:border-none border-none transition-colors"
              style={{ color: 'white' }}
            />
          </div>

          <button
            type="submit"
            className="bg-gradient-to-r from-[#9945FF] to-[#14F195] text-white px-6 py-3 rounded-lg font-medium text-xs hover:shadow-lg transition-all duration-200 flex items-center gap-2"
          >
            Send now
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatWindow;