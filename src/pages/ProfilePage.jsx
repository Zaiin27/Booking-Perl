import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  ProfileHero,
  UserProfileCard,
  SummaryCards,
  LinkInputSection,
  OrdersHistoryTable,
} from "../components/profilePage";
import { useCheckAuthQuery } from "../services/Api";
import { setUser } from "../store/slices/authSlice";
import loginBg from "../assets/images/loginbg.png";
import PageLoading from "../components/PageLoading";

const ProfilePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  
  // Use regular auth query (AuthWrapper handles validation)
  const { 
    data: authData, 
    isLoading, 
    error, 
    refetch 
  } = useCheckAuthQuery(undefined, {
    skip: !user?.token && !localStorage.getItem('auth_token'),
  });

  // Legacy checkAuth query for backward compatibility
  const { data: legacyAuthData } = useCheckAuthQuery();

  useEffect(() => {
    if (authData) {
      console.log('ProfilePage: Received auth data from API:', authData);
      dispatch(setUser(authData));
    } else if (legacyAuthData) {
      console.log('ProfilePage: Received legacy auth data from API:', legacyAuthData);
      dispatch(setUser(legacyAuthData));
    }
  }, [authData, legacyAuthData, dispatch]);


  if (isLoading) {
    return (
      <div
        className="min-h-screen relative flex flex-col items-center justify-center p-4"
        style={{
          backgroundImage: `url(${loginBg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="container mx-auto px-4 flex items-center justify-center">
          <PageLoading 
            message="Loading profile data..."
          />
        </div>
      </div>
    );
  }

  if (error) {
    if (user) {
      return (
        <div
          className="min-h-screen relative flex flex-col items-center justify-center p-4"
          style={{
            backgroundImage: `url(${loginBg})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        >
          <div className="container mx-auto px-4">
            <ProfileHero />

            <UserProfileCard />

            <SummaryCards />

            <LinkInputSection />

            <OrdersHistoryTable />
          </div>
        </div>
      );
    }
    
    return (
      <div
        className="min-h-screen relative flex flex-col items-center justify-center p-4"
        style={{
          backgroundImage: `url(${loginBg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="container mx-auto px-4 flex items-center justify-center">
          <div className="text-white text-center">
            <div className="text-red-400 text-6xl mb-4">⚠️</div>
            <p className="text-lg mb-4">Failed to load profile data</p>
            <button 
              onClick={() => refetch()}
              className="bg-gradient-to-r from-[#9945FF] to-[#14F195] text-white px-6 py-2 rounded-full hover:scale-105 transition-all duration-300"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen relative flex flex-col items-center justify-center p-4"
      style={{
        backgroundImage: `url(${loginBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="container mx-auto px-4">
        <ProfileHero />

        <UserProfileCard />

        <SummaryCards />

        <LinkInputSection />

        <OrdersHistoryTable />
      </div>
    </div>
  );
};

export default ProfilePage;
