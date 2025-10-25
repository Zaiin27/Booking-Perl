
import React from "react"
import StatusBadge from "../../../../components/ui/status-badge"
import DataTable from "../../../../components/Tables/DataTable"


const UpcomingMaintenance = React.memo(({ maintenanceData = [], onViewAll = () => { } }) => {
    const columns = [
        {
            header: "Unit",
            accessor: "unitNumber",
            width: "20%",
        },
        {
            header: "Type",
            accessor: "type",
            width: "25%",
        },
        {
            header: "Due Date",
            accessor: "dueDate",
            minWidth: "12rem",
            cell: (row) => <span className=" truncate">{row.dueDate}</span>,
        },
        {
            header: "Status",
            accessor: "status",
            width: "25%",
            cell: (row) => <StatusBadge status={row.status} />,
        },
    ]

    return (
        <DataTable
            title="Upcoming Maintenance"
            columns={columns}
            data={maintenanceData}
            emptyMessage="No upcoming maintenance scheduled"
            className="overflow-hidden"
        />
    )
})

UpcomingMaintenance.displayName = "UpcomingMaintenance"

export default UpcomingMaintenance
