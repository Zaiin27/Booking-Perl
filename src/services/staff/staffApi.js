import { API_END_POINTS } from "../ApiEndpoints";
import { SplitApiSettings } from "../SplitApiSetting";

export const staffApi = SplitApiSettings.injectEndpoints({
  reducerPath: "staffApi",
  refetchOnMountOrArgChange: true,

  endpoints: (builder) => ({
    // Staff Dashboard
    getStaffDashboardStats: builder.query({
      query: (params) => ({
        url: API_END_POINTS.getStaffDashboardStats,
        method: "GET",
        params: params && Object.keys(params).length > 0 ? params : undefined,
      }),
      providesTags: [{ type: "StaffStats" }],
    }),
    
    // Ticket Management
    claimTicket: builder.mutation({
      query: (ticketId) => ({
        url: `/api/v1/tickets/${ticketId}/claim`,
        method: "PATCH",
      }),
      invalidatesTags: [{ type: "StaffTickets" }],
    }),
  }),

  overrideExisting: true,
});

export const {
  // Staff Dashboard hooks
  useGetStaffDashboardStatsQuery,
  
  // Ticket Management hooks
  useClaimTicketMutation,
} = staffApi;
