export function getExpirationStatus(expirationDateStr, thresholdDays = 20) {
    if (!expirationDateStr || typeof expirationDateStr !== 'string') return null;

    const expirationDate = new Date(expirationDateStr);
    const today = new Date();

    // Check if the date is invalid
    if (isNaN(expirationDate.getTime())) {
        console.warn('Invalid expiration date:', expirationDateStr);
        return null;
    }

    // Normalize today to midnight (remove time for fair comparison)
    today.setHours(0, 0, 0, 0);
    expirationDate.setHours(0, 0, 0, 0);

    const timeDiff = expirationDate.getTime() - today.getTime();
    const daysLeft = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

    if (daysLeft < 0) return { status: 'expired', daysLeft };
    if (daysLeft <= thresholdDays) return { status: 'expiringSoon', daysLeft };
    return { status: 'valid', daysLeft };
}

export const getTimeAgo = (dateInput) => {
    if (!dateInput) return null;

    const date = new Date(dateInput);
    if (isNaN(date.getTime())) return null; // invalid date

    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 0) return "just now"; // future date

    if (diffInSeconds < 60) return "just now";

    const minutes = Math.floor(diffInSeconds / 60);
    if (minutes < 60) return `${minutes} minute${minutes !== 1 ? "s" : ""} ago`;

    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hour${hours !== 1 ? "s" : ""} ago`;

    const days = Math.floor(hours / 24);
    if (days < 30) return `${days} day${days !== 1 ? "s" : ""} ago`;

    const months = Math.floor(days / 30);
    if (months < 12) return `${months} month${months !== 1 ? "s" : ""} ago`;

    const years = Math.floor(months / 12);
    return `${years} year${years !== 1 ? "s" : ""} ago`;
};

export const getRemainingDaysLabel = (dateInput) => {
    if (!dateInput) return "--";

    const today = new Date();
    const target = new Date(dateInput);

    // Strip time for accurate day comparison
    const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const startOfTarget = new Date(target.getFullYear(), target.getMonth(), target.getDate());

    const diffInMs = startOfTarget.getTime() - startOfToday.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInDays < 0) return "Expired";
    if (diffInDays === 0) return "Today";
    if (diffInDays === 1) return "Tomorrow";
    return `${diffInDays} Days Remaining`;
};

