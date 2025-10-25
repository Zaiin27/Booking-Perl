import React, { useState, useEffect, useMemo } from "react";
import { Download } from "lucide-react";
import { CSVLink } from "react-csv";
import ReusableFilter from "../../../components/ReusableFilter";
import ReusableTable from "../../../components/ReusableTable";
import ReusablePagination from "../../../components/ReusablePagination";
import OrderDetailsModal from "./features/OrderDetailsModal";
import ConfirmModal from "../../../components/ConfirmModal";
import PageLoading from "../../../components/PageLoading";
import LoadingOverlay from "../../../components/LoadingOverlay";
import { useGetAdminOrdersQuery, useUpdateOrderStatusMutation, useGetAdminUsersQuery } from "../../../services/admin/adminApi";
import { toastUtils } from "../../../utils/toastUtils";

const OrdersPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRow, setSelectedRow] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [modalState, setModalState] = useState({
    isOpen: false,
    mode: "view", 
    order: null,
  });
  const [deleteConfirmState, setDeleteConfirmState] = useState({
    isOpen: false,
    order: null,
  });
  const [filters, setFilters] = useState({
    status: {
      key: "status",
      label: "All Statuses",
      selectedValue: "All Statuses",
      options: [
        { value: "All Statuses", label: "All Statuses" },
        { value: "PENDING", label: "Pending" },
        { value: "PLACED", label: "Placed" },
      ],
    },
    payment: {
      key: "payment",
      label: "All Payment Types",
      selectedValue: "All Payment Types",
      options: [
        { value: "All Payment Types", label: "All Payment Types" },
        { value: "solana", label: "Solana" },
        { value: "card", label: "Card" },
        { value: "usdc", label: "USDC" },
      ],
    },
  });

  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState(searchQuery);
  
  const [debouncedFilters, setDebouncedFilters] = useState(filters);

  const [isFilterLoading, setIsFilterLoading] = useState(false);

  useEffect(() => {
    if (searchQuery !== debouncedSearchQuery && searchQuery !== "") {
      setIsFilterLoading(true);
    }
    
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
      setIsFilterLoading(false);
    }, 2000); 

    return () => clearTimeout(timer);
  }, [searchQuery, debouncedSearchQuery]);

  useEffect(() => {
    if (JSON.stringify(filters) !== JSON.stringify(debouncedFilters) && 
        (filters.status.selectedValue !== "All Statuses" || 
         filters.payment.selectedValue !== "All Payment Types")) {
      setIsFilterLoading(true);
    }

    
    
    const timer = setTimeout(() => {
      setDebouncedFilters(filters);
      setIsFilterLoading(false);
    }, 2000); // 2 seconds delay for filters

    return () => clearTimeout(timer);
  }, [filters, debouncedFilters]);

  const queryParams = useMemo(() => ({
    page: currentPage,
    limit: 20,
    ...(debouncedSearchQuery && { q: debouncedSearchQuery }), 
    ...(debouncedFilters.status.selectedValue !== "All Statuses" && { status: debouncedFilters.status.selectedValue }),
    ...(debouncedFilters.payment.selectedValue !== "All Payment Types" && { payment: debouncedFilters.payment.selectedValue }),
  }), [currentPage, debouncedSearchQuery, debouncedFilters]);

  const {
    data: ordersResponse,
    error,
    isLoading,
    refetch
  } = useGetAdminOrdersQuery(queryParams);

  const [updateOrderStatus, { isLoading: isUpdatingStatus }] = useUpdateOrderStatusMutation();





  const ordersData = Array.isArray(ordersResponse?.data?.orders) 
    ? ordersResponse.data.orders 
    : Array.isArray(ordersResponse?.data) 
      ? ordersResponse.data 
      : Array.isArray(ordersResponse) 
        ? ordersResponse 
        : [];
  const totalItems = ordersResponse?.data?.total || ordersResponse?.total || ordersResponse?.count || 0;
  const totalPages = Math.ceil(totalItems / 20) || 1;

  const transformOrderData = (orders) => {
    return orders.map(order => {
      return {
      id: order.order_id,
      _id: order._id,
      order_id: order.order_id,
      timestamp: order.timestamp ? new Date(order.timestamp).toLocaleString() : "N/A",
      customerEmail: order.customer_email || "N/A",
      customer_email: order.customer_email || "N/A",
      amount: order.amount !== null && order.amount !== undefined && !isNaN(parseFloat(order.amount)) ? parseFloat(order.amount) : 0,
      payment: order.payment || "No", 
      discount: order.discount ? `${order.discount}%` : "0",
      status: order.status || "PENDING",
      assignedStaff: order.assigned_staff ? 
        (typeof order.assigned_staff === 'object' ? 
          (order.assigned_staff.name || "Unassigned") : 
          "Unassigned") : 
        "Unassigned",
      assigned_staff: order.assigned_staff ? 
        (typeof order.assigned_staff === 'object' ? 
          (order.assigned_staff.name || "Unassigned") : 
          "Unassigned") : 
        "Unassigned",
      cart_link: order.cart_link
      };
    });
  };

  const transformedOrdersData = transformOrderData(ordersData);

  const columns = [
    { key: "order_id", label: "Order ID" },
    { key: "timestamp", label: "Timestamp" },
    { key: "customer_email", label: "Customer Email" },
    { key: "amount", label: "Amount" },
    { key: "payment", label: "Payment" },
    { key: "discount", label: "Discount" },
    { key: "status", label: "Status" },
    { key: "assigned_staff", label: "Assigned Staff" },
    { key: "actions", label: "", className: "w-16" },
  ];

  const handleFilterChange = (filterKey, value) => {
    setFilters((prev) => ({
      ...prev,
      [filterKey]: {
        ...prev[filterKey],
        selectedValue: value,
      },
    }));
    setCurrentPage(1);
    
    setIsFilterLoading(true);
  };

  const handleSearchChange = (value) => {
    setSearchQuery(value);
    setCurrentPage(1);
    
    if (value !== debouncedSearchQuery) {
      setIsFilterLoading(true);
    }
  };
  

  const handleStatusUpdate = async (row, newStatus) => {
    const orderId = row._id || row.order_id || row.id;
    const loadingToast = toastUtils.loading(`Updating order ${orderId} status...`);
    
    try {
      await updateOrderStatus({ 
        orderId, 
        status: newStatus 
      }).unwrap();
      
      toastUtils.dismiss(loadingToast);
      
      toastUtils.success(`Order ${orderId} status updated to ${newStatus} successfully!`);
      
      refetch();
    } catch (error) {
      toastUtils.dismiss(loadingToast);
      
      toastUtils.error(`Failed to update order ${orderId} status. Please try again.`);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleRowClick = (row) => {
    setSelectedRow(selectedRow === row.id ? null : row.id);
  };

  const handleViewOrder = (order) => {
    setModalState({
      isOpen: true,
      mode: "view",
      order: order,
    });
  };

  const handleEditOrder = (order) => {
    setModalState({
      isOpen: true,
      mode: "edit",
      order: order,
    });
  };

  const handleDeleteOrder = (order) => {
    setDeleteConfirmState({
      isOpen: true,
      order: order,
    });
  };

  const confirmDeleteOrder = () => {
    if (deleteConfirmState.order) {
      const updatedData = ordersData.filter(
        (o) => o.id !== deleteConfirmState.order.id
      );
    }
    setDeleteConfirmState({
      isOpen: false,
      order: null,
    });
  };

  const handleSaveOrder = (updatedOrder) => {
    setModalState({ isOpen: false, mode: "view", order: null });
  };

  const closeModal = () => {
    setModalState({ isOpen: false, mode: "view", order: null });
    
    setTimeout(() => {
      document.body.style.overflow = "unset";
    }, 150);
  };


  const currentData = transformedOrdersData;
  const itemsPerPage = 20;

  const csvHeaders = [
    { label: "Order ID", key: "order_id" },
    { label: "Timestamp", key: "timestamp" },
    { label: "Customer Email", key: "customer_email" },
    { label: "Amount", key: "amount" },
    { label: "Payment Type", key: "payment" },
    { label: "Discount (%)", key: "discount" },
    { label: "Status", key: "status" },
    { label: "Assigned Staff", key: "assigned_staff" },
  ];

  const csvData = Array.isArray(transformedOrdersData) 
    ? transformedOrdersData.map((order) => ({
    ...order,
        amount: typeof order.amount === 'number' ? `$${order.amount.toFixed(2)}` : `$${order.amount}`,
        discount: `${order.discount || 0}%`,
      }))
    : [];

  const csvFilename = `orders_export_${
    new Date().toISOString().split("T")[0]
  }.csv`;

  if (isLoading && !ordersResponse) {
    return <PageLoading message="Loading orders..." />;
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="flex flex-col bg-[#171D41] rounded-lg p-6">
          <div className="flex items-center justify-center h-64">
            <div className="text-red-400 text-lg">
              Error loading orders: {error?.data?.message || error?.message || 'Unknown error'}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex flex-col bg-[#171D41] rounded-t-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-white">Orders</h1>

          <div className="flex-1 ml-8">
            <ReusableFilter
              filters={Object.values(filters)}
              onFilterChange={handleFilterChange}
              searchPlaceholder="Order ID..."
              onSearchChange={handleSearchChange}
              searchValue={searchQuery}
            />
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-[#171D41] rounded-lg border border-[#EDEDED33] p-4 relative">
          <LoadingOverlay 
            isLoading={isLoading || isFilterLoading}
            message={
              isLoading && !ordersResponse
                ? "Loading orders..." 
                : isFilterLoading 
                  ? (searchQuery !== debouncedSearchQuery ? "Searching..." : "Applying filters...") 
                  : "Loading orders..."
            }
          />
          
          <ReusableTable
            columns={columns}
            data={currentData}
            onRowClick={handleRowClick}
            selectedRow={selectedRow}
            actions={true}
            onView={handleViewOrder}
            onEdit={handleEditOrder}
            onDelete={handleDeleteOrder}
            onStatusChange={handleStatusUpdate}
            tableType="orders"
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

      {/* Hidden CSV Export */}
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

      {/* Order Details Modal */}
      <OrderDetailsModal
        isOpen={modalState.isOpen}
        onClose={closeModal}
        order={modalState.order}
        mode={modalState.mode}
        onSave={handleSaveOrder}
        onDelete={handleDeleteOrder}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteConfirmState.isOpen}
        onClose={() => setDeleteConfirmState({ isOpen: false, order: null })}
        onConfirm={confirmDeleteOrder}
        title="Are you sure?"
        itemName={deleteConfirmState.order?.id || "Order"}
        itemDescription="This order will be permanently deleted from the system"
        itemDate={`Created ${deleteConfirmState.order?.timestamp || "Unknown"}`}
        confirmButtonText="Delete Order"
        type="delete"
      />
    </div>
  );
};

export default OrdersPage;
