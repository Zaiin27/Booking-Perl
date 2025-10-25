import React from "react"

export const DocumentItem = React.memo(({ document }) => {
    const { name, documentType,type, company, urgency } = document

    return (
        <div className="pb-3">
            <div className="flex justify-between items-center">
                <div>
                    <p className="font-semibold font-nunito text-primary text-sm">{name}</p>
                    <p className="text-xs text-gray-800">
                        {documentType ? documentType : type} {company && `- ${company}`}
                    </p>
                </div>
                <span
                    className={`text-xs px-3 py-1 rounded ${(urgency === "Urgent" || urgency === "Expired") ? "text-[#E96666] bg-[#E96666]/10" : "text-tint bg-[#68CFF730]"
                        }`}
                >
                    {urgency}
                </span>
            </div>
        </div>
    )
})

DocumentItem.displayName = "DocumentItem"