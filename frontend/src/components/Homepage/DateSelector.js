import React, { useState, useEffect } from 'react';
import './DateSelector.css';

const DateSelector = ({ onDateSelect }) => {
    const [selectedDate, setSelectedDate] = useState(null);
    const [currentWeek, setCurrentWeek] = useState([]);
    const [weekLabel, setWeekLabel] = useState('');

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

    // Format week label (e.g., "Tuần 51 - 2024")
    const formatWeekLabel = (date) => {
        const weekNumber = Math.ceil((date.getDate() - date.getDay() + 1) / 7);
        const year = date.getFullYear();
        const month = date.toLocaleString('vi-VN', { month: 'long' }); // Get month name in Vietnamese
        return `${month} - Tuần ${weekNumber} - ${year}`;
    };

    // Initialize current week
    useEffect(() => {
        const today = new Date();
        const week = getWeekDates(today);
        setCurrentWeek(week);
        setWeekLabel(formatWeekLabel(today));
    }, []);

    // Navigate to previous/next week
    const navigateWeek = (direction) => {
        const firstDay = new Date(currentWeek[0]);
        firstDay.setDate(firstDay.getDate() + (direction * 7));
        const newWeek = getWeekDates(firstDay);
        setCurrentWeek(newWeek);
        setWeekLabel(formatWeekLabel(firstDay));
    };

    // Format day display
    const formatDayDisplay = (date) => {
        const days = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];
        return {
            dayName: days[date.getDay() === 0 ? 6 : date.getDay() - 1],
            dayNumber: date.getDate()
        };
    };

    return (
        <div className="date-selector">
            <div className="week-navigator">
                <button onClick={() => navigateWeek(-1)}>&lt;</button>
                <span>{weekLabel}</span>
                <button onClick={() => navigateWeek(1)}>&gt;</button>
            </div>
            <div className="days-grid">
                {currentWeek.map((date, index) => {
                    const { dayName, dayNumber } = formatDayDisplay(date);
                    const isSelected = selectedDate && 
                        date.toDateString() === selectedDate.toDateString();

                    return (
                        <div 
                            key={index}
                            className={`day-cell ${isSelected ? 'selected' : ''}`}
                            onClick={() => {
                                setSelectedDate(date);
                                onDateSelect(date);
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
