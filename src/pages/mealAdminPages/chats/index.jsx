import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Bell, Search } from "lucide-react";
import TicketCards from "./features/TicketCards";
import ActiveChats from "./features/ActiveChats";
import ChatWindow from "./features/ChatWindow";
import { useClaimTicketMutation } from "../../../services/admin/adminApi";
import { toastUtils } from "../../../utils/toastUtils";
import { FileTextIcon, CalendarIcon } from "../../../assets/icons/icons";

const ChatManagement = () => {
  const location = useLocation();
  const [selectedChat, setSelectedChat] = useState(null);
  const [showChatWindow, setShowChatWindow] = useState(false);
  const [isClaiming, setIsClaiming] = useState(false);
  const [claimTicket] = useClaimTicketMutation();
  const [clearedUnreadMap, setClearedUnreadMap] = useState({});

  useEffect(() => {
    try {
      const stored = localStorage.getItem('chat.clearedUnreadMap.admin');
      if (stored) {
        setClearedUnreadMap(JSON.parse(stored));
      }
    } catch (_) { }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('chat.clearedUnreadMap.admin', JSON.stringify(clearedUnreadMap));
    } catch (_) { }
  }, [clearedUnreadMap]);

  // Handle navigation state from tickets page
  useEffect(() => {
    if (location.state?.selectedChat && location.state?.showChatWindow) {
      console.log("Received chat context from tickets:", location.state.selectedChat);
      setSelectedChat(location.state.selectedChat);
      setShowChatWindow(true);

      // Clear the navigation state to prevent re-triggering on refresh
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const handleChatSelect = (chat) => {
    setSelectedChat(chat);
    setShowChatWindow(true);
  };

  const handleClaimTicket = async () => {
    if (!selectedChat?.ticketId) return;

    setIsClaiming(true);
    try {
      const result = await claimTicket(selectedChat.ticketId).unwrap();
      toastUtils.success("Ticket claimed successfully!");

      // Update selectedChat to reflect the claim
      setSelectedChat(prev => ({
        ...prev,
        isClaimed: true,
        claimedBy: "Admin"
      }));
    } catch (error) {
      console.error("Failed to claim ticket:", error);
      toastUtils.error(error?.data?.message || "Failed to claim ticket");
    } finally {
      setIsClaiming(false);
    }
  };

  const handleBackToChats = () => {
    // Ensure UI badges clear immediately for the chat we just viewed
    if (selectedChat?.order_id || selectedChat?.orderId) {
      const id = selectedChat.order_id || selectedChat.orderId;
      setClearedUnreadMap((prev) => ({ ...prev, [id]: true }));
      try {
        const next = { ...clearedUnreadMap, [id]: true };
        localStorage.setItem('chat.clearedUnreadMap.admin', JSON.stringify(next));
      } catch (_) { }
    }
    setShowChatWindow(false);
    setSelectedChat(null);
  };

  return (
    <div className="min-h-screen bg-[#0A1330] p-4 lg:p-6 pb-24 lg:pb-6">
      <div className="max-w-7xl mx-auto">
        {/* Header - Only show if not in mobile chat window view */}
        {(!showChatWindow || window.innerWidth > 768) && (
          <div className="flex flex-col gap-1 mb-8">
            <h1 className="text-2xl sm:text-3xl font-black text-white px-1 mt-2">Communications</h1>
            <p className="text-[#AEB9E1] px-1 text-sm opacity-60">Manage support tickets and active customer chats.</p>
          </div>
        )}

        {/* Ticket Cards - Only show when chat window is not open */}
        {!showChatWindow && <TicketCards />}

        {/* Active Chats Section */}
        {!showChatWindow && (
          <div className="mt-8">
            <div className="bg-[#121B36] rounded-[32px] border border-[#FFFFFF0D] shadow-2xl overflow-hidden">
              <div className="p-6 border-b border-[#FFFFFF05] flex items-center justify-between">
                <h2 className="text-lg font-black text-white px-1">Active Conversations</h2>
                <div className="w-8 h-8 rounded-xl bg-[#14F19520] flex items-center justify-center">
                  <Bell size={14} className="text-[#14F195]" />
                </div>
              </div>
              <div className="p-0">
                <ActiveChats
                  onChatSelect={handleChatSelect}
                  selectedChat={selectedChat}
                  clearedUnreadMap={clearedUnreadMap}
                />
              </div>
            </div>
          </div>
        )}

        {/* Claim Ticket Section - Desktop/Tablet view when chat selected but not claimed */}
        {showChatWindow && selectedChat?.isFromTicket && !selectedChat.isClaimed && !selectedChat.claimedBy && (
          <div className="mb-6">
            <div className="bg-gradient-to-r from-[#9945FF20] to-[#14F19520] border border-[#FFFFFF0D] rounded-3xl p-6 shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[#9945FF] to-[#14F195] opacity-5 blur-3xl -z-10"></div>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-[#121B36] border border-[#FFFFFF0D] flex items-center justify-center shadow-inner">
                    <FileTextIcon className="w-7 h-7" />
                  </div>
                  <div>
                    <p className="text-[#AEB9E1]/40 text-[10px] font-bold uppercase tracking-widest leading-none mb-1">Unclaimed Request</p>
                    <h4 className="text-white font-black text-lg tracking-tight">#{selectedChat.ticketId}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <CalendarIcon className="w-3 h-3 text-[#AEB9E1]/60" />
                      <span className="text-[#AEB9E1]/60 text-[10px] font-bold">{selectedChat.createdAt ? new Date(selectedChat.createdAt).toLocaleDateString() : 'Today'}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleClaimTicket}
                  disabled={isClaiming}
                  className="bg-gradient-to-r from-[#9945FF] to-[#14F195] text-white px-8 py-4 rounded-2xl font-black text-sm tracking-tight shadow-xl shadow-[#14F19522] hover:opacity-90 transition-all active:scale-95 disabled:opacity-50"
                >
                  {isClaiming ? 'PROCESSING...' : 'CLAIM TICKET'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Chat Window Section */}
        {showChatWindow && (
          <div className={selectedChat?.isFromTicket && !selectedChat.isClaimed ? "mt-2" : "mt-0 md:mt-8"}>
            <ChatWindow
              selectedChat={selectedChat}
              onBackToChats={handleBackToChats}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatManagement;
