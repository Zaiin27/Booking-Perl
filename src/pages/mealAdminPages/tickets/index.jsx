import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";

import { Download } from "lucide-react";
import { IoMdCheckmarkCircleOutline, IoMdTime } from "react-icons/io";
import { MdOutlineChatBubbleOutline } from "react-icons/md";

import { CSVLink } from "react-csv";
import ReusableFilter from "../../../components/ReusableFilter";
import ReusableTable from "../../../components/ReusableTable";
import ReusablePagination from "../../../components/ReusablePagination";
import TicketDetailsModal from "./features/TicketDetailsModal";
import StatCard from "./features/dashboard-card";
import ConfirmModal from "../../../components/ConfirmModal";
import PageLoading from "../../../components/PageLoading";
import LoadingOverlay from "../../../components/LoadingOverlay";
import { TicketsIcon } from "../../../assets/icons/icons";
import { useGetTicketsQuery, useUpdateTicketStatusMutation, useUpdateOrderStatusMutation } from "../../../services/admin/adminApi";
import { toastUtils } from "../../../utils/toastUtils";

const TicketsPage = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRow, setSelectedRow] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isFilterLoading, setIsFilterLoading] = useState(false);
  const [modalState, setModalState] = useState({
    isOpen: false,
    mode: "view", // "view" or "edit"
    ticket: null,
  });
  const [deleteConfirmState, setDeleteConfirmState] = useState({
    isOpen: false,
    ticket: null,
  });
  const [filters, setFilters] = useState({
    status: {
      key: "status",
      label: "All Statuses",
      selectedValue: "All Statuses",
      options: [
        { value: "All Statuses", label: "All Statuses" },
        { value: "OPEN", label: "Open" },
        { value: "RESOLVED", label: "Fulfilled" },
      ],
    },
  });

  // Debounced search query
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState(searchQuery);
  
  // Debounced filters
  const [debouncedFilters, setDebouncedFilters] = useState(filters);
  
  // Optimistic updates state
  const [optimisticUpdates, setOptimisticUpdates] = useState({});

  useEffect(() => {
    // Show loading when search query changes
    if (searchQuery !== debouncedSearchQuery) {
      setIsFilterLoading(true);
    }
    
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
      setIsFilterLoading(false);
    }, 2000); // 2 seconds delay for search

    return () => clearTimeout(timer);
  }, [searchQuery, debouncedSearchQuery]);

  useEffect(() => {
    // Show loading when filters change
    if (JSON.stringify(filters) !== JSON.stringify(debouncedFilters)) {
      setIsFilterLoading(true);
    }
    
    const timer = setTimeout(() => {
      setDebouncedFilters(filters);
      setIsFilterLoading(false);
    }, 2000); // 2 seconds delay for filters

    return () => clearTimeout(timer);
  }, [filters, debouncedFilters]);

  // API query parameters
  const queryParams = useMemo(() => {
    const params = {
      page: currentPage,
      limit: 10,
    };

    // Add search query if provided
    if (debouncedSearchQuery) {
      params.search = debouncedSearchQuery;
    }

    // Add status filter if not "All Statuses"
    if (debouncedFilters.status.selectedValue !== "All Statuses") {
      // Map frontend status to backend status
      let backendStatus = debouncedFilters.status.selectedValue;
      if (debouncedFilters.status.selectedValue === "RESOLVED") {
        backendStatus = "RESOLVED";
      }
      params.status = backendStatus;
    }


    return params;
  }, [currentPage, debouncedSearchQuery, debouncedFilters]);

  // Fetch tickets data from API
  const {
    data: ticketsResponse,
    isLoading,
    isError,
    error,
    refetch
  } = useGetTicketsQuery(queryParams);

  // Ticket status update mutation
  const [updateTicketStatus, { isLoading: isUpdatingStatus }] = useUpdateTicketStatusMutation();
  
  // Order status update mutation
  const [updateOrderStatus, { isLoading: isUpdatingOrderStatus }] = useUpdateOrderStatusMutation();

  // Extract tickets data from API response
  const rawTicketsData = ticketsResponse?.data?.tickets || [];
  const totalTickets = ticketsResponse?.data?.total || 0;
  const totalPages = ticketsResponse?.data?.pages || 1;

  // Transform API data to match UI expectations
  const ticketsData = useMemo(() => {
    return rawTicketsData.map((ticket) => {
      // Map backend status to frontend status for display
      let frontendStatus = ticket.status;
      if (ticket.status === "RESOLVED") {
        frontendStatus = "FULFILLED";
      }
      
      // Apply optimistic update if exists
      const ticketId = ticket.ticket_id;
      console.log("Checking optimistic update for ticket:", ticketId, "current status:", frontendStatus, "optimisticUpdates:", optimisticUpdates);
      if (optimisticUpdates[ticketId]) {
        console.log("✅ Applying optimistic update to ticket:", ticketId, "from", frontendStatus, "to", optimisticUpdates[ticketId].status);
        frontendStatus = optimisticUpdates[ticketId].status;
      } else {
        console.log("❌ No optimistic update found for ticket:", ticketId);
      }
      
      return {
        id: ticket.ticket_id,
        orderId: ticket.order_id,
        subject: ticket.subject || "No Subject", // Add default if not provided
        customerEmail: ticket.user_id?.email || "N/A",
        customerName: ticket.user_id?.name || ticket.user_id?.firstName || "Customer", // Add customer name
        lastUpdated: ticket.updatedAt ? new Date(ticket.updatedAt).toLocaleDateString() : "N/A",
        status: frontendStatus, // Use mapped frontend status for table display
        statusValue: ticket.status, // Keep original backend status for API calls
        assignedStaff: ticket.claimed_by ? 
          (ticket.claimed_by.name || "Admin") : 
          null,
        createdAt: ticket.createdAt,
        userId: ticket.user_id?.id,
        _id: ticket._id
      };
    });
  }, [rawTicketsData, optimisticUpdates]);

  // Table columns configuration
  const columns = [
    { key: "id", label: "Ticket ID" },
    { key: "orderId", label: "Order ID" },
    { key: "customerEmail", label: "Customer Email" },
    { key: "lastUpdated", label: "Last Updated" },
    { key: "status", label: "Status" },
    { key: "assignedStaff", label: "Assigned Staff" },
    { key: "actions", label: "", className: "w-16" },
  ];

  // Handle filter changes
  const handleFilterChange = (filterKey, value) => {
    setFilters((prev) => ({
      ...prev,
      [filterKey]: {
        ...prev[filterKey],
        selectedValue: value,
      },
    }));
    setCurrentPage(1); // Reset to first page when filters change
    
    // Show loading immediately when filter changes
    setIsFilterLoading(true);
  };

  // Handle search changes
  const handleSearchChange = (value) => {
    setSearchQuery(value);
    setCurrentPage(1); // Reset to first page when search changes
    
    // Show loading immediately when user types
    if (value !== debouncedSearchQuery) {
      setIsFilterLoading(true);
    }
  };

  // Handle ticket status update
  const handleTicketStatusUpdate = async (row, newStatus) => {
    const ticketId = row.ticket_id || row.id;
    const orderId = row.orderId || row.order_id;
    console.log("Row data:", row);
    console.log("Extracted ticketId:", ticketId);
    const loadingToast = toastUtils.loading(`Updating ticket ${ticketId} status...`);
    
    // Apply optimistic update immediately
    console.log("Applying optimistic update:", { ticketId, newStatus });
    setOptimisticUpdates(prev => {
      const updated = {
        ...prev,
        [ticketId]: { status: newStatus }
      };
      console.log("Optimistic updates state:", updated);
      return updated;
    });
    
    try {
      // Map frontend status to backend status
      let backendStatus = newStatus;
      if (newStatus === "FULFILLED") {
        backendStatus = "RESOLVED";
      }
      
      // Update ticket status
      await updateTicketStatus({ 
        ticketId, 
        status: backendStatus 
      }).unwrap();
      
      // Dismiss loading toast first
      toastUtils.dismiss(loadingToast);
      
      // If ticket status is FULFILLED (RESOLVED in backend), also update the order status to PLACED
      if (newStatus === "FULFILLED" && orderId) {
        try {
          await updateOrderStatus({
            orderId,
            status: "PLACED"
          }).unwrap();
          
          toastUtils.success(`Ticket status updated to Fulfilled and order status updated to Placed successfully!`);
        } catch (orderError) {
          console.error('Failed to update order status:', orderError);
          toastUtils.success(`Ticket status updated successfully! (Order status update failed)`);
        }
      } else {
        toastUtils.success(`Status updated successfully!`);
      }
      
      // Remove optimistic update after successful update and sync with server
      setOptimisticUpdates(prev => {
        const updated = { ...prev };
        delete updated[ticketId];
        return updated;
      });
      
      // Sync with server data after a short delay
      setTimeout(() => {
        refetch();
      }, 1000);
      
    } catch (error) {
      // Remove optimistic update on error
      setOptimisticUpdates(prev => {
        const updated = { ...prev };
        delete updated[ticketId];
        return updated;
      });
      
      toastUtils.dismiss(loadingToast);
      toastUtils.error(`Failed to update status. Please try again.`);
      console.error('Failed to update ticket status:', error);
    }
  };

  // Handle page changes
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Handle row selection
  const handleRowClick = (row) => {
    setSelectedRow(selectedRow === row.id ? null : row.id);
    
    // Open chat for this ticket when row is clicked
    handleOpenInChat(row);
  };

  // Handle view ticket
  const handleViewTicket = (ticket) => {
    console.log("View ticket clicked:", ticket);
    setModalState({
      isOpen: true,
      mode: "view",
      ticket: ticket,
    });
    console.log("Modal state after view:", {
      isOpen: true,
      mode: "view",
      ticket: ticket,
    });
  };

  // Handle edit ticket
  const handleEditTicket = (ticket) => {
    console.log("Edit ticket clicked:", ticket);
    setModalState({
      isOpen: true,
      mode: "edit",
      ticket: ticket,
    });
    console.log("Modal state after edit:", {
      isOpen: true,
      mode: "edit",
      ticket: ticket,
    });
  };

  // Handle delete ticket
  const handleDeleteTicket = (ticket) => {
    setDeleteConfirmState({
      isOpen: true,
      ticket: ticket,
    });
  };

  // Handle open in chat
  const handleOpenInChat = (ticket) => {
    console.log("Opening ticket in chat:", ticket);
    console.log("Ticket assignedStaff:", ticket.assignedStaff);
    
    // Create chat context with ticket information
    const chatContext = {
      ticketId: ticket.id,
      orderId: ticket.orderId,
      customerEmail: ticket.customerEmail,
      customerName: ticket.customerName,
      subject: ticket.subject,
      status: ticket.status,
      isFromTicket: true,
      // Add claimed ticket details for chat display
      claimedBy: ticket.assignedStaff,
      isClaimed: !!ticket.assignedStaff,
      createdAt: ticket.createdAt,
      lastUpdated: ticket.lastUpdated,
      ticketDetails: {
        id: ticket.id,
        orderId: ticket.orderId,
        customerEmail: ticket.customerEmail,
        customerName: ticket.customerName,
        subject: ticket.subject,
        status: ticket.status,
        assignedStaff: ticket.assignedStaff,
        createdAt: ticket.createdAt,
        lastUpdated: ticket.lastUpdated
      }
    };
    
    console.log("Chat context created:", chatContext);
    
    // Navigate to chat page with ticket context
    navigate('/admin/tickets/chat', { 
      state: { 
        selectedChat: chatContext,
        showChatWindow: true 
      } 
    });
  };

  const confirmDeleteTicket = () => {
    if (deleteConfirmState.ticket) {
      // Here you would typically make an API call to delete the ticket
      console.log("Deleting ticket:", deleteConfirmState.ticket.id);
      // For now, just remove from local state
      const updatedData = ticketsData.filter(
        (t) => t.id !== deleteConfirmState.ticket.id
      );
      // You would need to update your state management here
    }
    setDeleteConfirmState({
      isOpen: false,
      ticket: null,
    });
  };


  // Handle save changes
  const handleSaveTicket = (updatedTicket) => {
    // Here you would typically make an API call to update the ticket
    console.log("Saving ticket:", updatedTicket);
    // For now, just close the modal
    setModalState({ isOpen: false, mode: "view", ticket: null });
  };

  // Close modal
  const closeModal = () => {
    setModalState({ isOpen: false, mode: "view", ticket: null });
  };

  // Calculate statistics from API data
  const stats = useMemo(() => {
    if (!rawTicketsData.length) {
      return {
        total: totalTickets || 0,
        open: 0,
        fulfilled: 0,
        cancelled: 0
      };
    }

    // Count tickets by status from current page data
    const statusCounts = rawTicketsData.reduce((acc, ticket) => {
      const status = ticket.status || 'unknown';
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {});

    return {
      total: totalTickets || 0,
      open: statusCounts.OPEN || 0,
      fulfilled: statusCounts.RESOLVED || 0, // Count RESOLVED as fulfilled
      cancelled: statusCounts.CANCELLED || 0
    };
  }, [rawTicketsData, totalTickets]);

  // Debug logging
  useEffect(() => {
    console.log("Tickets API Query Params:", queryParams);
    console.log("Tickets API Response:", ticketsResponse);
    console.log("Tickets Data:", ticketsData);
    console.log("Stats:", stats);
  }, [queryParams, ticketsResponse, ticketsData, stats]);

  // Monitor modal state changes
  useEffect(() => {
    console.log("=== MODAL STATE CHANGED ===");
    console.log("New modal state:", modalState);
    console.log("Modal should be open:", modalState.isOpen);
    console.log("Modal mode:", modalState.mode);
    console.log("Modal ticket:", modalState.ticket);
  }, [modalState]);

  // Use API data directly (no client-side filtering needed as API handles it)
  const currentData = ticketsData;
  const totalItems = totalTickets;
  const itemsPerPage = 10;

  // CSV Export Configuration
  const csvHeaders = [
    { label: "Ticket ID", key: "id" },
    { label: "Order ID", key: "orderId" },
    { label: "Subject", key: "subject" },
    { label: "Customer Email", key: "customerEmail" },
    { label: "Last Updated", key: "lastUpdated" },
    { label: "Status", key: "status" },
    { label: "Assigned Staff", key: "assignedStaff" },
  ];

  // Format data for CSV export - Export current page data
  const csvData = currentData.map((ticket) => ({
    ...ticket,
  }));

  // CSV filename with current date
  const csvFilename = `tickets_export_${
    new Date().toISOString().split("T")[0]
  }.csv`;

  // Show loading state
  if (isLoading) {
    return <PageLoading message="Loading tickets..." />;
  }

  // Show error state
  if (isError) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-red-500">
            Error loading tickets: {error?.message || "Unknown error"}
          </div>
        </div>
      </div>
    );
  }

  // Show no data state
  if (!isLoading && !isError && ticketsData.length === 0) {
    return (
      <div className="p-6">
        {/* Stat Cards Section - Show even when no data */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <StatCard title="Total Tickets" value={(stats.total || 0).toString()} icon={TicketsIcon} />
          <StatCard
            title="Open Tickets"
            value={(stats.open || 0).toString()}
            icon={MdOutlineChatBubbleOutline}
          />
          <StatCard
            title="Fulfilled"
            value={(stats.fulfilled || 0).toString()}
            icon={IoMdCheckmarkCircleOutline}
          />
        </div>
        
        <div className="flex flex-col bg-[#171D41] rounded-t-lg p-6">
          {/* Header and Filters Section */}
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-white">Tickets</h1>

            {/* Search and Filters Section */}
            <div className="flex-1 ml-8">
              <ReusableFilter
                filters={Object.values(filters)}
                onFilterChange={handleFilterChange}
                searchPlaceholder="Ticket ID, Order ID, Subject..."
                onSearchChange={handleSearchChange}
                searchValue={searchQuery}
              />
            </div>
          </div>

          {/* No Data Message */}
          <div className="bg-[#171D41] rounded-lg border border-[#EDEDED33] p-8">
            <div className="flex flex-col items-center justify-center py-12">
              <div className="text-[#AEB9E1] text-6xl mb-4">📋</div>
              <h3 className="text-white text-lg font-semibold mb-2">No Tickets Found</h3>
              <p className="text-[#AEB9E1] text-sm text-center max-w-md">
                {searchQuery || debouncedFilters.status.selectedValue !== "All Statuses"
                  ? "No tickets match your current search criteria. Try adjusting your filters or search terms."
                  : "There are no tickets available at the moment. New tickets will appear here when created."
                }
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Stat Cards Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <StatCard title="Total Tickets" value={(stats.total || 0).toString()} icon={TicketsIcon} />
        <StatCard
          title="Open Tickets"
          value={(stats.open || 0).toString()}
          icon={MdOutlineChatBubbleOutline}
        />
        <StatCard
          title="Fulfilled"
          value={(stats.fulfilled || 0).toString()}
          icon={IoMdCheckmarkCircleOutline}
        />
      </div>
      <div className="flex flex-col bg-[#171D41] rounded-t-lg p-6">
        {/* Header and Filters Section */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-white">Tickets</h1>

          {/* Search and Filters Section */}
          <div className="flex-1 ml-8">
            <ReusableFilter
              filters={Object.values(filters)}
              onFilterChange={handleFilterChange}
              searchPlaceholder="Ticket ID, Order ID..."
              onSearchChange={handleSearchChange}
              searchValue={searchQuery}
            />
          </div>
        </div>

        {/* Tickets Table */}
        <div className="bg-[#171D41] rounded-lg border border-[#EDEDED33] p-4 relative">
          <LoadingOverlay 
            isLoading={isLoading || isFilterLoading}
            message={
              isFilterLoading 
                ? (searchQuery !== debouncedSearchQuery ? "Searching..." : "Applying filters...") 
                : "Loading tickets..."
            }
          />
          
          <ReusableTable
            columns={columns}
            data={currentData}
            onRowClick={handleRowClick}
            selectedRow={selectedRow}
            actions={true}
            onView={handleViewTicket}
            onEdit={handleEditTicket}
            onDelete={handleDeleteTicket}
            onOpenInChat={handleOpenInChat}
            onStatusChange={handleTicketStatusUpdate}
            tableType="tickets"
          />
        </div>
      </div>

      {/* Pagination */}
      <div className="bg-[#171D41] rounded-b-lg px-3 pb-3">
        <ReusablePagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          totalItems={totalItems}
          itemsPerPage={itemsPerPage}
          showPageInfo={true}
        />
      </div>

      {/* Hidden CSV Export Link */}
      <div className="hidden">
        <CSVLink
          data={csvData}
          headers={csvHeaders}
          filename={csvFilename}
          className="hidden"
          id="csv-export-link"
        >
          Export
        </CSVLink>
      </div>

      {/* Ticket Details Modal */}
      <TicketDetailsModal
        isOpen={modalState.isOpen}
        onClose={closeModal}
        ticket={modalState.ticket}
        mode={modalState.mode}
        onSave={handleSaveTicket}
        onDelete={handleDeleteTicket}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteConfirmState.isOpen}
        onClose={() => setDeleteConfirmState({ isOpen: false, ticket: null })}
        onConfirm={confirmDeleteTicket}
        title="Are you sure?"
        itemName={deleteConfirmState.ticket?.id || "Ticket"}
        itemDescription={
          deleteConfirmState.ticket?.subject ||
          "This ticket will be permanently deleted from the system"
        }
        itemDate={`Created ${
          deleteConfirmState.ticket?.lastUpdated || "Unknown"
        }`}
        confirmButtonText="Delete Ticket"
        type="delete"
      />
    </div>
  );
};

export default TicketsPage;
