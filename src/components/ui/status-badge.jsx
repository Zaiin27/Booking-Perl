import React from "react"

const StatusBadge = React.memo(({ status, className = "" }) => {
    const getStatusStyles = () => {
        const statusMap = {
            "Due Soon": "text-red bg-red-50",
            Upcoming: "text-tint bg-tint-100",
            Scheduled: "text-[#AE7D6A] bg-[#F6F5EF]",
            Minor: "text-red bg-red-50",
            delay: "text-red bg-red-50",
            Collision: "text-tint bg-tint-100",
            collision: "text-tint bg-tint-100",
            accident: "text-red bg-red-100",
            breakdown: "text-red bg-red-100",
            Completed: "text-green bg-green-100",
        }

        return statusMap[status] || "text-gray-500 bg-gray-50"
    }

    return (
        <span className={`px-2 py-1 rounded-md md:text-xs truncate text-[0.5625rem] font-medium capitalize ${getStatusStyles()} ${className}`}>{status}</span>
    )
})

StatusBadge.displayName = "StatusBadge"

export default StatusBadge
