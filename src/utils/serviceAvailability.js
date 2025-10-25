export const getServiceStatus = (siteSettings) => {
  const serviceAvailable = siteSettings?.data?.ServiceAvavailable ?? true;
  const startTime = siteSettings?.data?.startTime;
  const endTime = siteSettings?.data?.endTime;

  if (!serviceAvailable) {
    return {
      isAvailable: false,
      reason: 'toggle',
      message: "We're closed right now, we'll see you tomorrow!",
      showTime: false,
      showHoursLink: true,
      hoursLink: "Visit me.senew-tech.com to check when we're open"
    };
  }

  if (!startTime || !endTime) {
    return {
      isAvailable: true,
      reason: 'available',
      message: null,
      showTime: false
    };
  }

  // Check time-based availability
  const now = new Date();
  const utcTime = now.getUTCHours() * 60 + now.getUTCMinutes();
  
  const [startHour, startMin] = startTime.split(':').map(Number);
  const [endHour, endMin] = endTime.split(':').map(Number);
  
  const startMinutes = startHour * 60 + startMin;
  const endMinutes = endHour * 60 + endMin;
  
  let isInOperatingHours;
  
  // Check if current time is within operating hours
  if (startMinutes > endMinutes) {
    // Handle overnight range (e.g., 22:00 to 06:00)
    isInOperatingHours = utcTime >= startMinutes || utcTime <= endMinutes;
  } else {
    // Normal range (e.g., 09:00 to 22:00)
    isInOperatingHours = utcTime >= startMinutes && utcTime <= endMinutes;
  }

  if (!isInOperatingHours) {
    return {
      isAvailable: false,
      reason: 'time',
      message: "We're closed right now, we'll see you tomorrow!",
      showTime: false,
      showHoursLink: true,
      hoursLink: "Visit me.senew-tech.com to check when we're open"
    };
  }

  return {
    isAvailable: true,
    reason: 'available',
    message: null,
    showTime: false
  };
};

