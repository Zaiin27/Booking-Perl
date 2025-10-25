import React from "react"
import NoResult from "../NoResult"
import TableSkeleton from "../skeltons/TableSkeleton"

// Reusable table component that can be configured for different data types
const DataTable = React.memo(
    ({
        title,
        columns = [],
        data = [],
        onRowClick,
        actionButton = null,
        emptyMessage = "No data available",
        className = "",
        children,
        isLoading = false
    }) => {
        // if (!data || data.length === 0) {
        //     return (
        //         <NoResult message={emptyMessage} />
        //     )
        // }

        return (
            <div className={`bg-white rounded-lg md:p-6 p-3 shadow-sm h-full ${className}`}>
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold font-nunito text-primary">{title}</h3>
                    {actionButton}
                </div>

                <div className="overflow-auto rounded-lg border-t border-b border-gray-200">
                    {isLoading ? <TableSkeleton /> : <>
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="border-b">
                                    {columns.map((column, index) => (
                                        <th
                                            key={index}
                                            className={`
                                            text-left py-4 px-5 md:text-xs text-[0.625rem] font-nunito font-semibold text-[#0A0A1F]
                                            ${index === 0 ? "rounded-tl-lg border-l border-gray-200" : ""}
                                            ${index === columns.length - 1 ? "rounded-tr-lg border-r border-gray-200" : ""}
                                        `}
                                            style={{ width: column.width }}
                                        >
                                            {column.header}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {data.map((row, rowIndex) => (
                                    <tr
                                        key={rowIndex}
                                        className={`
                                        hover:bg-[#FAFAFA] border-b
                                        odd:bg-[#FAFAFA]
                                        ${onRowClick ? "cursor-pointer" : ""}
                                    `}
                                        onClick={() => onRowClick && onRowClick(row)}
                                    >
                                        {columns.map((column, colIndex) => (
                                            <td
                                                key={colIndex}
                                                className={`
                                                py-6 px-5 md:text-xs text-[0.5625rem] text-gray-700
                                                ${colIndex === 0 ? "border-l border-gray-200" : ""}
                                                ${colIndex === columns.length - 1 ? "border-r border-gray-200" : ""}
                                                ${rowIndex === data.length - 1 && colIndex === 0 ? "rounded-bl-lg" : ""}
                                                ${rowIndex === data.length - 1 && colIndex === columns.length - 1 ? "rounded-br-lg" : ""}
                                            `}
                                            >
                                                {column.cell ? column.cell(row) : row[column.accessor]}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {children}
                    </>}
                    {!isLoading && data.length === 0 && <NoResult message={emptyMessage} />}
                </div>


            </div>
        )
    }
)

DataTable.displayName = "DataTable"

export default DataTable

