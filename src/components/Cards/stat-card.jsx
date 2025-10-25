import React from "react"

// Reusable stat card component with icon mapping
const StatCard = React.memo(({ title, value, change, type, icon: Icon }) => {
    return (
        <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="flex justify-between items-center pb-3 border-b-[0.9px] border-[#191D3133]">
                <h3 className="text-gray text-sm font-semibold font-nunito">{title}</h3>
                <div className="bg-blue-50 w-7 flex justify-center items-center h-7 rounded-md">
                    {Icon && <Icon className="w-5 h-5 text-secondary" />}
                </div>
            </div>
            <div className="flex items-end justify-between pt-3">
                <p className="text-[1.5625rem] text-primary font-bold">{value}</p>
                {change?.isPositive !== undefined ? (
                    <span className={`text-sm ${change.isPositive ? "text-green-500" : "text-red"} font-medium flex items-center`}>
                        {change.isPositive ? "↑" : "↓"} {change.value}
                    </span>
                ) : (
                    <span className="text-sm text-green-500 font-medium flex items-center">
                        {change?.value}
                    </span>
                )}
            </div>
        </div>
    )
})

StatCard.displayName = "StatCard"

export default StatCard

