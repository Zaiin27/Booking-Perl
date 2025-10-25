import React from "react";
import StatCard from "../../../components/Cards/stat-card";
import ComplianceChart from "../../../components/charts/compliance-chart";
import {
  alertsData,
  driverExpiringDocuments,
  expiringDocuments,
  pendingJobs,
  recentActivities,
  upcomingReminders,
  whatsappMessages,
} from "../../../utils/fakeData";
import { PeoplesIcon, TruckDriverIcon } from "../../../utils/icons";
import { Activity, BusFront, FileText, Headset } from "lucide-react";
import { AiOutlineAlert } from "react-icons/ai";
import ExpiringDocuments from "./features/ExpiringDocuments";
import { HiOutlineWrenchScrewdriver } from "react-icons/hi2";
import { ReminderItem } from "../../dashboardCommons/ReminderItem";
import { truckGif } from "../../../assets/icons";
import {
  useGetDriverDashboardStatsQuery,
  useGetDriverDashboardStatusQuery,
  useGetDriverAlertReminderQuery,
} from "../../../services/user/userApi";

const DriverDashboard = ({ driver = {} }) => {
  const { data: statsData, isLoading: statsLoading } =
    useGetDriverDashboardStatsQuery();
  const { data: statusData, isLoading: statusLoading } =
    useGetDriverDashboardStatusQuery();
  const { data: alertsData, isLoading: alertsLoading } =
    useGetDriverAlertReminderQuery();

  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  if (loading || statsLoading || statusLoading || alertsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen w-full fixed top-0 left-0 bg-white  z-[9999]">
        <img src={truckGif} width={200} alt="" />
      </div>
    );
  }

  // Format dates for display
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="">
      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          title="My Equipment"
          value={statsData?.data?.equipmentCount || 0}
          icon={HiOutlineWrenchScrewdriver}
          type="clients"
        />
        <StatCard
          title="Documents"
          value={statsData?.data?.documentCount || 0}
          icon={FileText}
          type="vehicles"
        />
        <StatCard
          title="Training"
          value={`${statsData?.data?.driverAttemptedTraining || 0}/${
            statsData?.data?.totalTraining || 0
          }`}
          icon={Headset}
          type="drivers"
        />
        <StatCard
          title="Active Alerts"
          value={statsData?.data?.alertCount || 0}
          icon={AiOutlineAlert}
          type="alerts"
        />
      </div>

      {/* Chart and Expiring Documents Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg  shadow-sm h-full">
            <div className="flex justify-between px-6 py-4 border-[0.0563rem] border-[#191D311A] rounded-t-lg items-center">
              <h3 className="text-lg font-semibold font-nunito text-primary">
                Important Alerts ({alertsData?.data?.length || 0})
              </h3>
              <Activity className="h-5 w-5 text-primary" />
            </div>
            <div className="p-4">
              <div className="overflow-x-auto">
                <div className="min-w-full space-y-4">
                  {/* Alerts */}
                  {alertsData?.data?.length > 0 ? (
                    <>
                      <div className="mb-2 font-semibold text-primary text-base">
                        Alerts
                      </div>
                      {alertsData.data.map((alert) => (
                        <ReminderItem
                          key={alert.id}
                          reminder={{
                            id: alert.id,
                            title: alert.type,
                            description: alert.message,
                            // Format date as DD-MM-YYYY
                            date: alert.date
                              ? new Date(alert.date).toLocaleDateString("en-GB")
                              : "N/A",
                            status: alert.severity,
                            read: alert.read,
                          }}
                          cardType="alert"
                        />
                      ))}
                    </>
                  ) : (
                    <div className="text-center py-4 text-gray-500">
                      No important alerts found
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="bg-white rounded-lg px-4 py-4 mb-5 shadow-sm ">
            <h3 className="text-lg font-semibold font-nunito text-primary mb-4">
              Driver Status
            </h3>
            {/* Profile Completion Section */}
            <div className="flex justify-between items-center border border-l-[0.2rem] border-[#E96666] border-t-[#E96666]/30 border-r-[#E96666]/30 border-b-[#E96666]/30 rounded-md px-3 py-2 mb-2">
              <span className="text-[#E96666] font-nunito font-medium text-sm">
                Profile Completion{" "}
                <span className="text-[0.5rem]">
                  ({statusData?.data?.completedStepsCount || 0}/
                  {statusData?.data?.totalSteps || 0})
                </span>
              </span>
              <span
                className={`${
                  statusData?.data?.profileCompletion === "complete"
                    ? "bg-green-50 text-green"
                    : "bg-[#E96666]/10 text-[#E96666]"
                } text-xs px-3 py-1 rounded-md font-normal`}
              >
                {statusData?.data?.profileCompletion === "complete"
                  ? "Complete"
                  : "Incomplete"}
              </span>
            </div>

            <div className="space-y-1 px-2">
              <div className="flex justify-between items-center py-2 border-b-[0.0462rem] border-[#5555551A]">
                <span className="text-primary font-nunito text-sm font-medium">
                  Status
                </span>
                <span
                  className={`${
                    statusData?.data?.driverStatus === "active"
                      ? "bg-green-50 text-green"
                      : "bg-red-50 text-red"
                  } px-4 py-1 font-nunito text-xs rounded-md`}
                >
                  {statusData?.data?.driverStatus || "N/A"}
                </span>
              </div>

              <div className="flex justify-between items-center py-2 border-b-[0.0462rem] border-[#5555551A]">
                <span className="text-primary font-nunito text-sm font-medium">
                  License Expiration
                </span>
                <span className="text-primary-800 text-xs">
                  {formatDate(statusData?.data?.licenseExpiration)}
                </span>
              </div>

              <div className="flex justify-between items-center py-2 ">
                <span className="text-primary font-nunito text-sm font-medium">
                  TWIC Card
                </span>
                <span className="text-primary-800 text-xs">
                  {formatDate(statusData?.data?.twicCardExpiry)}
                </span>
              </div>
            </div>
          </div>
          <div>
            <ExpiringDocuments documents={driverExpiringDocuments} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DriverDashboard;
