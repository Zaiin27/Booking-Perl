import { API_END_POINTS } from "../ApiEndpoints";
import { SplitApiSettings } from "../SplitApiSetting";

export const driverApi = SplitApiSettings.injectEndpoints({
  reducerPath: "driverAPI",
  refetchOnMountOrArgChange: true,
  endpoints: (builder) => ({
    // Driver Dashboard only
    getDriverDashboardStats: builder.query({
      query: () => ({
        url: API_END_POINTS.getDriverDashboardStats,
        method: "GET",
      }),
      providesTags: [{ type: "DriverProfile" }],
    }),
    getDriverDashboardStatus: builder.query({
      query: () => ({
        url: API_END_POINTS.getDriverDashboardStatus,
        method: "GET",
      }),
      providesTags: [{ type: "DriverProfile" }],
    }),
    getDriverAlertReminder: builder.query({
      query: () => ({
        url: API_END_POINTS.getDriverAlertReminder,
        method: "GET",
      }),
      providesTags: [{ type: "DriverProfile" }],
    }),
    getDriverExpiringDocs: builder.query({
      query: () => ({
        url: API_END_POINTS.getDriverExpiringDocs,
        method: "GET",
      }),
      providesTags: [{ type: "DriverProfile" }],
    }),
  }),
});

export const {
  useGetDriverDashboardStatsQuery,
  useGetDriverDashboardStatusQuery,
  useGetDriverAlertReminderQuery,
  useGetDriverExpiringDocsQuery,
} = driverApi;
