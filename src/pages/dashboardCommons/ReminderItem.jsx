import { Bell } from "lucide-react"
import React from "react"
import { alertTruck } from "../../utils/icons";

export const ReminderItem = React.memo(({ reminder, cardType = 'reminder', className = 'p-3' }) => {
    const { type, title, description, date } = reminder

    // Always return 'truck' to always show TruckIcon
    const getIcon = () => alertTruck(); 

    return (
        <div
            className={`
                rounded-lg min-w-[30rem] pr-4 ${className}
                border-t border-r border-b
                border-l border-gray-300 border-t-gray-100 border-r-gray-100 border-b-gray-100
            `}
        >
            <div className="flex justify-between items-center">
                <div className="flex gap-2">
                    <div>
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[#DCFCE7]">
                            {getIcon()}
                        </div>
                    </div>
                    <div>
                        <p className="font-medium text-sm font-nunito text-primary">
                            {title}
                        </p>
                        <p className="text-xs text-primary-800 font-medium">{description}</p>
                    </div>
                </div>
                <span className="text-xs block px-2 py-1 rounded bg-primary-50 text-primary">{date}</span>
            </div>
        </div>
    )
})

ReminderItem.displayName = "ReminderItem"