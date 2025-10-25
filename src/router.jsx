import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import MainWebLayout from "./global/mainWebLayout";
import AppLayout from "./global/AppLayout";
import AuthWrapper from "./components/AuthWrapper";
import HomePage from "./pages/HomePage";
import ContactPage from "./pages/ContactPage";
import FAQPage from "./pages/FAQPage";
import SupportPage from "./pages/SupportPage";
import TermsPage from "./pages/TermsPage";
import PrivacyPage from "./pages/PrivacyPage";
import RefundsPage from "./pages/RefundsPage";
import PhilanthropyPage from "./pages/PhilanthropyPage";
import ReviewsPage from "./pages/ReviewsPage";

import ProfilePage from "./pages/ProfilePage";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import UnauthorizedPage from "./pages/Unauthor";
import RoleProtectedRoute from "./utils/RoleProtectedRoute";
import DashboardRedirect from "./utils/DashboardRedirect";
import LoginRedirect from "./utils/LoginRedirect";
import SignupRedirect from "./utils/SignupRedirect";
import OrderNowPage from "./pages/orderNowPage";
import PropertiesListPage from "./pages/propertiesListPage";
import BookingFormPage from "./pages/bookingFormPage";
import BookingSuccessPage from "./pages/BookingSuccessPage";
import AdminOrders from "./pages/mealAdminPages/orders";
import PropertiesPage from "./pages/mealAdminPages/properties";
import PropertyForm from "./pages/mealAdminPages/propertyForm";
import PropertyDetail from "./pages/mealAdminPages/propertyDetail";
import BookingsPage from "./pages/mealAdminPages/bookings";
import TicketsPage from "./pages/mealAdminPages/tickets";
import AdminStaff from "./pages/mealAdminPages/staff";
import StaffPage from "./pages/staffPages/staff";
import AdminSettings from "./pages/mealAdminPages/settings";
import ChatManagement from "./pages/mealAdminPages/chats";
import StaffChatManagement from "./pages/staffPages/chat";

// Dashboard imports
import AdminDashboard from "./pages/mealAdminPages/dashboard";
import DriverDashboard from "./pages/staffPages/dashboard";
import NotFound from "./pages/NotFound";

