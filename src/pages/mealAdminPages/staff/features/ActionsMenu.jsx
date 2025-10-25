import React from "react";
import { Eye, Edit, Trash2 } from "lucide-react";

const ActionsMenu = ({
  isOpen,
  onClose,
  onView,
  onEdit,
  onDelete,
  position = "bottom",
  rowData = null,
}) => {
  console.log("ActionsMenu props:", {
    isOpen,
    onView,
    onEdit,
    onDelete,
    rowData,
  });

  if (!isOpen) return null;

  const handleViewClick = () => {
    console.log("View clicked, calling onView with:", rowData);
    onView(rowData);
    onClose();
  };

  const handleEditClick = () => {
    console.log("Edit clicked, calling onEdit with:", rowData);
    onEdit(rowData);
    onClose();
  };

  const handleDeleteClick = () => {
    console.log("Delete clicked, calling onDelete with:", rowData);
    onDelete(rowData);
    onClose();
  };

  return (
    <div
      className={`absolute z-50 w-32 bg-[#060B27] border border-[#3A3A4E] rounded-lg shadow-xl py-1 ${
        position === "top" ? "bottom-full mb-2" : "top-full mt-2"
      } right-0`}
    >
      <button
        onClick={handleViewClick}
        className="w-full flex items-center gap-2 px-3 py-2 text-xs text-white hover:bg-[#3A3A4E] transition-colors"
      >
        <Eye className="w-4 h-4" />
        View
      </button>

      <button
        onClick={handleEditClick}
        className="w-full flex items-center gap-2 px-3 py-2 text-xs text-white hover:bg-[#3A3A4E] transition-colors"
      >
        <Edit className="w-4 h-4" />
        Edit
      </button>

      <button
        onClick={handleDeleteClick}
        className="w-full flex items-center gap-2 px-3 py-2 text-xs text-white hover:bg-[#3A3A4E] transition-colors"
      >
        <Trash2 className="w-4 h-4" />
        Delete
      </button>
    </div>
  );
};

export default ActionsMenu;
