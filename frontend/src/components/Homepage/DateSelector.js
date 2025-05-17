import React, { useState, useEffect } from 'react';
import './DateSelector.css';

const DateSelector = ({ onDateSelect }) => {
    const [selectedDate, setSelectedDate] = useState(null);
    const [currentWeek, setCurrentWeek] = useState([]);
    const [monthYearLabel, setMonthYearLabel] = useState('');

    // Get today's date with time set to midnight for accurate comparison
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Get the week dates
    const getWeekDates = (date) => {
        const week = [];
        const monday = new Date(date);
        monday.setDate(monday.getDate() - monday.getDay() + 1); // Get Monday

        for (let i = 0; i < 7; i++) {
            const day = new Date(monday);
            day.setDate(monday.getDate() + i);
            week.push(day);
        }
        return week;
    };

    // Format month and year label (e.g., "Tháng 12 - 2024")
    const formatMonthYearLabel = (date) => {
        const month = date.toLocaleString('vi-VN', { month: 'long' });
        const year = date.getFullYear();
        return `${month} - ${year}`;
    };

    // Initialize current week
    useEffect(() => {
        const week = getWeekDates(today);
        setCurrentWeek(week);
        setMonthYearLabel(formatMonthYearLabel(today));
    }, []);

    // Navigate to previous/next week
    const navigateWeek = (direction) => {
        const firstDay = new Date(currentWeek[0]);
        firstDay.setDate(firstDay.getDate() + (direction * 7));

        // Prevent navigating to past weeks
        if (direction < 0) {
            const lastDayOfNewWeek = new Date(firstDay);
            lastDayOfNewWeek.setDate(firstDay.getDate() + 6);
            if (lastDayOfNewWeek < today) {
                return; // Don't navigate if entire week is in the past
            }
        }

        const newWeek = getWeekDates(firstDay);
        setCurrentWeek(newWeek);
        setMonthYearLabel(formatMonthYearLabel(firstDay));
    };

    // Format day display
    const formatDayDisplay = (date) => {
        const days = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];
        return {
            dayName: days[date.getDay() === 0 ? 6 : date.getDay() - 1],
            dayNumber: date.getDate()
        };
    };

    // Check if a date is in the past
    const isPastDate = (date) => {
        date.setHours(0, 0, 0, 0);
        return date < today;
    };

    return (
        <div className="date-selector">
            <div className="month-navigator">
                <button 
                    onClick={() => navigateWeek(-1)}
                    disabled={currentWeek[6] < today}
                >
                    &lt;
                </button>
                <span>{monthYearLabel}</span>
                <button onClick={() => navigateWeek(1)}>&gt;</button>
            </div>
            <div className="days-grid">
                {currentWeek.map((date, index) => {
                    const { dayName, dayNumber } = formatDayDisplay(date);
                    const isSelected = selectedDate && 
                        date.toDateString() === selectedDate.toDateString();
                    const isPast = isPastDate(new Date(date));

                    return (
                        <div 
                            key={index}
                            className={`day-cell ${isSelected ? 'selected' : ''} 
                                      ${isPast ? 'disabled' : ''}`}
                            onClick={() => {
                                if (!isPast) {
                                    setSelectedDate(date);
                                    onDateSelect(date);
                                }
                            }}
                        >
                            <div className="day-name">{dayName}</div>
                            <div className="day-number">{dayNumber}</div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default DateSelector;