const AppRouter = () => {
  return (
    <AuthWrapper>
      <Routes>
        {/* Public Website Routes - Using MainWebLayout */}
        <Route path="/" element={<MainWebLayout />}>
          <Route index element={<HomePage />} />
          <Route path="contact" element={<ContactPage />} />
          <Route path="faq" element={<FAQPage />} />
          <Route path="support" element={<SupportPage />} />
          <Route path="terms" element={<TermsPage />} />
          <Route path="privacy" element={<PrivacyPage />} />
          <Route path="refunds" element={<RefundsPage />} />
          <Route path="philanthropy" element={<PhilanthropyPage />} />
          <Route path="reviews" element={<ReviewsPage />} />
       
          <Route path="profile" element={<ProfilePage />} />
          <Route path="order-now" element={<OrderNowPage />} />
          <Route path="properties" element={<PropertiesListPage />} />
          <Route path="booking/:propertyId" element={<BookingFormPage />} />
          <Route path="booking-success" element={<BookingSuccessPage />} />
        {/* Placeholder route for meals page */}
        <Route
          path="meals"
          element={
            <div className="py-20 bg-gradient-to-b from-[#0F0F23] via-[#1A1A2E] to-[#16213E] text-center">
              <h1 className="text-4xl font-inter font-bold text-white">
                Meals Page - Coming Soon
              </h1>
            </div>
          }
        />
      </Route>

      {/* Authentication Routes - No Layout (Full Page) */}
      <Route
        path="/login"
        element={
          <LoginRedirect>
            <Login />
          </LoginRedirect>
        }
      />
      <Route
        path="/signup"
        element={
          <SignupRedirect>
            <Signup />
          </SignupRedirect>
        }
      />
      <Route path="/forget-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      {/* Dashboard Redirect Route */}
      <Route path="/dashboard" element={<DashboardRedirect />} />

      {/* Unauthorized Page */}
      <Route path="/unauthorized" element={<UnauthorizedPage />} />
      {/* Admin Dashboard Routes - Using AppLayout with Role Protection */}
      {/* <Route
        path="/admin"
        element={
          <RoleProtectedRoute allowedRoles={["admin"]}>
            <AppLayout />
          </RoleProtectedRoute>
        }
      ></Route> */}
      {/* Admin Dashboard Routes - Using AppLayout with Role Protection */}
      <Route
        path="/admin"
        element={
          <RoleProtectedRoute allowedRoles={["admin"]}>
            <AppLayout />
          </RoleProtectedRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="properties" element={<PropertiesPage />} />
        <Route path="properties/create" element={<PropertyForm />} />
        <Route path="properties/edit/:id" element={<PropertyForm />} />
        <Route path="properties/create-for-staff/:staffId" element={<PropertyForm />} />
        <Route path="properties/:id" element={<PropertyDetail />} />
        <Route path="bookings" element={<BookingsPage />} />
        <Route path="orders" element={<AdminOrders />} />
        <Route path="tickets" element={<TicketsPage />} />
        <Route path="tickets/chat" element={<ChatManagement />} />
        <Route path="staff" element={<AdminStaff />} />
        <Route path="settings" element={<AdminSettings />} />
      </Route>

      {/* Staff Dashboard Routes - Using AppLayout with Role Protection */}
      {/* <Route
        path="/staff"
        element={
          <RoleProtectedRoute allowedRoles={["staff"]}>
            <AppLayout />
          </RoleProtectedRoute>
        }
      ></Route> */}
      {/* Staff Dashboard Routes - Using AppLayout with Role Protection */}
      <Route
        path="/staff"
        element={
          <RoleProtectedRoute allowedRoles={["staff", "driver"]}>
            <AppLayout />
          </RoleProtectedRoute>
        }
      >
        <Route index element={<DriverDashboard />} />
        <Route path="dashboard" element={<DriverDashboard />} />
        <Route path="properties" element={<PropertiesPage />} />
        <Route path="properties/create" element={<PropertyForm />} />
        <Route path="properties/:id" element={<PropertyDetail />} />
        <Route path="properties/edit/:id" element={<PropertyForm />} />
        <Route path="bookings" element={<BookingsPage />} />
        <Route path="orders" element={<AdminOrders />} />
        <Route path="tickets" element={<TicketsPage />} />
        <Route path="tickets/chat" element={<StaffChatManagement />} />
        <Route path="staff" element={<StaffPage />} />
        <Route path="settings" element={<AdminSettings />} />
      </Route>
      {/* User Dashboard Routes - Removed - Users go to /profile instead */}

      {/* Company Owner Dashboard Routes - Using AppLayout with Role Protection */}
      <Route
        path="/company-owner"
        element={
          <RoleProtectedRoute allowedRoles={["company-owner"]}>
            <AppLayout />
          </RoleProtectedRoute>
        }
      >
        <Route
          index
          element={
            <div className="p-6 text-white">Company Owner Dashboard - Coming Soon</div>
          }
        />
        <Route
          path="dashboard"
          element={
            <div className="p-6 text-white">Company Owner Dashboard - Coming Soon</div>
          }
        />
        <Route
          path="orders"
          element={
            <div className="p-6 text-white">My Orders - Coming Soon</div>
          }
        />
        <Route
          path="tickets"
          element={
            <div className="p-6 text-white">Support Tickets - Coming Soon</div>
          }
        />
        <Route
          path="profile"
          element={
            <div className="p-6 text-white">Company Owner Profile - Coming Soon</div>
          }
        />
        <Route
          path="settings"
          element={
            <div className="p-6 text-white">Company Owner Settings - Coming Soon</div>
          }
        />
      </Route>

        {/* Catch all route for 404 */}
        <Route
          path="*"
          element={
            <div className="min-h-screen bg-[#0F0F23] flex items-center justify-center">
              <NotFound />
            </div>
          }
        />
      </Routes>
    </AuthWrapper>
  );
};

export default AppRouter;
