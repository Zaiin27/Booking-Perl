import React, { useState, useMemo } from "react";
import { useSelector } from "react-redux";
import { useGetOrderHistoryQuery } from "../../services/Api";

const OrdersHistoryTable = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const { user } = useSelector((state) => state.auth);
  
  const { data: historyData, isLoading, error } = useGetOrderHistoryQuery();

  // Transform API data to match component structure
  const orders = useMemo(() => {
    if (!historyData?.data?.orders) return [];
    
    return historyData.data.orders.map((order) => ({
      id: order.order_id || order.id,
      link: order.link,
      timestamp: order.createdAt ? new Date(order.createdAt).toLocaleString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      }) : order.timestamp,
      amount: `$${(order.amount || 0).toFixed(2)}`,
      payment: order.payment,
      discount: `${order.discount || 0}%`,
      status: order.order_status || "Processing",
    }));
  }, [historyData]);

  // Filter orders based on search term and active filter
  const filteredOrders = useMemo(() => {
    let filtered = orders;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(order => 
        order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.link.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by status
    if (activeFilter !== "all") {
      filtered = filtered.filter(order => {
        const status = order.status.toLowerCase();
        if (activeFilter === "completed") {
          return status === "completed" || status === "placed";
        }
        return status === activeFilter.toLowerCase();
      });
    }

    return filtered;
  }, [orders, searchTerm, activeFilter]);

  // Calculate counts for filter buttons
  const allCount = orders.length;
  const completedCount = orders.filter(order => 
    order.status.toLowerCase() === "completed" || order.status.toLowerCase() === "placed"
  ).length;
  const refundCount = orders.filter(order => 
    order.status.toLowerCase() === "refund"
  ).length;

  const getStatusBadge = (status) => {
    if (status === "COMPLETED" || status === "Completed") {
      return (
        <span className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-medium bg-[#14F1950D] border border-[#14F195] text-[#14F195] font-inter">
          {status}
        </span>
      );
    } else if (status === "PLACED" || status === "Processing") {
      return (
        <span className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-medium bg-[#9945FF0D] border border-[#216AD080] text-[#216AD0] font-inter">
          {status}
        </span>
      );
    } else if (status === "REFUND" || status === "Refund") {
      return (
        <span className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-medium bg-[#FF6B6B0D] border border-[#FF6B6B] text-[#FF6B6B] font-inter">
          {status}
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 font-inter">
        {status}
      </span>
    );
  };

  return (
    <div className="max-w-6xl mx-auto mb-8">
      <div
        className="rounded-3xl p-4 border border-[#FFFFFF3B] w-full"
        style={{
          background: "#FFFFFF33",
          backdropFilter: "blur(1px)",
          boxShadow: "0px 8px 32px rgba(59, 130, 246, 0.2)",
        }}
      >
        <div className="bg-white rounded-xl p-6">
          {/* Header Section */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6 space-y-4 lg:space-y-0">
            <h3 className="text-lg font-bold text-[#111827] font-inter">
              Orders History
            </h3>

            <div className="flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-4">
              {/* Search Bar */}
              <div className="relative">
                <div className="relative">
                  <div
                    className="absolute inset-0 rounded-full"
                    style={{
                      background:
                        "linear-gradient(90deg, #9945FF 0%, #14F195 100%)",
                      padding: "1px",
                    }}
                  ></div>
                  <input
                    type="text"
                    placeholder="Search by order id or link..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="relative w-64 pl-10 pr-4 py-1.5 bg-white rounded-full text-[#374151] placeholder-gray-400 focus:outline-none font-inter transition-colors border-0"
                    style={{
                      background: "white",
                      borderRadius: "30px",
                      margin: "1px",
                    }}
                  />
                </div>
                <svg
                  className="absolute left-3 top-2.5 w-4 h-4"
                  width="14"
                  height="15"
                  viewBox="0 0 14 15"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <mask
                    id="mask0_834_14236"
                    style={{ maskType: "luminance" }}
                    maskUnits="userSpaceOnUse"
                    x="0"
                    y="0"
                    width="14"
                    height="14"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M0.333984 0.333496H13.3185V13.3182H0.333984V0.333496Z"
                      fill="white"
                    />
                  </mask>
                  <g mask="url(#mask0_834_14236)">
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M6.82665 1.3335C3.79798 1.3335 1.33398 3.79683 1.33398 6.8255C1.33398 9.85416 3.79798 12.3182 6.82665 12.3182C9.85465 12.3182 12.3187 9.85416 12.3187 6.8255C12.3187 3.79683 9.85465 1.3335 6.82665 1.3335ZM6.82665 13.3182C3.24665 13.3182 0.333984 10.4055 0.333984 6.8255C0.333984 3.2455 3.24665 0.333496 6.82665 0.333496C10.4067 0.333496 13.3187 3.2455 13.3187 6.8255C13.3187 10.4055 10.4067 13.3182 6.82665 13.3182Z"
                      fill="url(#paint0_linear_834_14236)"
                    />
                  </g>
                  <mask
                    id="mask1_834_14236"
                    style={{ maskType: "luminance" }}
                    maskUnits="userSpaceOnUse"
                    x="10"
                    y="10"
                    width="4"
                    height="5"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M10.4941 10.8047H13.8435V14.1479H10.4941V10.8047Z"
                      fill="white"
                    />
                  </mask>
                  <g mask="url(#mask1_834_14236)">
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M13.3436 14.1479C13.2163 14.1479 13.0883 14.0992 12.9903 14.0019L10.641 11.6592C10.4456 11.4639 10.445 11.1472 10.6403 10.9519C10.835 10.7552 11.1516 10.7565 11.3476 10.9505L13.697 13.2939C13.8923 13.4892 13.893 13.8052 13.6976 14.0005C13.6003 14.0992 13.4716 14.1479 13.3436 14.1479Z"
                      fill="url(#paint0_linear_834_14236)"
                    />
                  </g>
                  <defs>
                    <linearGradient
                      id="paint0_linear_834_14236"
                      x1="0.333984"
                      y1="6.82583"
                      x2="13.3187"
                      y2="6.82583"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop stopColor="#9945FF" />
                      <stop offset="1" stopColor="#14F195" />
                    </linearGradient>
                    <linearGradient
                      id="paint1_linear_834_14236"
                      x1="10.4941"
                      y1="12.4763"
                      x2="13.8438"
                      y2="12.4763"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop stopColor="#9945FF" />
                      <stop offset="1" stopColor="#14F195" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>

              {/* Filter Buttons */}
              <div className="flex space-x-2">
                <button
                  onClick={() => setActiveFilter("all")}
                  className="relative px-4 py-2 rounded-lg text-sm font-medium transition-colors font-inter bg-white text-[#6B7280] hover:bg-gray-50"
                >
                  <div
                    className="absolute inset-0 rounded-lg"
                    style={{
                      background:
                        "linear-gradient(90deg, #9945FF 0%, #14F195 100%)",
                      mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                      maskComposite: "exclude",
                      WebkitMask:
                        "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                      WebkitMaskComposite: "xor",
                      padding: "1px",
                    }}
                  ></div>
                  <span className="relative z-10">All ({String(allCount).padStart(2, "0")})</span>
                </button>
                <button
                  onClick={() => setActiveFilter("completed")}
                  className="relative px-4 py-2 rounded-lg text-sm font-medium transition-colors font-inter bg-white text-[#6B7280] hover:bg-gray-50"
                >
                  <div
                    className="absolute inset-0 rounded-lg"
                    style={{
                      background:
                        "linear-gradient(90deg, #9945FF 0%, #14F195 100%)",
                      mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                      maskComposite: "exclude",
                      WebkitMask:
                        "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                      WebkitMaskComposite: "xor",
                      padding: "1px",
                    }}
                  ></div>
                  <span className="relative z-10">Completed ({String(completedCount).padStart(2, "0")})</span>
                </button>
                <button
                  onClick={() => setActiveFilter("refund")}
                  className="relative px-4 py-2 rounded-lg text-sm font-medium transition-colors font-inter bg-white text-[#6B7280] hover:bg-gray-50"
                >
                  <div
                    className="absolute inset-0 rounded-lg"
                    style={{
                      background:
                        "linear-gradient(90deg, #9945FF 0%, #14F195 100%)",
                      mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                      maskComposite: "exclude",
                      WebkitMask:
                        "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                      WebkitMaskComposite: "xor",
                      padding: "1px",
                    }}
                  ></div>
                  <span className="relative z-10">Refund ({String(refundCount).padStart(2, "0")})</span>
                </button>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            {/* Limit height to ~6 rows and enable vertical scroll */}
            <div className="max-h-[400px] overflow-y-auto">
            <table className="w-full">
              <thead className="sticky top-0 bg-white z-10">
                <tr className="border-b border-gray-200">
                  <th className="text-left py-4 px-4 text-[#374151] font-semibold font-inter text-[14px]">
                    Order ID
                  </th>
                  <th className="text-left py-4 px-4 text-[#374151] font-semibold font-inter text-[14px]">
                    Link
                  </th>
                  <th className="text-left py-4 px-4 text-[#374151] font-semibold font-inter text-[14px]">
                    Timestamp
                  </th>
                  <th className="text-left py-4 px-4 text-[#374151] font-semibold font-inter text-[14px]">
                    Amount
                  </th>
                  <th className="text-left py-4 px-4 text-[#374151] font-semibold font-inter text-[14px]">
                    Payment
                  </th>
                  <th className="text-left py-4 px-4 text-[#374151] font-semibold font-inter text-[14px]">
                    Discount
                  </th>
                  <th className="text-left py-4 px-4 text-[#374151] font-semibold font-inter text-[14px]">
                    Status
                  </th>
                  <th className="text-left py-4 px-4 text-[#374151] font-semibold font-inter text-[14px]"></th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan="8" className="py-8 text-center text-gray-500">
                      Loading orders...
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan="8" className="py-8 text-center text-red-500">
                      {user?.isVerified ? "Error loading orders. Please try again." : "Please verify your account to access this resource"}
                    </td>
                  </tr>
                ) : filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="py-8 text-center text-gray-500">
                      No orders found.
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((order, index) => (
                  <tr
                    key={order.id}
                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    <td className="py-4 px-4 text-[#111827] font-medium font-inter text-[10px] whitespace-nowrap">
                      {order.id}
                    </td>
                    <td className="py-4 px-4 text-[#6B7280] font-medium font-inter text-[10px] whitespace-nowrap">
                      {order.link}
                    </td>
                    <td className="py-4 px-4 text-[#6B7280] font-medium font-inter text-[10px] whitespace-nowrap">
                      {order.timestamp}
                    </td>
                    <td className="py-4 px-4 text-[#9945FF] font-medium font-inter text-[10px] whitespace-nowrap">
                      {order.amount}
                    </td>
                    <td className="py-4 px-4 text-[#6B7280] font-medium font-inter text-[10px] whitespace-nowrap">
                      {order.payment}
                    </td>
                    <td className="py-4 px-4 text-[#6B7280] font-medium font-inter text-[10px] whitespace-nowrap">
                      {order.discount}
                    </td>
                    <td className="py-4 px-4">
                      {getStatusBadge(order.status)}
                    </td>
                  
                  </tr>
                  ))
                )}
              </tbody>
            </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrdersHistoryTable;
