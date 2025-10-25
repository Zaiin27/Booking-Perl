
import React from "react"
import StatusBadge from "../../../../components/ui/status-badge"
import DataTable from "../../../../components/Tables/DataTable"
import dateFormat from "dateformat"

const RecentIncidents = React.memo(({ incidentsData = [], onViewAll = () => { } }) => {
    const columns = [
        {
            header: "Date",
            accessor: "date",
            width: "25%",
            cell: (row) => <div className="truncate">{dateFormat(row.date, "dd-mm-yyyy")}  </div>,
        },
        {
            header: "Driver",
            accessor: "driverName",
            width: "32%",
            cell: (row) => <div className="truncate" > {row.driverName} </div>,
        },
        {
            header: "Unit",
            accessor: "unitNumber",
            width: "20%",
        },
        {
            header: "Type",
            accessor: "incidentType",
            width: "20%",
            cell: (row) => <StatusBadge status={row.incidentType} />,
        },
    ]

    return (
        <DataTable
            title="Recent Incidents"
            columns={columns}
            data={incidentsData}
            emptyMessage="No recent incidents reported"
        />
    )
})

RecentIncidents.displayName = "RecentIncidents"

export default RecentIncidents
