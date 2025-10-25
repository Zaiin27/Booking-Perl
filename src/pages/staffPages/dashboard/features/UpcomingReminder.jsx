"use client"

import React from "react"
import { ReminderItem } from "../../../dashboardCommons/ReminderItem";
// Main component
const UpcomingReminders = React.memo(({ title = "Upcoming Reminders", reminders = [], onAddReminder = () => { } }) => {
    return (
        <div className="bg-white rounded-lg p-4 shadow-sm h-full">
            <div className="flex justify-between items-center mb-8">
                <h3 className="text-lg font-semibold font-nunito text-primary">{title}</h3>
            </div>

            <div className="overflow-x-auto">
                <div className="min-w-full space-y-4 ">
                    {reminders.length > 0 ? (
                        reminders.map((reminder) => <ReminderItem key={reminder.id} reminder={reminder} className="md:p-7 p-3" />)
                    ) : (
                        <p className="text-gray-500 text-center py-8">No upcoming reminders</p>
                    )}
                </div>
            </div>
        </div>
    )
})

UpcomingReminders.displayName = "UpcomingReminders"

export default UpcomingReminders
