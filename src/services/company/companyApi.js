import { API_END_POINTS } from "../ApiEndpoints";
import { SplitApiSettings } from "../SplitApiSetting";

export const companyApi = SplitApiSettings.injectEndpoints({
  reducerPath: "companyApi",
  refetchOnMountOrArgChange: true,

  endpoints: (builder) => ({
    // Company Dashboard
    getCompanyDashboardStats: builder.query({
      query: (params) => ({
        url: API_END_POINTS.getCompanyDashboardStats,
        method: "GET",
        params: params && Object.keys(params).length > 0 ? params : undefined,
      }),
      providesTags: [{ type: "CompanyStats" }],
    }),
    getCompanyDashboardIftaSummary: builder.query({
      query: (params) => ({
        url: API_END_POINTS.getCompanyDashboardIftaSummary,
        method: "GET",
        params: params && Object.keys(params).length > 0 ? params : undefined,
      }),
      providesTags: [{ type: "IftaRecords" }],
    }),
    getCompanyDashboardCriticalAlerts: builder.query({
      query: (params) => ({
        url: API_END_POINTS.getCompanyDashboardCriticalAlerts,
        method: "GET",
        params: params && Object.keys(params).length > 0 ? params : undefined,
      }),
      providesTags: [{ type: "CriticalAlerts" }],
    }),
  }),

  overrideExisting: true,
});

export const {
  // Company Dashboard hooks
  useGetCompanyDashboardStatsQuery,
  useGetCompanyDashboardIftaSummaryQuery,
  useGetCompanyDashboardCriticalAlertsQuery,
} = companyApi;
