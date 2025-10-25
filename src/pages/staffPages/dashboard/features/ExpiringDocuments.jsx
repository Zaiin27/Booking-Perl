import React from "react";
import { Calendar } from "lucide-react";
import { IoCalendarClear } from "react-icons/io5";
import { DocumentItem } from "../../../dashboardCommons/ExpireDocument";
import { useGetDriverExpiringDocsQuery } from "../../../../services/user/userApi";

// Utility function to map API status to urgency
const mapStatusToUrgency = (status, daysLeft) => {
  if (status === "expired") return "Expired";
  if (daysLeft <= 30) return "Urgent";
  return "Soon";
};

// Skeleton Loader Component
const DocumentSkeleton = () => (
  <div className="pb-3 animate-pulse">
    <div className="flex justify-between items-center">
      <div className="space-y-2">
        <div className="h-4 w-40 bg-gray-200 rounded"></div>
        <div className="h-3 w-32 bg-gray-100 rounded"></div>
      </div>
      <div className="h-6 w-16 bg-gray-200 rounded-md"></div>
    </div>
  </div>
);

// Main component
const ExpiringDocuments = React.memo(
  ({ title = "Expiring Documents", documents = [] }) => {
    const {
      data: apiResponse,
      isLoading,
      isError,
    } = useGetDriverExpiringDocsQuery();

    // Transform API data to match expected format
    const transformedDocuments =
      apiResponse?.data?.map((item) => ({
        name: item.name,
        type: item.document,
        company: "", // Not provided in API, can be empty or you might want to add it
        urgency: mapStatusToUrgency(item.status, item.daysLeft),
        expirationDate: item.expirationDate,
        daysLeft: item.daysLeft,
      })) || [];

    // Use transformed API data if available, otherwise fall back to props
    const displayDocuments =
      transformedDocuments.length > 0 ? transformedDocuments : documents;

    if (isLoading) {
      return (
        <div className="bg-white rounded-lg p-6 shadow-sm h-full">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold font-nunito text-primary">
              {title}
            </h3>
          </div>
          <div className="space-y-3 mt-8">
            {[...Array(3)].map((_, index) => (
              <DocumentSkeleton key={index} />
            ))}
          </div>
        </div>
      );
    }

    if (isError) {
      return (
        <div className="bg-white rounded-lg p-4 shadow-sm h-full">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold font-nunito text-primary">
              {title}
            </h3>
          </div>
          <p className="text-gray-500 text-center py-8">
            Error loading documents
          </p>
        </div>
      );
    }

    if (!displayDocuments || displayDocuments.length === 0) {
      return (
        <div className="bg-white rounded-lg p-4 shadow-sm h-full">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold font-nunito text-primary">
              {title}
            </h3>
          </div>
          <p className="text-gray-500 text-center py-8">
            No expiring documents found
          </p>
        </div>
      );
    }

    return (
      <div className="bg-white rounded-lg p-6 shadow-sm h-full">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold font-nunito text-primary">
            {title}
          </h3>
        </div>
        <div className="space-y-3 mt-8">
          {displayDocuments.map((doc, index) => (
            <DocumentItem key={index} document={doc} />
          ))}
        </div>
      </div>
    );
  }
);

ExpiringDocuments.displayName = "ExpiringDocuments";

export default ExpiringDocuments;
