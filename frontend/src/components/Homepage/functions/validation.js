// Validation functions
export const validateOperatingHours = (start, end) => {
    if (start < 0 || start > 23 || end < 1 || end > 24) {
        return "Operating hours must be between 0-23 for start and 1-24 for end";
    }
    
    if (end <= start) {
        return "End time must be after start time";
    }

    const totalHours = end - start;
    if (totalHours % 2 !== 0) {
        return "Operating hours must be in 2-hour intervals. Please adjust your hours.";
    }

    return null;
};

export const checkOverlap = (newStart, newEnd, existingHours) => {
    return existingHours.some(hours => {
        return (newStart < hours.end_hour && newEnd > hours.start_hour);
    });
}; 