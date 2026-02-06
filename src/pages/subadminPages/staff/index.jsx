import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Users, Search, Filter, Plus, PieChart, ShieldCheck } from "lucide-react";
import ReusableFilter from "../../../components/ReusableFilter";
import ReusableTable from "../../../components/ReusableTable";
import ReusablePagination from "../../../components/ReusablePagination";
import SubadminAddStaff from "./features/SubadminAddStaff";
import StaffDetailsModal from "../../mealAdminPages/staff/features/StaffDetailsModal";
import ConfirmModal from "../../../components/ConfirmModal";
import PageLoading from "../../../components/PageLoading";
import {
    useGetAdminUsersQuery,
    useActivateStaffMutation,
    useDeactivateStaffMutation,
    useUpdateStaffMutation,
    useCreateStaffMutation,
    useDeleteUserMutation
} from "../../../services/admin/adminApi";
import toast from "react-hot-toast";

const SubadminStaff = () => {
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedRow, setSelectedRow] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [isFilterLoading, setIsFilterLoading] = useState(false);

    const [modalState, setModalState] = useState({
        isOpen: false,
        mode: "view",
        staff: null,
    });
    const [addStaffModalOpen, setAddStaffModalOpen] = useState(false);
    const [deleteConfirmState, setDeleteConfirmState] = useState({
        isOpen: false,
        staff: null,
    });

    const [filters, setFilters] = useState({
        status: {
            key: "status",
            label: "All Statuses",
            selectedValue: "All Statuses",
            options: [
                { value: "All Statuses", label: "All Statuses" },
                { value: "Active", label: "Active" },
                { value: "Inactive", label: "Inactive" },
            ],
        },
    });

    // Query params - filtered by role 'staff'
    const queryParams = useMemo(() => ({
        page: currentPage,
        limit: 10,
        role: "staff", // Subadmin only manages staff
        ...(searchQuery && { q: searchQuery }),
        ...(filters.status.selectedValue !== "All Statuses" && {
            active: filters.status.selectedValue === "Active"
        }),
    }), [currentPage, searchQuery, filters]);

    const {
        data: usersResponse,
        error,
        isLoading,
        refetch
    } = useGetAdminUsersQuery(queryParams);

    const [createStaff, { isLoading: isCreating }] = useCreateStaffMutation();
    const [deleteUser] = useDeleteUserMutation();
    const [activateStaff] = useActivateStaffMutation();
    const [deactivateStaff] = useDeactivateStaffMutation();
    const [updateStaff, { isLoading: isUpdating }] = useUpdateStaffMutation();

    const handleAddStaff = async (newStaff) => {
        try {
            await createStaff({
                ...newStaff,
                confirmPassword: newStaff.password,
            }).unwrap();

            toast.success("Staff member created successfully!");
            setAddStaffModalOpen(false);
            refetch();
        } catch (err) {
            toast.error(err?.data?.message || "Failed to create staff member");
        }
    };

    const transformApiData = (users) => {
        if (!Array.isArray(users)) return [];
        return users.map(user => ({
            id: user.id,
            _id: user.id,
            name: user.name || 'N/A',
            email: user.email,
            role: "Staff",
            status: user.isActive ? 'Active' : 'Inactive',
            createdAt: user.createdAt
        }));
    };

    const staffData = useMemo(() => transformApiData(usersResponse?.data?.users), [usersResponse]);
    const totalItems = usersResponse?.data?.total || 0;
    const totalPages = Math.ceil(totalItems / 10);

    const columns = [
        { key: "name", label: "Staff Member" },
        { key: "email", label: "Email" },
        { key: "status", label: "Status" },
        { key: "createdAt", label: "Added On" },
        { key: "actions", label: "", className: "w-16" },
    ];

    return (
        <div className="p-4 lg:p-8 space-y-8 pb-24 lg:pb-8">
            {/* Header with Stats */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h2 className="text-3xl font-black text-white tracking-tight">Staff Management</h2>
                    <p className="text-gray-400 mt-1">Manage and monitor your assigned staff team.</p>
                </div>

                <button
                    onClick={() => setAddStaffModalOpen(true)}
                    className="bg-gradient-to-r from-[#9945FF] to-[#14F195] rounded-2xl text-white px-8 py-4 font-black hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3 shadow-xl shadow-[#14F19522] uppercase tracking-tighter"
                >
                    <Plus size={20} strokeWidth={3} />
                    Add Staff Member
                </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-[#121B36] p-6 rounded-[24px] border border-[#FFFFFF0D] flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center">
                        <Users className="text-blue-400" size={24} />
                    </div>
                    <div>
                        <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">Total Team</p>
                        <p className="text-2xl font-black text-white">{totalItems}</p>
                    </div>
                </div>
                <div className="bg-[#121B36] p-6 rounded-[24px] border border-[#FFFFFF0D] flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-[#14F1951A] flex items-center justify-center">
                        <ShieldCheck className="text-[#14F195]" size={24} />
                    </div>
                    <div>
                        <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">Active Now</p>
                        <p className="text-2xl font-black text-white">{staffData.filter(s => s.status === 'Active').length}</p>
                    </div>
                </div>
            </div>

            {/* Main Content Card */}
            <div className="bg-[#121B36] rounded-[32px] border border-[#FFFFFF0D] shadow-2xl overflow-hidden backdrop-blur-xl">
                <div className="p-6 border-b border-[#FFFFFF0D]">
                    <ReusableFilter
                        filters={Object.values(filters)}
                        onFilterChange={(key, val) => setFilters(prev => ({ ...prev, [key]: { ...prev[key], selectedValue: val } }))}
                        searchPlaceholder="Search by name or email..."
                        onSearchChange={setSearchQuery}
                        searchValue={searchQuery}
                    />
                </div>

                <div className="sm:p-4 mt-2">
                    {isLoading ? (
                        <div className="py-20 flex justify-center">
                            <PageLoading message="Updating staff list..." />
                        </div>
                    ) : staffData.length > 0 ? (
                        <ReusableTable
                            columns={columns}
                            data={staffData}
                            onRowClick={(row) => setSelectedRow(selectedRow === row.id ? null : row.id)}
                            selectedRow={selectedRow}
                            actions={true}
                            onView={(s) => setModalState({ isOpen: true, mode: "view", staff: s })}
                            onEdit={(s) => setModalState({ isOpen: true, mode: "edit", staff: s })}
                            onDelete={(s) => setDeleteConfirmState({ isOpen: true, staff: s })}
                            onStatusChange={async (row, status) => {
                                try {
                                    const id = row._id || row.id;
                                    if (status === 'active') await activateStaff(id).unwrap();
                                    else await deactivateStaff(id).unwrap();
                                    toast.success(`Staff ${status} successfully`);
                                } catch (err) {
                                    toast.error("Status update failed");
                                }
                            }}
                            tableType="staff"
                        />
                    ) : (
                        <div className="text-center py-20">
                            <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Users className="text-gray-600" size={32} />
                            </div>
                            <p className="text-gray-400 font-bold text-lg">No staff found</p>
                            <p className="text-gray-500 text-sm">Add your first staff member to get started.</p>
                        </div>
                    )}
                </div>

                <div className="p-6 border-t border-[#FFFFFF0D]">
                    <ReusablePagination
                        currentPage={currentPage}
                        totalPages={totalPages || 1}
                        onPageChange={setCurrentPage}
                        totalItems={totalItems}
                        itemsPerPage={10}
                    />
                </div>
            </div>

            <SubadminAddStaff
                isOpen={addStaffModalOpen}
                onClose={() => setAddStaffModalOpen(false)}
                onAddStaff={handleAddStaff}
                isLoading={isCreating}
            />

            {modalState.isOpen && (
                <StaffDetailsModal
                    isOpen={modalState.isOpen}
                    onClose={() => setModalState({ ...modalState, isOpen: false })}
                    staff={modalState.staff}
                    mode={modalState.mode}
                    onSave={async (updated) => {
                        try {
                            await updateStaff({ staffId: updated.id, staffData: updated }).unwrap();
                            toast.success("Staff updated");
                            setModalState({ ...modalState, isOpen: false });
                        } catch (err) {
                            toast.error("Update failed");
                        }
                    }}
                    isSaving={isUpdating}
                />
            )}

            <ConfirmModal
                isOpen={deleteConfirmState.isOpen}
                onClose={() => setDeleteConfirmState({ isOpen: false, staff: null })}
                onConfirm={async () => {
                    try {
                        await deleteUser(deleteConfirmState.staff.id).unwrap();
                        toast.success("Staff deleted");
                        setDeleteConfirmState({ isOpen: false, staff: null });
                    } catch (err) {
                        toast.error("Delete failed");
                    }
                }}
                title="Delete Staff?"
                itemName={deleteConfirmState.staff?.name}
                type="delete"
            />
        </div>
    );
};

export default SubadminStaff;
