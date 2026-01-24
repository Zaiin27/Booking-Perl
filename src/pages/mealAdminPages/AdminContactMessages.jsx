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
        <div className="p-4 lg:p-8 bg-[#0A1330] min-h-screen">
            <div className="max-w-7xl mx-auto space-y-8">

                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="space-y-2">
                        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                            <div className="w-10 h-10 bg-booking-blue rounded-xl flex items-center justify-center shadow-lg shadow-booking-blue/20">
                                <FiMail className="text-white" />
                            </div>
                            Contact Inquiries
                        </h1>
                        <p className="text-[#AEB9E1] font-poppins">Manage and respond to guest inquiries from the contact page.</p>
                    </div>

                    <div className="relative group min-w-[300px]">
                        <input
                            type="text"
                            placeholder="Search by name, email or content..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-[#171D41] border border-[#3A3A4E] text-white pl-12 pr-4 py-3 rounded-2xl focus:ring-2 focus:ring-booking-blue/50 outline-none transition-all group-hover:border-booking-blue/50"
                        />
                        <FiInfo className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-booking-blue transition-colors" />
                    </div>
                </div>

                {/* Stats Cards Row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-[#171D41] border border-[#3A3A4E] p-6 rounded-[2rem] shadow-xl">
                        <p className="text-[#AEB9E1] text-xs font-bold uppercase tracking-wider mb-2">Total Inquiries</p>
                        <h3 className="text-4xl font-bold text-white">{messages.length}</h3>
                    </div>
                    <div className="bg-[#171D41] border border-[#3A3A4E] p-6 rounded-[2rem] shadow-xl">
                        <p className="text-[#AEB9E1] text-xs font-bold uppercase tracking-wider mb-2">Unread messages</p>
                        <h3 className="text-4xl font-bold text-red-500">{messages.filter(m => m.status === 'unread').length}</h3>
                    </div>
                    <div className="bg-[#171D41] border border-[#3A3A4E] p-6 rounded-[2rem] shadow-xl">
                        <p className="text-[#AEB9E1] text-xs font-bold uppercase tracking-wider mb-2">Growth</p>
                        <h3 className="text-4xl font-bold text-green-500">+12%</h3>
                    </div>
                </div>

                {/* Table Container */}
                <div className="bg-[#171D41] rounded-[2.5rem] shadow-2xl border border-[#3A3A4E] overflow-hidden">
                    <div className="p-2 lg:p-6">
                        <ReusableTable
                            columns={columns}
                            data={filteredMessages}
                            isLoading={isLoading}
                            tableType="contacts"
                        />
                    </div>

                    {!isLoading && filteredMessages.length === 0 && (
                        <div className="py-20 text-center space-y-4">
                            <div className="w-20 h-20 bg-[#0A1330] rounded-full flex items-center justify-center mx-auto border border-[#3A3A4E]">
                                <FiMail className="text-gray-600 text-3xl text-booking-blue" />
                            </div>
                            <p className="text-[#AEB9E1] font-medium italic">No inquiries found matching your criteria.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminContactMessages;
