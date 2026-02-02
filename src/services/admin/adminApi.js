import { API_END_POINTS } from "../ApiEndpoints";
import { SplitApiSettings } from "../SplitApiSetting";

export const adminApi = SplitApiSettings.injectEndpoints({
  reducerPath: "adminApi",
  refetchOnMountOrArgChange: true,
  endpoints: (builder) => ({
    getAdminDashboardStats: builder.query({
      query: (params) => ({
        url: API_END_POINTS.getAdminDashboardStats,
        method: "GET",
        params: params && Object.keys(params).length > 0 ? params : undefined,
      }),
    }),
    getAdminDashboardOverview: builder.query({
      query: (params) => ({
        url: API_END_POINTS.getAdminDashboardOverview,
        method: "GET",
        params: params && Object.keys(params).length > 0 ? params : undefined,
      }),
    }),
    getAdminDashboardWeeklyVolume: builder.query({
      query: (params) => ({
        url: API_END_POINTS.getAdminDashboardWeeklyVolume,
        method: "GET",
        params: params && Object.keys(params).length > 0 ? params : undefined,
      }),
    }),
    // Hotel Booking Dashboard
    getHotelDashboardOverview: builder.query({
      query: () => ({
        url: API_END_POINTS.getHotelDashboardOverview,
        method: "GET",
      }),
      providesTags: [{ type: "HotelDashboardOverview" }],
    }),
    getBookingStatsByDateRange: builder.query({
      query: (params) => ({
        url: API_END_POINTS.getBookingStatsByDateRange,
        method: "GET",
        params: params && Object.keys(params).length > 0 ? params : undefined,
      }),
    }),
    getPropertyWiseStats: builder.query({
      query: () => ({
        url: API_END_POINTS.getPropertyWiseStats,
        method: "GET",
      }),
    }),
    getUpcomingActivity: builder.query({
      query: () => ({
        url: API_END_POINTS.getUpcomingActivity,
        method: "GET",
      }),
    }),
    getAdminOrders: builder.query({
      query: (params) => ({
        url: API_END_POINTS.getAdminOrders,
        method: "GET",
        params: params && Object.keys(params).length > 0 ? params : undefined,
      }),
      providesTags: [{ type: "AdminOrders" }],
    }),
    getAdminOrdersMonthly: builder.query({
      query: (params) => ({
        url: API_END_POINTS.getAdminOrdersMonthly,
        method: "GET",
        params: params && Object.keys(params).length > 0 ? params : undefined,
      }),
      providesTags: [{ type: "AdminOrdersMonthly" }],
    }),
    getAdminOrderById: builder.query({
      query: (orderId) => ({
        url: API_END_POINTS.getAdminOrderById.replace(':orderId', orderId),
        method: "GET",
      }),
      providesTags: [{ type: "AdminOrders", id: "LIST" }],
    }),
    getAdminMembers: builder.query({
      query: (params) => ({
        url: API_END_POINTS.getAdminMembers,
        method: "GET",
        params: params && Object.keys(params).length > 0 ? params : undefined,
      }),
      providesTags: [{ type: "AdminMembers" }],
    }),
    getAdminUsers: builder.query({
      query: (params) => ({
        url: API_END_POINTS.getAdminUsers,
        method: "GET",
        params: params && Object.keys(params).length > 0 ? params : undefined,
      }),
      providesTags: [{ type: "AdminUsers" }],
    }),
    getSingleStaff: builder.query({
      query: (staffId) => ({
        url: `${API_END_POINTS.getAdminUsers}/${staffId}`,
        method: "GET",
      }),
      providesTags: [{ type: "AdminUsers" }],
    }),
    activateStaff: builder.mutation({
      query: (staffId) => ({
        url: `${API_END_POINTS.getAdminUsers}/${staffId}/activate`,
        method: "PATCH",
      }),
      invalidatesTags: [{ type: "AdminUsers" }],
    }),
    deactivateStaff: builder.mutation({
      query: (staffId) => ({
        url: `${API_END_POINTS.getAdminUsers}/${staffId}/deactivate`,
        method: "PATCH",
      }),
      invalidatesTags: [{ type: "AdminUsers" }],
    }),
    updateStaff: builder.mutation({
      query: ({ staffId, staffData }) => ({
        url: `${API_END_POINTS.getAdminUsers}/${staffId}`,
        method: "PUT",
        body: staffData,
      }),
      invalidatesTags: [{ type: "AdminUsers" }],
    }),
    changeStaffPassword: builder.mutation({
      query: ({ staffId, passwordData }) => ({
        url: `${API_END_POINTS.getAdminUsers}/${staffId}/change-password`,
        method: "PATCH",
        body: passwordData,
      }),
      invalidatesTags: [{ type: "AdminUsers" }],
    }),
    createStaff: builder.mutation({
      query: (staffData) => ({
        url: API_END_POINTS.getAdminUsers,
        method: "POST",
        body: staffData,
      }),
      invalidatesTags: [{ type: "AdminUsers" }],
    }),
    deleteUser: builder.mutation({
      query: (userId) => ({
        url: `${API_END_POINTS.getAdminUsers}/${userId}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "AdminUsers" }],
    }),
    getTickets: builder.query({
      query: (params) => ({
        url: API_END_POINTS.getTickets,
        method: "GET",
        params: params && Object.keys(params).length > 0 ? params : undefined,
      }),
      providesTags: [{ type: "Tickets" }],
    }),
    getTicketById: builder.query({
      query: (ticketId) => ({
        url: API_END_POINTS.getTicketById.replace(':id', ticketId),
        method: "GET",
      }),
      providesTags: [{ type: "Tickets", id: "LIST" }],
    }),
    updateOrderStatus: builder.mutation({
      query: ({ orderId, status }) => ({
        url: API_END_POINTS.updateOrderStatus.replace(':orderId', orderId),
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: [{ type: "AdminOrders" }],
    }),
    updateTicketStatus: builder.mutation({
      query: ({ ticketId, status }) => ({
        url: API_END_POINTS.updateTicketStatus.replace(':ticket_id', ticketId),
        method: "PATCH",
        body: { status },
      }),
      // Remove invalidatesTags to prevent automatic refetch - we handle it manually
    }),
    updateTicketAdminNotes: builder.mutation({
      query: ({ ticketId, adminNotes }) => ({
        url: API_END_POINTS.updateTicketAdminNotes.replace(':ticketId', ticketId),
        method: "PUT",
        body: { note: adminNotes },
      }),
      invalidatesTags: [{ type: "Tickets", id: "LIST" }],
    }),
    claimTicket: builder.mutation({
      query: (ticketId) => ({
        url: `/api/v1/tickets/${ticketId}/claim`,
        method: "PATCH",
      }),
      invalidatesTags: [{ type: "AdminTickets" }],
    }),
    getSiteSettings: builder.query({
      query: () => ({
        url: API_END_POINTS.getSiteSettings,
        method: "GET",
      }),
      providesTags: [{ type: "SiteSettings" }],
    }),
    updateSiteSettings: builder.mutation({
      query: (settingsData) => ({
        url: API_END_POINTS.updateSiteSettings,
        method: "POST",
        body: settingsData,
      }),
      invalidatesTags: [{ type: "SiteSettings" }],
    }),
    updateStaffCommissionStatus: builder.mutation({
      query: ({ staffId, status }) => ({
        url: `/api/v1/admin/commission/staff/${staffId}/pay`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: [{ type: "AdminUsers" }, { type: "HotelDashboardOverview" }],
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetAdminDashboardStatsQuery,
  useGetAdminDashboardOverviewQuery,
  useGetAdminDashboardWeeklyVolumeQuery,
  useGetHotelDashboardOverviewQuery,
  useGetBookingStatsByDateRangeQuery,
  useGetPropertyWiseStatsQuery,
  useGetUpcomingActivityQuery,
  useGetAdminOrdersQuery,
  useGetAdminOrdersMonthlyQuery,
  useGetAdminOrderByIdQuery,
  useUpdateOrderStatusMutation,
  useUpdateTicketStatusMutation,
  useUpdateTicketAdminNotesMutation,
  useClaimTicketMutation,
  useGetAdminMembersQuery,
  useGetAdminUsersQuery,
  useGetSingleStaffQuery,
  useActivateStaffMutation,
  useDeactivateStaffMutation,
  useUpdateStaffMutation,
  useChangeStaffPasswordMutation,
  useCreateStaffMutation,
  useDeleteUserMutation,
  useGetTicketsQuery,
  useGetTicketByIdQuery,
  useGetSiteSettingsQuery,
  useUpdateSiteSettingsMutation,
  useUpdateStaffCommissionStatusMutation
} = adminApi;
