import React, { useState, useEffect } from "react";
import { useGetContactMessagesQuery } from "../../services/Api";
import ReusableTable from "../../components/ReusableTable";
import { FiMail, FiUser, FiCalendar, FiMessageSquare, FiInfo } from "react-icons/fi";
import dateFormat from "dateformat";

const AdminContactMessages = () => {
    const { data, isLoading, refetch } = useGetContactMessagesQuery();
    const [messages, setMessages] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        if (data?.success) {
            setMessages(data.data);
        }
    }, [data]);

    const filteredMessages = messages.filter(msg =>
        msg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        msg.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        msg.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        msg.message.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const columns = [
        {
            key: "name",
            label: "Sender Info",
            render: (row) => (
                <div className="flex flex-col">
                    <span className="font-bold text-white flex items-center gap-2">
                        <FiUser className="text-booking-blue" /> {row.name}
                    </span>
                    <span className="text-xs text-[#AEB9E1] flex items-center gap-2">
                        <FiMail className="text-gray-400" /> {row.email}
                    </span>
                </div>
            )
        },
        {
            key: "subject",
            label: "Subject",
            render: (row) => (
                <div className="flex flex-col max-w-[200px]">
                    <span className="text-white font-medium truncate">{row.subject || "No Subject"}</span>
                    <div className="flex items-center gap-1">
                        <span className={`text-[10px] px-2 py-0.5 rounded-full ${row.status === 'unread' ? 'bg-red-500/20 text-red-500' : 'bg-green-500/20 text-green-500'
                            }`}>
                            {row.status.toUpperCase()}
                        </span>
                    </div>
                </div>
            )
        },
        {
            key: "message",
            label: "Message Snippet",
            render: (row) => (
                <div className="max-w-[400px]">
                    <p className="text-[#AEB9E1] text-sm line-clamp-2 italic">
                        "{row.message}"
                    </p>
                </div>
            )
        },
        {
            key: "createdAt",
            label: "Received At",
            render: (row) => (
                <div className="flex flex-col text-xs text-[#AEB9E1]">
                    <span className="flex items-center gap-2">
                        <FiCalendar /> {dateFormat(row.createdAt, "mmm d, yyyy")}
                    </span>
                    <span>{dateFormat(row.createdAt, "h:MM TT")}</span>
                </div>
            )
        },
        {
            key: "actions",
            label: "Actions",
            render: (row) => (
                <button
                    onClick={() => alert(`Full Message:\n\n${row.message}`)}
                    className="p-2 bg-booking-blue/20 text-booking-blue rounded-lg hover:bg-booking-blue hover:text-white transition-all shadow-lg"
                    title="View Full Message"
                >
                    <FiMessageSquare size={18} />
                </button>
            )
        }
    ];

    return (
        <div className="p-4 lg:p-6 pb-24 lg:pb-6 bg-[#0A1330] min-h-screen">
            <div className="max-w-7xl mx-auto">
                {/* Header Section */}
                <div className="flex flex-col gap-1 mb-8">
                    <h1 className="text-2xl sm:text-3xl font-bold text-white px-1 mt-2">Contact Inquiries</h1>
                    <p className="text-[#AEB9E1] px-1 text-sm opacity-60">Manage and respond to guest messages efficiently.</p>
                </div>

                {/* Stats Row - Premium Mobile Layout */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                    <div className="bg-[#121B36] border border-[#FFFFFF0D] p-5 rounded-[24px] shadow-xl relative overflow-hidden group">
                        <div className="absolute -right-4 -top-4 w-20 h-20 bg-blue-500/10 rounded-full blur-2xl group-hover:bg-blue-500/20 transition-all"></div>
                        <p className="text-[#AEB9E1]/40 text-[10px] font-bold uppercase tracking-widest mb-1 relative z-10">Total Inquiries</p>
                        <h3 className="text-3xl font-bold text-white relative z-10">{messages.length}</h3>
                    </div>
                    <div className="bg-[#121B36] border border-[#FFFFFF0D] p-5 rounded-[24px] shadow-xl relative overflow-hidden group">
                        <div className="absolute -right-4 -top-4 w-20 h-20 bg-red-500/10 rounded-full blur-2xl group-hover:bg-red-500/20 transition-all"></div>
                        <p className="text-[#AEB9E1]/40 text-[10px] font-bold uppercase tracking-widest mb-1 relative z-10">Pending Response</p>
                        <h3 className="text-3xl font-bold text-red-500 relative z-10">{messages.filter(m => m.status === 'unread').length}</h3>
                    </div>
                    <div className="bg-[#121B36] border border-[#FFFFFF0D] p-5 rounded-[24px] shadow-xl relative overflow-hidden group">
                        <div className="absolute -right-4 -top-4 w-20 h-20 bg-green-500/10 rounded-full blur-2xl group-hover:bg-green-500/20 transition-all"></div>
                        <p className="text-[#AEB9E1]/40 text-[10px] font-bold uppercase tracking-widest mb-1 relative z-10">Avg. Response Time</p>
                        <h3 className="text-3xl font-bold text-[#14F195] relative z-10">&lt; 2h</h3>
                    </div>
                </div>

                {/* Main Content Card */}
                <div className="bg-[#121B36] rounded-[32px] border border-[#FFFFFF0D] shadow-2xl overflow-hidden">
                    {/* Search Area */}
                    <div className="p-6 pb-2">
                        <div className="relative group max-w-md">
                            <FiInfo className="absolute left-4 top-1/2 -translate-y-1/2 text-[#AEB9E1]/40 group-focus-within:text-[#14F195] transition-colors z-10" />
                            <input
                                type="text"
                                placeholder="Search sender or content..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full bg-[#171D41] border border-[#FFFFFF0D] text-white pl-12 pr-4 py-3 rounded-2xl focus:ring-2 focus:ring-[#14F195/30] outline-none transition-all shadow-lg"
                            />
                        </div>
                    </div>

                    {/* Table Area */}
                    <div className="p-0 sm:p-4">
                        <ReusableTable
                            columns={columns}
                            data={filteredMessages}
                            isLoading={isLoading}
                            tableType="contacts"
                        />
                    </div>

                    {!isLoading && filteredMessages.length === 0 && (
                        <div className="py-20 text-center space-y-4 px-6">
                            <div className="w-20 h-20 bg-[#0A1330] rounded-full flex items-center justify-center mx-auto border border-[#FFFFFF0D]">
                                <FiMail className="text-gray-600 text-3xl opacity-40" />
                            </div>
                            <div>
                                <h3 className="text-white font-bold text-lg">No Results Found</h3>
                                <p className="text-[#AEB9E1] text-sm max-w-xs mx-auto">Try adjusting your search terms to find what you're looking for.</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminContactMessages;
