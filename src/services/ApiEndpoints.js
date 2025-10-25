export const BASE_URL =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.DEV ? "https://meb.senew-tech.com" : "https://meb.senew-tech.com");

// Debug logging
console.log("API Configuration:");
console.log("NODE_ENV:", import.meta.env.MODE);
console.log("DEV:", import.meta.env.DEV);
console.log("VITE_API_URL:", import.meta.env.VITE_API_URL);
console.log("BASE_URL:", BASE_URL);
// export const BASE_URL = 'https://b0fd-139-135-36-92.ngrok-free.app'
export const BASE_URL_IMAGE = import.meta.env.VITE_FILES_URL;

const VERSION_API = "v1";

export const API_END_POINTS = {
  /////////////////////////////<=== AUTH ===>//////////////////////////////
  login: "/api/v1/auth/signin",
  logout: "/api/v1/auth/signout",
  register: "/api/v1/auth/signup",
  forgetPassword: "/api/v1/auth/password/forgot",
  resetPassword: "/api/v1/auth/password/reset",
  updateUserProfile: "/api/v1/auth/profile",
  getUserProfile: "/api/v1/auth/profile",
  checkAuth: "/api/v1/auth/check",

  /////////////////////////////<=== ADMIN DASHBOARD ===>/////////////////////
  getAdminDashboardStats: "/api/v1/admin/stats",
  getAdminDashboardOverview: "/api/v1/admin/dashboard/overview",
  getAdminDashboardWeeklyVolume: "/api/v1/admin/dashboard/weekly-volume",
  getAdminOrders: "/api/v1/admin/orders",
  getAdminOrdersMonthly: "/api/v1/admin/orders/monthly",
  getAdminOrderById: "/api/v1/orders/:orderId",
  updateOrderStatus: "/api/v1/admin/orders/:orderId/status",
  updateTicketStatus: "/api/v1/tickets/:ticket_id/status",
  getAdminMembers: "/api/v1/admin/members",
  getAdminUsers: "/api/v1/admin/users",
  activateStaff: "/api/v1/admin/staffs",
  deactivateStaff: "/api/v1/admin/staffs",

  /////////////////////////////<=== STAFF DASHBOARD ===>///////////////////
  getStaffDashboardStats: "/api/v1/staff-dashboard/stats",

  /////////////////////////////<=== USER DASHBOARD ===>////////////////////
  getUserDashboardStats: "/api/v1/user-dashboard/stats",

  /////////////////////////////<=== COMPANY DASHBOARD ===>////////////////////
  getCompanyDashboardStats: "/api/v1/company-dashboard/stats",
  getCompanyDashboardIftaSummary: "/api/v1/company-dashboard/ifta-summary",
  getCompanyDashboardCriticalAlerts:
    "/api/v1/company-dashboard/critical-alerts",

  /////////////////////////////<=== ORDER PROCESSING ===>////////////////////
  scrapeUberEatsOrder: "/api/v1/uber-eats/scrape-group-order",

  /////////////////////////////<=== SUPPORT ===>//////////////////////////////
  contactSupport: "/api/v1/support/contact",

  /////////////////////////////<=== PAYMENTS ===>//////////////////////////////
  createPaymentIntent: "/api/v1/payments/create-simulate-payment-intent",
  getOrderAnalytics: "/api/v1/orders/analytics",
  getOrderHistory: "/api/v1/orders/history",

  /////////////////////////////<=== CHAT ===>//////////////////////////////
  sendChatMessage: "/api/v1/chat/:orderId",
  getChatMessages: "/api/v1/chat/:orderId",

  /////////////////////////////<=== TICKETS ===>//////////////////////////////
  getTickets: "/api/v1/tickets",
  getTicketById: "/api/v1/tickets/:id",
  updateTicketAdminNotes: "/api/v1/tickets/:ticketId/admin-notes",

  /////////////////////////////<=== SITE SETTINGS ===>//////////////////////////////
  getSiteSettings: "/api/v1/site-settings",
  updateSiteSettings: "/api/v1/site-settings/upsert",
};
