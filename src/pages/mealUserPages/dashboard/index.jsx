import React from "react";
import StatCard from "../../../components/Cards/stat-card";
import ComplianceChart from "../../../components/charts/compliance-chart";
import {
  alertsData,
  expiringDocuments,
  iftaSummaryData,
  pendingJobs,
  recentActivities,
  recentIncidentsData,
  upcomingMaintenanceData,
  upcomingReminders,
  whatsappMessages,
} from "../../../utils/fakeData";
import {
  AlertsIconRed,
  PeoplesIcon,
  TruckDriverIcon,
} from "../../../utils/icons";
import { Activity, Bell, BusFront, FileText, Headset } from "lucide-react";
import { AiOutlineAlert } from "react-icons/ai";
import { HiOutlineWrenchScrewdriver } from "react-icons/hi2";
// import { ReminderItem } from '../../dashboardCommons/ReminderItem'
import UpcomingMaintenance from "./features/upcoming-maintenance";
import RecentIncidents from "./features/recent-incidents";
import { truckGif } from "../../../assets/icons";
import {
  useGetCompanyDashboardCriticalAlertsQuery,
  useGetCompanyDashboardIftaSummaryQuery,
  useGetCompanyDashboardStatsQuery,
} from "../../../services/company/companyApi";
import { getRemainingDaysLabel } from "../../../utils/commonFunctions";

