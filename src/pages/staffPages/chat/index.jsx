import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Bell, Search } from "lucide-react";
import TicketCards from "../../mealAdminPages/chats/features/TicketCards";
import ActiveChats from "./features/ActiveChats";
import ChatWindow from "./features/ChatWindow";
import { useClaimTicketMutation } from "../../../services/staff/staffApi";
import { toastUtils } from "../../../utils/toastUtils";
import { FileTextIcon, CalendarIcon } from "../../../assets/icons/icons";

const StaffChatManagement = () => {
  const location = useLocation();
  const [selectedChat, setSelectedChat] = useState(null);
  const [showChatWindow, setShowChatWindow] = useState(false);
  const [isClaiming, setIsClaiming] = useState(false);
  const [claimTicket] = useClaimTicketMutation();
  const [clearedUnreadMap, setClearedUnreadMap] = useState({});

  useEffect(() => {
    try {
      const stored = localStorage.getItem('chat.clearedUnreadMap.staff');
      if (stored) {
        setClearedUnreadMap(JSON.parse(stored));
      }
    } catch (_) {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('chat.clearedUnreadMap.staff', JSON.stringify(clearedUnreadMap));
    } catch (_) {}
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
        claimedBy: "Staff"
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
        localStorage.setItem('chat.clearedUnreadMap.staff', JSON.stringify(next));
      } catch (_) {}
    }
    setShowChatWindow(false);
    setSelectedChat(null);
  };

  return (
    <div className="min-h-screen bg-[#060B27] p-6">
      {/* Ticket Cards - Only show when chat window is not open */}
      {!showChatWindow && <TicketCards />}

      {/* Active Chats Section */}
      {!showChatWindow && (
        <div className="mt-8">
          <ActiveChats
            onChatSelect={handleChatSelect}
            selectedChat={selectedChat}
            clearedUnreadMap={clearedUnreadMap}
          />
        </div>
      )}

      {/* Ticket Info Card - Only show when chat window is open and chat is from ticket and ticket is not claimed */}
      {showChatWindow && selectedChat?.isFromTicket && !selectedChat.isClaimed && !selectedChat.claimedBy && (
        <div className="mt-8 mb-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
            <div className="bg-[#171D41] border border-[#3A3A4E] rounded-xl p-3 md:p-6 hover:border-[#14F195] transition-colors">
              <div className="space-y-3 md:space-y-6">
                {/* Top Section - ID and Date side by side */}
                <div className="grid grid-cols-2 items-center justify-between">
                  {/* ID Section */}
                  <div>
                    <div className="flex items-center gap-2 md:gap-3 mb-1">
                      <FileTextIcon className="w-8 h-8 md:w-12 md:h-12" />
                      <p className="text-white font-inter font-semibold text-sm md:text-md">
                        {selectedChat.ticketId}
                      </p>
                    </div>
                    <p className="text-[#AEB9E1] text-xs font-inter ml-7 md:ml-9">
                      ID
                    </p>
                  </div>

                  {/* Date Section */}
                  <div>
                    <div className="flex items-center gap-2 md:gap-3 mb-1">
                      <CalendarIcon className="w-8 h-8 md:w-12 md:h-12" />
                      <p className="text-white font-inter font-semibold text-sm md:text-md">
                        {selectedChat.createdAt ? new Date(selectedChat.createdAt).toLocaleDateString() : new Date().toLocaleDateString()}
                      </p>
                    </div>
                    <p className="text-[#AEB9E1] text-xs font-inter ml-7 md:ml-9">
                      Date
                    </p>
                  </div>
                </div>

                {/* Claim Request Button */}
                {!selectedChat.isClaimed && !selectedChat.claimedBy && (
                  <button 
                    onClick={handleClaimTicket}
                    disabled={isClaiming}
                    className={`w-full bg-gradient-to-r from-[#9945FF] to-[#14F195] text-white py-2 md:py-3 rounded-full font-inter font-medium hover:shadow-lg transition-all duration-200 transform hover:scale-[1.02] text-xs disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none`}
                  >
                    {isClaiming ? 'Claiming...' : 'Claim Request'}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Chat Window Section */}
      {showChatWindow && (
        <div className="mt-8">
          <ChatWindow
            selectedChat={selectedChat}
            onBackToChats={handleBackToChats}
          />
        </div>
      )}
    </div>
  );
};

export default StaffChatManagement;
