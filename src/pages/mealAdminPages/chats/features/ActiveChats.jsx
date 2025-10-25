import React, { useState, useEffect } from "react";
import { MdOutlineAccessTime } from "react-icons/md";
import { MdPersonOutline } from "react-icons/md";
import { BsBoxSeam } from "react-icons/bs";
import { TicketsIcon } from "../../../../assets/icons/icons";
import { useGetAdminOrdersQuery, useGetTicketsQuery } from "../../../../services/admin/adminApi";
import socketService from "../../../../services/socketService";
import LoadingSpinner from "../../../../components/LoadingSpinner";

const ActiveChats = ({ onChatSelect, selectedChat, clearedUnreadMap = {} }) => {
  const [unreadCounts, setUnreadCounts] = useState({});
  const [activeChats, setActiveChats] = useState([]);
  const [forceUpdate, setForceUpdate] = useState(0);

  const { data: ordersResponse, isLoading, error } = useGetAdminOrdersQuery({
    page: 1,
    limit: 20
  });

  const { data: ticketsResponse } = useGetTicketsQuery({
    page: 1,
    limit: 100
  });

  useEffect(() => {
    if (ordersResponse?.data?.orders) {
      console.log('Processing orders, unreadCounts:', unreadCounts);
      
      const ticketMap = {};
      const claimedTickets = new Set();
      if (ticketsResponse?.data?.tickets) {
        ticketsResponse.data.tickets.forEach(ticket => {
          ticketMap[ticket.order_id] = ticket.ticket_id;
          if (ticket.claimed_by) {
            claimedTickets.add(ticket.order_id);
          }
        });
      }
      
      const processedChats = ordersResponse.data.orders
        .filter(order => !claimedTickets.has(order.order_id)) // Filter out claimed tickets
        .map((order, index) => {
        const socketUnreadCount = unreadCounts[order.order_id] || 0;
        const apiUnreadCount = clearedUnreadMap[order.order_id] ? 0 : (order.unread_messages || 0);
        const totalUnreadCount = clearedUnreadMap[order.order_id] ? socketUnreadCount : (apiUnreadCount + socketUnreadCount);
        
        console.log(`Order ${order.order_id} - API unread: ${apiUnreadCount}, Socket unread: ${socketUnreadCount}, Total: ${totalUnreadCount}`);
        
        return {
          id: order.order_id || index + 1,
          name: order.customer_name || '',
          email: order.customer_email || `customer${index + 1}@example.com`,
          subject: `Order #${order.order_id}`,
          amount: order.total_amount ? `$${order.total_amount.toFixed(2)}` : 
                  order.total ? `$${order.total.toFixed(2)}` : 
                  order.price ? `$${order.price.toFixed(2)}` :
                  order.amount ? `$${order.amount.toFixed(2)}` : '$0.00',
          timeAgo: formatTimeAgo(order.timestamp),
          ticketId: ticketMap[order.order_id] || `TKT-${order.order_id.slice(-6)}`, 
          orderId: order.order_id,
          order_id: order.order_id, 
          unreadCount: totalUnreadCount,
          avatar: "user",
          status: order.status?.toLowerCase(),
          createdAt: order.timestamp,
          cart_link: order.cart_link,
          payment: order.payment,
          assigned_staff: order.assigned_staff
        };
      });
      console.log('Processed chats with unread counts:', processedChats.map(chat => ({ orderId: chat.orderId, unreadCount: chat.unreadCount })));
      setActiveChats(processedChats);
    }
  }, [ordersResponse, ticketsResponse, unreadCounts, clearedUnreadMap]);

  useEffect(() => {
    const connectionStatus = socketService.getConnectionStatus();
    console.log('🔌 Socket connection status:', connectionStatus);
    
    if (!connectionStatus.isConnected) {
      console.log('🔌 Connecting to socket...');
      socketService.connect('admin', 'all-orders');
    } else {
      console.log('🔌 Socket already connected');
    }

    const socket = socketService.socket;
 
    
    const handleMessage = (messageData, source = 'unknown') => {
      console.log(`Message received from ${source}:`, messageData);
      console.log(`Message data keys:`, Object.keys(messageData));
      
      const isFromCustomer = messageData.userId !== 'admin' && messageData.sender !== 'agent' && messageData.sender !== 'admin';
      console.log(`Is message from customer?`, isFromCustomer, `userId:`, messageData.userId, `sender:`, messageData.sender);
      
      if (!isFromCustomer) {
        console.log(`Skipping message from admin/agent`);
        return;
      }
      
      const orderId = messageData.orderId || messageData.ticket_id || messageData.order_id || messageData.orderID || messageData.order?.order_id;
      console.log(`OrderId from ${source}:`, orderId);
      
      if (orderId) {
        setUnreadCounts(prev => {
          const newCount = (prev[orderId] || 0) + 1;
          console.log(`New unread count for ${orderId} from ${source}:`, newCount);
          console.log('Previous unreadCounts:', prev);
          setForceUpdate(prev => prev + 1);
          return {
            ...prev,
            [orderId]: newCount
          };
        });
      } else {
        console.log(`No orderId found in ${source} message data:`, messageData);
      }
    };

    if (socket) {
      console.log('🔌 Setting up socket listeners...');
      
      socket.on('chat.message', (data) => {
        console.log('🔥🔥🔥 PRIMARY chat.message received in ActiveChats:', data);
        handleMessage(data, 'chat.message');
      });
      
      socket.on('message', (data) => handleMessage(data, 'message'));
      socket.on('newMessage', (data) => handleMessage(data, 'newMessage'));
      socket.on('chat.newMessage', (data) => handleMessage(data, 'chat.newMessage'));
      socket.on('support.message', (data) => handleMessage(data, 'support.message'));
      socket.on('ticket.message', (data) => handleMessage(data, 'ticket.message'));
      socket.on('order.message', (data) => handleMessage(data, 'order.message'));
      socket.on('admin.message', (data) => handleMessage(data, 'admin.message'));
      
      socket.onAny((eventName, data) => {
        console.log(`🔌 ANY socket event received: ${eventName}`, data);
        if (eventName.includes('message') || eventName.includes('chat') || eventName.includes('support')) {
          console.log(`🔥🔥🔥 Caught ANY event: ${eventName}`, data);
          handleMessage(data, eventName);
        }
      });
      
      socket.on('connect', () => {
        console.log('🔌 Socket connected in ActiveChats');
      });
      
      socket.on('disconnect', () => {
        console.log('🔌 Socket disconnected in ActiveChats');
      });
      
      console.log('🔌 All socket listeners set up');
    } else {
      console.log('❌ No socket instance available');
    }

    socketService.onMessage((messageData) => handleMessage(messageData, 'socketService.onMessage'));
    socketService.onTicketMessage((messageData) => handleMessage(messageData, 'socketService.onTicketMessage'));
    socketService.onSupportMessage((messageData) => handleMessage(messageData, 'socketService.onSupportMessage'));

    return () => {
      if (socket) {
        socket.off('chat.message');
        socket.off('message');
        socket.off('newMessage');
        socket.off('chat.newMessage');
        socket.off('support.message');
        socket.off('ticket.message');
        socket.off('order.message');
        socket.off('admin.message');
        socket.offAny();
      }
      socketService.removeAllListeners();
    };
  }, []);

  const formatTimeAgo = (timestamp) => {
    if (!timestamp) return 'Unknown time';
    
    const now = new Date();
    const time = new Date(timestamp);
    const diffInSeconds = Math.floor((now - time) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    return `${Math.floor(diffInSeconds / 604800)}w ago`;
  };

  const handleChatClick = (chat) => {
    if (chat.orderId) {
      setUnreadCounts(prev => ({
        ...prev,
        [chat.orderId]: 0
      }));
    }
    onChatSelect(chat);
  };

  if (isLoading) {
    return (
      <div className="bg-[#171D41] border border-[#3A3A4E] rounded-xl p-6 flex flex-col">
        <h3 className="text-2xl font-semibold text-white mb-6">Active Chats</h3>
        <div className="flex items-center justify-center h-32">
          <LoadingSpinner message="Loading active chats..." size="sm" textSize="sm" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-[#171D41] border border-[#3A3A4E] rounded-xl p-6 flex flex-col">
        <h3 className="text-2xl font-semibold text-white mb-6">Active Chats</h3>
        <div className="flex items-center justify-center h-32">
          <div className="text-red-400">Error loading orders: {error.message}</div>
        </div>
      </div>
    );
  }


  return (
    <div className="bg-[#171D41] border border-[#3A3A4E] rounded-xl p-6 flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-semibold text-white">Active Chats</h3>
      </div>

      <div className="space-y-3 overflow-y-auto flex-1 pr-2 scrollbar-thin scrollbar-thumb-[#3A3A4E] scrollbar-track-transparent">
        {activeChats.map((chat, index) => (
          <div
            key={chat.id}
            onClick={() => handleChatClick(chat)}
            className={`p-4 rounded-lg cursor-pointer transition-all duration-200 border border-[#3A3A4E] ${
              selectedChat?.id === chat.id
                ? "bg-[#14F19520] border-[#14F195]"
                : "bg-[#171D41] hover:bg-[#081028]"
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-start gap-3">
              <div className="flex items-start gap-3 flex-1">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-[#454A67] flex items-center justify-center">
                    <span className="text-white text-sm font-bold">U</span>
                  </div>
                  {chat.unreadCount > 0 && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-[#14F195] rounded-full flex items-center justify-center shadow-lg border-2 border-[#171D41]">
                      <span className="text-white text-xs font-bold">
                        {chat.unreadCount > 99 ? '99+' : chat.unreadCount}
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-white text-lg font-inter font-semibold">
                      {chat.name}
                    </h4>
                  </div>
                  <div className="mb-1">
                    <span className="text-[#AEB9E1] font-inter text-sm">
                      {chat.email}
                    </span>
                  </div>

               
                  
                  <div className="mb-2">
                    <span className={`text-xs px-2 py-1 rounded-full text-white ${
                      chat.status === 'pending' ? 'bg-yellow-500 ' :
                      chat.status === 'placed' ? 'bg-green-600' :
                      chat.status === 'cancelled' ? 'bg-red-500' :
                      'bg-gray-500/20 text-gray-400'
                    }`}>
                      {chat.status?.toUpperCase() || 'UNKNOWN'}
                    </span>
                    {chat.payment && (
                      <span className="text-xs text-[#AEB9E1] bg-[#3A3A4E] px-2 py-1 rounded-full ml-2">
                        {chat.payment.toUpperCase()}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="hidden sm:block text-right justify-between">
                <div className="flex items-center gap-2 text-[10px] text-[#EDEDEDB2] font-inter mb-2">
                  <span className="flex items-center justify-center gap-2 font-inter">
                    <MdOutlineAccessTime size={16} /> {chat.timeAgo}
                  </span>
                  <span className="flex items-center justify-center gap-2 font-inter">
                    <svg
                      width="16"
                      height="12"
                      viewBox="0 0 18 14"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-4 h-3"
                    >
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M0.856668 1.87671C0.666668 2.33587 0.666668 2.91837 0.666668 4.08337V4.70837C0.666668 5.05337 0.946668 5.33337 1.29167 5.33337H1.5C1.94203 5.33337 2.36595 5.50897 2.67851 5.82153C2.99107 6.13409 3.16667 6.55801 3.16667 7.00004C3.16667 7.44207 2.99107 7.86599 2.67851 8.17855C2.36595 8.49111 1.94203 8.66671 1.5 8.66671H1.29167C1.12591 8.66671 0.966936 8.73256 0.849726 8.84977C0.732516 8.96698 0.666668 9.12595 0.666668 9.29171V9.91671C0.666668 11.0817 0.666668 11.6642 0.856668 12.1234C0.982307 12.4268 1.16649 12.7025 1.3987 12.9347C1.63091 13.1669 1.90659 13.3511 2.21 13.4767C2.66917 13.6667 3.25167 13.6667 4.41667 13.6667H13.5833C14.7483 13.6667 15.3308 13.6667 15.79 13.4767C16.0934 13.3511 16.3691 13.1669 16.6013 12.9347C16.8335 12.7025 17.0177 12.4268 17.1433 12.1234C17.3333 11.6642 17.3333 11.0817 17.3333 9.91671V9.29171C17.3333 9.12595 17.2675 8.96698 17.1503 8.84977C17.0331 8.73256 16.8741 8.66671 16.7083 8.66671H16.5C16.058 8.66671 15.6341 8.49111 15.3215 8.17855C15.0089 7.86599 14.8333 7.44207 14.8333 7.00004C14.8333 6.55801 15.0089 6.13409 15.3215 5.82153C15.6341 5.50897 16.058 5.33337 16.5 5.33337H16.7083C16.8741 5.33337 17.0331 5.26753 17.1503 5.15032C17.2675 5.0331 17.3333 4.87413 17.3333 4.70837V4.08337C17.3333 2.91837 17.3333 2.33587 17.1433 1.87671C17.0177 1.5733 16.8335 1.29762 16.6013 1.06541C16.3691 0.833198 16.0934 0.649013 15.79 0.523374C15.3308 0.333374 14.7483 0.333374 13.5833 0.333374H4.41667C3.25167 0.333374 2.66917 0.333374 2.21 0.523374C1.90659 0.649013 1.63091 0.833198 1.3987 1.06541C1.16649 1.29762 0.982307 1.5733 0.856668 1.87671ZM8.63083 5.90671C8.55083 6.11337 8.51083 6.21671 8.43667 6.28671C8.41603 6.30648 8.39341 6.32407 8.36917 6.33921C8.2825 6.39254 8.175 6.40254 7.96 6.42254C7.59583 6.45587 7.41417 6.47337 7.35833 6.58087C7.34698 6.60345 7.33911 6.62761 7.335 6.65254C7.31667 6.77337 7.45 6.90004 7.71833 7.15254L7.7925 7.22254C7.9175 7.34087 7.98 7.40004 8.01667 7.47337C8.03778 7.51823 8.0521 7.56597 8.05917 7.61504C8.07083 7.69671 8.0525 7.78171 8.01583 7.95337L8.0025 8.01504C7.93667 8.32254 7.90417 8.47587 7.945 8.55171C7.96251 8.58479 7.9883 8.61278 8.01985 8.63293C8.05139 8.65308 8.08762 8.66472 8.125 8.66671C8.20833 8.67087 8.32583 8.57171 8.56167 8.37254C8.71583 8.24087 8.79333 8.17587 8.88 8.15004C8.95827 8.1265 9.04173 8.1265 9.12 8.15004C9.20667 8.17504 9.28417 8.24171 9.43917 8.37254C9.67417 8.57171 9.79167 8.67087 9.875 8.66671C9.91238 8.66472 9.94861 8.65308 9.98016 8.63293C10.0117 8.61278 10.0375 8.58479 10.055 8.55171C10.0958 8.47671 10.0633 8.32254 9.99667 8.01504L9.98417 7.95337C9.9475 7.78254 9.92917 7.69671 9.94083 7.61504C9.9479 7.56597 9.96222 7.51823 9.98333 7.47337C10.02 7.40004 10.0825 7.34004 10.2075 7.22337L10.2825 7.15254C10.5492 6.90004 10.6833 6.77337 10.665 6.65254C10.6609 6.62761 10.653 6.60345 10.6417 6.58087C10.5858 6.47337 10.4042 6.45587 10.04 6.42254C9.825 6.40254 9.7175 6.39254 9.63167 6.33921C9.60714 6.32412 9.58424 6.30652 9.56333 6.28671C9.48833 6.21671 9.44917 6.11337 9.36917 5.90671C9.22917 5.54504 9.15917 5.36337 9.04583 5.33837C9.01554 5.33272 8.98446 5.33272 8.95417 5.33837C8.84083 5.36337 8.77083 5.54504 8.63083 5.90671Z"
                        fill="transparent"
                        stroke="white"
                        strokeWidth="1"
                      />
                    </svg>{" "}
                    {chat.ticketId}
                  </span>
                  <span className="flex items-center justify-center gap-2 font-inter">
                    <MdPersonOutline size={16} /> {chat.name}
                  </span>
                  <span className="flex items-center justify-center gap-2 font-inter">
                    <BsBoxSeam size={16} /> {chat.orderId}
                  </span>
                </div>

                <p className="text-white font-medium text-sm font-inter mt-12">
                  {chat.amount}
                </p>
              </div>

              <div className="sm:hidden">
                <div className="flex items-center gap-2 text-[10px] text-[#EDEDEDB2] font-inter mb-2">
                  <div className="flex items-center gap-1">
                    <MdOutlineAccessTime size={12} />
                    <span>{chat.timeAgo}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <svg
                      width="12"
                      height="9"
                      viewBox="0 0 18 14"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-3 h-2"
                    >
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M0.856668 1.87671C0.666668 2.33587 0.666668 2.91837 0.666668 4.08337V4.70837C0.666668 5.05337 0.946668 5.33337 1.29167 5.33337H1.5C1.94203 5.33337 2.36595 5.50897 2.67851 5.82153C2.99107 6.13409 3.16667 6.55801 3.16667 7.00004C3.16667 7.44207 2.99107 7.86599 2.67851 8.17855C2.36595 8.49111 1.94203 8.66671 1.5 8.66671H1.29167C1.12591 8.66671 0.966936 8.73256 0.849726 8.84977C0.732516 8.96698 0.666668 9.12595 0.666668 9.29171V9.91671C0.666668 11.0817 0.666668 11.6642 0.856668 12.1234C0.982307 12.4268 1.16649 12.7025 1.3987 12.9347C1.63091 13.1669 1.90659 13.3511 2.21 13.4767C2.66917 13.6667 3.25167 13.6667 4.41667 13.6667H13.5833C14.7483 13.6667 15.3308 13.6667 15.79 13.4767C16.0934 13.3511 16.3691 13.1669 16.6013 12.9347C16.8335 12.7025 17.0177 12.4268 17.1433 12.1234C17.3333 11.6642 17.3333 11.0817 17.3333 9.91671V9.29171C17.3333 9.12595 17.2675 8.96698 17.1503 8.84977C17.0331 8.73256 16.8741 8.66671 16.7083 8.66671H16.5C16.058 8.66671 15.6341 8.49111 15.3215 8.17855C15.0089 7.86599 14.8333 7.44207 14.8333 7.00004C14.8333 6.55801 15.0089 6.13409 15.3215 5.82153C15.6341 5.50897 16.058 5.33337 16.5 5.33337H16.7083C16.8741 5.33337 17.0331 5.26753 17.1503 5.15032C17.2675 5.0331 17.3333 4.87413 17.3333 4.70837V4.08337C17.3333 2.91837 17.3333 2.33587 17.1433 1.87671C17.0177 1.5733 16.8335 1.29762 16.6013 1.06541C16.3691 0.833198 16.0934 0.649013 15.79 0.523374C15.3308 0.333374 14.7483 0.333374 13.5833 0.333374H4.41667C3.25167 0.333374 2.66917 0.333374 2.21 0.523374C1.90659 0.649013 1.63091 0.833198 1.3987 1.06541C1.16649 1.29762 0.982307 1.5733 0.856668 1.87671ZM8.63083 5.90671C8.55083 6.11337 8.51083 6.21671 8.43667 6.28671C8.41603 6.30648 8.39341 6.32407 8.36917 6.33921C8.2825 6.39254 8.175 6.40254 7.96 6.42254C7.59583 6.45587 7.41417 6.47337 7.35833 6.58087C7.34698 6.60345 7.33911 6.62761 7.335 6.65254C7.31667 6.77337 7.45 6.90004 7.71833 7.15254L7.7925 7.22254C7.9175 7.34087 7.98 7.40004 8.01667 7.47337C8.03778 7.51823 8.0521 7.56597 8.05917 7.61504C8.07083 7.69671 8.0525 7.78171 8.01583 7.95337L8.0025 8.01504C7.93667 8.32254 7.90417 8.47587 7.945 8.55171C7.96251 8.58479 7.9883 8.61278 8.01985 8.63293C8.05139 8.65308 8.08762 8.66472 8.125 8.66671C8.20833 8.67087 8.32583 8.57171 8.56167 8.37254C8.71583 8.24087 8.79333 8.17587 8.88 8.15004C8.95827 8.1265 9.04173 8.1265 9.12 8.15004C9.20667 8.17504 9.28417 8.24171 9.43917 8.37254C9.67417 8.57171 9.79167 8.67087 9.875 8.66671C9.91238 8.66472 9.94861 8.65308 9.98016 8.63293C10.0117 8.61278 10.0375 8.58479 10.055 8.55171C10.0958 8.47671 10.0633 8.32254 9.99667 8.01504L9.98417 7.95337C9.9475 7.78254 9.92917 7.69671 9.94083 7.61504C9.9479 7.56597 9.96222 7.51823 9.98333 7.47337C10.02 7.40004 10.0825 7.34004 10.2075 7.22337L10.2825 7.15254C10.5492 6.90004 10.6833 6.77337 10.665 6.65254C10.6609 6.62761 10.653 6.60345 10.6417 6.58087C10.5858 6.47337 10.4042 6.45587 10.04 6.42254C9.825 6.40254 9.7175 6.39254 9.63167 6.33921C9.60714 6.32412 9.58424 6.30652 9.56333 6.28671C9.48833 6.21671 9.44917 6.11337 9.36917 5.90671C9.22917 5.54504 9.15917 5.36337 9.04583 5.33837C9.01554 5.33272 8.98446 5.33272 8.95417 5.33837C8.84083 5.36337 8.77083 5.54504 8.63083 5.90671Z"
                        fill="transparent"
                        stroke="white"
                        strokeWidth="1"
                      />
                    </svg>
                    <span>{chat.ticketId}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MdPersonOutline size={12} />
                    <span>{chat.name}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <BsBoxSeam size={12} />
                    <span>{chat.orderId}</span>
                  </div>
                </div>

                <div className="flex justify-end">
                  <p className="text-white font-medium text-sm font-inter">
                    {chat.amount}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActiveChats;
