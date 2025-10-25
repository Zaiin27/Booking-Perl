import React, { useState } from "react";
import { FileTextIcon, CalendarIcon } from "../../../../assets/icons/icons";
import { useGetTicketsQuery, useClaimTicketMutation } from "../../../../services/admin/adminApi";
import { toastUtils } from "../../../../utils/toastUtils";

const TicketCards = () => {
  const [claimingTickets, setClaimingTickets] = useState(new Set());
  
  // Fetch tickets from admin API
  const { data: ticketsResponse, isLoading, error, refetch } = useGetTicketsQuery({
    page: 1,
    limit: 3
  });

  // Claim ticket mutation
  const [claimTicket, { isLoading: isClaiming }] = useClaimTicketMutation();

  // Handle claim ticket
  const handleClaimTicket = async (ticketId, originalId) => {
    try {
      setClaimingTickets(prev => new Set(prev).add(originalId));
      
      
      const loadingToast = toastUtils.loading(`Claiming ticket ${ticketId}...`);
      
      const response = await claimTicket(originalId).unwrap();
      
      toastUtils.dismiss(loadingToast);
      toastUtils.success(`Ticket claimed successfully!`);
      
      refetch();
      
    } catch (error) {
      toastUtils.error(`Failed to claim ticket ${ticketId}. Please try again.`);
      console.error('Error claiming ticket:', error);
      console.error('Ticket ID that failed:', originalId);
    } finally {
      setClaimingTickets(prev => {
        const newSet = new Set(prev);
        newSet.delete(originalId);
        return newSet;
      });
    }
  };


  // Filter out claimed tickets and map to display format
  const ticketData = ticketsResponse?.data?.tickets
    ?.filter(ticket => !ticket.claimed_by) // Hide tickets that are already claimed
    ?.slice(0, 3)
    ?.map((ticket, index) => {
      return {
        id: ticket.ticket_id || ticket.ticketId || ticket._id || ticket.id, // Use actual ticket ID from API
        originalId: ticket.ticket_id || ticket.ticketId || ticket._id || ticket.id, 
        date: new Date(ticket.createdAt || ticket.created_at).toLocaleDateString(),
        status: ticket.status,
        subject: ticket.subject || ticket.title || 'Support Ticket',
        claimed_by: ticket.claimed_by
      };
    }) || [];

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
        {[1, 2, 3].map((index) => (
          <div
            key={index}
            className="bg-[#171D41] border border-[#3A3A4E] rounded-xl p-3 md:p-6 animate-pulse"
          >
            <div className="space-y-3 md:space-y-6">
              <div className="grid grid-cols-2 items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 md:gap-3 mb-1">
                    <div className="w-8 h-8 md:w-12 md:h-12 bg-[#3A3A4E] rounded"></div>
                    <div className="h-4 bg-[#3A3A4E] rounded w-16"></div>
                  </div>
                  <div className="h-3 bg-[#3A3A4E] rounded w-8 ml-7 md:ml-9"></div>
                </div>
                <div>
                  <div className="flex items-center gap-2 md:gap-3 mb-1">
                    <div className="w-8 h-8 md:w-12 md:h-12 bg-[#3A3A4E] rounded"></div>
                    <div className="h-4 bg-[#3A3A4E] rounded w-20"></div>
                  </div>
                  <div className="h-3 bg-[#3A3A4E] rounded w-12 ml-7 md:ml-9"></div>
                </div>
              </div>
              <div className="h-8 bg-[#3A3A4E] rounded-full"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
        <div className="col-span-full bg-[#171D41] border border-red-500 rounded-xl p-6 text-center">
          <div className="text-red-400">Error loading tickets: {error.message}</div>
        </div>
      </div>
    );
  }

  // Show message if no unclaimed tickets available
  if (ticketData.length === 0) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
        <div className="col-span-full bg-[#171D41] border border-[#3A3A4E] rounded-xl p-6 text-center">
          <div className="text-[#AEB9E1] text-lg">No unclaimed tickets available</div>
          <div className="text-[#AEB9E1] text-sm mt-2">All tickets have been claimed</div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
      {ticketData.map((ticket, index) => (
        <div
          key={index}
          className="bg-[#171D41] border border-[#3A3A4E] rounded-xl p-3 md:p-6 hover:border-[#14F195] transition-colors"
        >
          <div className="space-y-3 md:space-y-6">
            {/* Top Section - ID and Date side by side */}
            <div className="grid grid-cols-2 items-center justify-between">
              {/* ID Section */}
              <div>
                <div className="flex items-center gap-2 md:gap-3 mb-1">
                  <FileTextIcon className="w-8 h-8 md:w-12 md:h-12" />
                  <p className="text-white font-inter font-semibold text-sm md:text-md">
                    {ticket.id}
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
                    {ticket.date}
                  </p>
                </div>
                <p className="text-[#AEB9E1] text-xs font-inter ml-7 md:ml-9">
                  Date
                </p>
              </div>
            </div>


            {/* Claim Request Button */}
            <button 
              onClick={() => handleClaimTicket(ticket.id, ticket.originalId)}
              disabled={claimingTickets.has(ticket.originalId)}
              className={`w-full bg-gradient-to-r from-[#9945FF] to-[#14F195] text-white py-2 md:py-3 rounded-full font-inter font-medium hover:shadow-lg transition-all duration-200 transform hover:scale-[1.02] text-xs disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none`}
            >
              {claimingTickets.has(ticket.originalId) ? 'Claiming...' : 'Claim Request'}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TicketCards;
