export const strongPasswordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d\s\.\-_!@#$%^&*()+=]{8,}$/;

export const getStatusColorClass = (status) => {
  switch (status) {
    case "ACTIVE":
      return "bg-[#0370B185]/50 text-white";
    case "PENDING":
      return "bg-yellow-100 text-yellow-600";
    case "INACTIVE":
      return "bg-gray-300 text-gray-600";
    default:
      return "bg-red-100 text-gray-600";
  }
};
