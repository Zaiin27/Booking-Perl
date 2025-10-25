const TableSkeleton = ({ columns }) => {
    const rows = Array.from({ length: 7 });
    const skeletonColumns = columns || Array(8).fill({});

    return (
        <div className="w-full overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
                <thead>
                    <tr className="bg-gray-50">
                        {skeletonColumns.map((col, index) => (
                            <th 
                                key={index} 
                                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                style={{ minWidth: col.minWidth || 'auto' }}
                            >
                                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200 animate-pulse">
                    {rows.map((_, rowIndex) => (
                        <tr key={rowIndex}>
                            {skeletonColumns.map((_, colIndex) => (
                                <td key={colIndex} className="px-4 py-4">
                                    <div className="h-4 bg-gray-100 rounded w-3/4"></div>
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default TableSkeleton;