const CompanyDashboard = ({ driver = {} }) => {
  const {
    status = "Active",
    licenseExpiration = "25-Nov-03",
    twicCard = "13-Oct-24",
  } = driver;
  const [loading, setLoading] = React.useState(true);
  const { data: stats, isLoading } = useGetCompanyDashboardStatsQuery();
  const { data: iftaSummaryData, isLoading: iftaSummaryLoading } =
    useGetCompanyDashboardIftaSummaryQuery();
  const { data: criticalAlerts, isLoading: criticalAlertsLoading } =
    useGetCompanyDashboardCriticalAlertsQuery();

  React.useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen w-full fixed top-0 left-0 bg-white  z-[9999]">
        <img src={truckGif} width={200} alt="" />
      </div>
    );
  }
  const StatCardSkeleton = () => (
    <div className="bg-white rounded-lg p-4 shadow-sm animate-pulse">
      <div className="flex justify-between items-center pb-3 border-b-[0.9px] border-[#191D3133]">
        <div className="h-4 w-24 bg-gray-200 rounded" />
        <div className="bg-blue-50 w-7 h-7 rounded-md flex items-center justify-center">
          <div className="w-5 h-5 bg-gray-200 rounded" />
        </div>
      </div>
      <div className="flex items-end justify-between pt-3">
        <div className="h-8 w-16 bg-gray-200 rounded" />
        <div className="h-4 w-10 bg-gray-100 rounded" />
      </div>
    </div>
  );
  const StatCardSkeletonAlert = () => (
    <div className="bg-white rounded-lg shadow-sm animate-pulse">
      <div className="flex justify-between items-center mb-3 pb-3 border-b-[0.9px] border-[#191D3133]">
        <div className="h-4 w-24 bg-gray-200 rounded" />
        <div className="bg-blue-50 w-7 h-7 rounded-md flex items-center justify-center">
          <div className="w-5 h-5 bg-gray-200 rounded" />
        </div>
      </div>
      <div className="flex justify-between items-center mb-3 pb-3 border-b-[0.9px] border-[#191D3133]">
        <div className="h-4 w-24 bg-gray-200 rounded" />
        <div className="bg-blue-50 w-7 h-7 rounded-md flex items-center justify-center">
          <div className="w-5 h-5 bg-gray-200 rounded" />
        </div>
      </div>
    </div>
  );

  const ReminderItem = React.memo(
    ({ reminder, cardType = "reminder", className = "p-3" }) => {
      const { type, message, date } = reminder;

      const getIcon = (type) => {
        const iconMap = {
          overdue:
            cardType === "alert" ? (
              <AlertsIconRed className="h-5 w-5 text-red" />
            ) : (
              <Bell className="h-5 w-5 text-red" />
            ),
          license: <Bell className="h-5 w-5 text-yellow-500" />,
          // inspection: cardType === "alert" ? <Truck className="h-5 w-5 text-green" /> : <Bell className="h-5 w-5 text-tintLight" />,
        };

        return iconMap[type] || null;
      };

      return (
        <div
          className={`
                    rounded-lg min-w-[30rem] pr-4 ${className}
                    border-t border-r border-b
                    ${
                      type !== "overdue"
                        ? "border-l border-gray-300 border-t-gray-100 border-r-gray-100 border-b-gray-100"
                        : "border-l-4 border-[#E96666] border-t-[#E96666]/30 border-r-[#E96666]/30 border-b-[#E96666]/30"
                    }
                `}
        >
          <div className="flex justify-between items-center gap-4">
            <div className="flex gap-2">
              <div className="">
                <div
                  className={`flex items-center justify-center w-8 h-8 rounded-full bg-yellow-100`}
                >
                  <Bell className="h-5 w-5 text-yellow-500" />
                </div>
              </div>

              <div>
                <p
                  className={`font-medium text-sm line-clamp-1 font-nunito ${
                    message === "Medical Certificate Expiring"
                      ? "text-[#E96666]"
                      : type === "overdue"
                      ? "text-[#E96666]"
                      : "text-primary"
                  }`}
                >
                  {message}
                </p>
                <p className="text-xs text-primary-800 font-medium">{type}</p>
              </div>
            </div>
            <span
              className={`text-xs block px-2 py-1 truncate rounded ${
                type === "overdue"
                  ? "bg-[#E96666]/10 text-[#E96666]"
                  : "bg-primary-50 text-primary"
              }`}
            >
              {getRemainingDaysLabel(date)}
            </span>
          </div>
        </div>
      );
    }
  );

  return (
    <div className="">
      {/* Stats Row */}
      {isLoading ? (
        <div className="">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {[...Array(4)].map((_, idx) => (
              <StatCardSkeleton key={idx} />
            ))}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatCard
            title="Total Vehicles"
            value={stats?.data?.totalVehicles ?? 0}
            icon={BusFront}
            type="clients"
          />
          <StatCard
            title="Active Drivers"
            value={stats?.data?.activeDrivers ?? 0}
            icon={TruckDriverIcon}
            type="vehicles"
          />
          <StatCard
            title="IFTA Current Year"
            value={stats?.data?.iftaRecordsCount ?? 0}
            icon={FileText}
            type="drivers"
          />
          <StatCard
            title="Pending Alerts"
            value={stats?.data?.alerts ?? 0}
            icon={AiOutlineAlert}
            type="alerts"
          />
        </div>
      )}

      {/* Chart and Expiring Documents Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg  shadow-sm h-full">
            <div className="flex justify-between px-6 py-4 border-[0.0563rem] border-[#191D311A] rounded-t-lg items-center">
              <h3 className="text-lg font-semibold font-nunito text-primary">
                Critical Alerts (2){" "}
              </h3>
              <Activity className="h-5 w-5 text-primary" />
            </div>
            <div className="p-4">
              <div className="overflow-x-auto">
                <div className="min-w-full space-y-4 max-h-[12rem] overflow-y-auto custom-thinner-scrollbar">
                  {criticalAlertsLoading ? (
                    <StatCardSkeletonAlert />
                  ) : (
                    <>
                      {criticalAlerts?.data?.alerts?.length > 0 ? (
                        criticalAlerts?.data?.alerts?.map((reminder) => (
                          <ReminderItem
                            key={reminder._id}
                            reminder={reminder}
                            cardType="alert"
                            className="md:p-5 p-3"
                          />
                        ))
                      ) : (
                        <p className="text-gray-500 text-center py-8">
                          No upcoming reminders
                        </p>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div>
          <div className="bg-white rounded-lg p-6 shadow-sm h-full">
            <h3 className="text-lg font-semibold font-nunito text-primary mb-4">
              IFTA Summary - Q3 2025
            </h3>

            <div className="space-y-4 px-1.5">
              <div className="flex justify-between items-center py-2 border-b-[0.0462rem] border-[#5555551A]">
                <span className="text-primary font-nunito text-sm font-medium">
                  Total Miles
                </span>
                <span className="text-primary-800 text-xs">
                  {iftaSummaryData?.data?.totalMiles?.toLocaleString()}
                </span>
              </div>

              <div className="flex justify-between items-center py-1.5 border-b-[0.0462rem] border-[#5555551A]">
                <span className="text-primary font-nunito text-sm font-medium">
                  MPG Average
                </span>
                <span className="text-primary-800 text-xs">
                  {iftaSummaryData?.data?.mpgAverage?.toLocaleString()}
                </span>
              </div>

              <div className="flex justify-between items-center py-1.5 border-b-[0.0462rem] border-[#5555551A]">
                <span className="text-primary font-nunito text-sm font-medium">
                  Total Gallons
                </span>
                <span className="text-primary-800 text-xs">
                  {iftaSummaryData?.data?.totalGallons?.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center py-1.5 ">
                <span className="text-primary font-nunito text-sm font-medium">
                  States Traveled
                </span>
                <span className="text-primary-800 text-xs">
                  {iftaSummaryData?.data?.statesTraveledCount?.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="">
          <UpcomingMaintenance maintenanceData={upcomingMaintenanceData} />
        </div>
        <div className="">
          <RecentIncidents incidentsData={recentIncidentsData} />
        </div>
      </div>
    </div>
  );
};

export default CompanyDashboard;
