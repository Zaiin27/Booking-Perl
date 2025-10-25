import { API_END_POINTS } from "./ApiEndpoints";
import { SplitApiSettings } from "./SplitApiSetting";

export const api = SplitApiSettings.injectEndpoints({
  reducerPath: "api",
  refetchOnMountOrArgChange: true,
  endpoints: (builder) => ({
    /////////////////////////////<===MUTATIONS===>//////////////////////////////
    login: builder.mutation({
      query: (credentials) => ({
        url: API_END_POINTS.login,
        method: "POST",
        body: credentials,
      }),
    }),
    logout: builder.mutation({
      query: () => ({
        url: API_END_POINTS.logout,
        method: "POST",
      }),
    }),
    register: builder.mutation({
      query: (userData) => ({
        url: API_END_POINTS.register,
        method: "POST",
        body: userData,
      }),
    }),
    forgetPassword: builder.mutation({
      query: ({ data }) => ({
        url: API_END_POINTS.forgetPassword,
        method: "POST",
        body: data,
      }),
    }),
    resetPassword: builder.mutation({
      query: ({ data }) => ({
        url: `${API_END_POINTS.resetPassword}/${data.token}`,
        method: "PUT",
        body: {
          password: data.newPassword,
          confirmPassword: data.confirmPassword
        },
      }),
    }),

    updateUserProfile: builder.mutation({
      query: ({ data }) => ({
        url: `${API_END_POINTS.updateUserProfile}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: [{ type: "UpdateUserList", id: "user" }],
    }),

    scrapeUberEatsOrder: builder.mutation({
      query: (orderData) => ({
        url: API_END_POINTS.scrapeUberEatsOrder,
        method: "POST",
        body: orderData,
      }),
    }),

    contactSupport: builder.mutation({
      query: (contactData) => ({
        url: API_END_POINTS.contactSupport,
        method: "POST",
        body: contactData,
      }),
    }),

    createPaymentIntent: builder.mutation({
      query: (paymentData) => ({
        url: API_END_POINTS.createPaymentIntent,
        method: "POST",
        body: paymentData,
      }),
    }),

    /////////////////////////////<===QUERIES===>////////////////////////////////

    getUserProfile: builder.query({
      query: () => {
        return {
          url: `${API_END_POINTS.getUserProfile}`,
          method: "GET",
        };
      },
      providesTags: [{ type: "UpdateUserList", id: "user" }],
    }),

    getOrderAnalytics: builder.query({
      query: () => {
        return {
          url: `${API_END_POINTS.getOrderAnalytics}`,
          method: "GET",
        };
      },
      providesTags: [{ type: "OrderAnalytics", id: "analytics" }],
    }),

    getOrderHistory: builder.query({
      query: () => {
        return {
          url: `${API_END_POINTS.getOrderHistory}`,
          method: "GET",
        };
      },
      providesTags: [{ type: "OrderHistory", id: "history" }],
    }),

    checkAuth: builder.query({
      query: () => {
        return {
          url: `${API_END_POINTS.checkAuth}`,
          method: "GET",
        };
      },
      providesTags: [{ type: "AuthCheck", id: "auth" }],
    }),
  }),

  overrideExisting: true,
});

export const {
  /////////////////////////////<===MUTATIONS===>//////////////////////////////
  useLoginMutation,
  useLogoutMutation,
  useRegisterMutation,
  useForgetPasswordMutation,
  useResetPasswordMutation,
  useUpdateUserProfileMutation,
  useScrapeUberEatsOrderMutation,
  useContactSupportMutation,
  useCreatePaymentIntentMutation,

  /////////////////////////////<===QUERIES===>////////////////////////////////
  useGetUserProfileQuery,
  useGetOrderAnalyticsQuery,
  useGetOrderHistoryQuery,
  useCheckAuthQuery,
} = api;
