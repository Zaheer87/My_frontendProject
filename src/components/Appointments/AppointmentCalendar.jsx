// src/components/Appointments/AppointmentCalendar.jsx
import React, { useState, useEffect } from 'react';
import { getDoctorAppointments } from '../../services/api';

const AppointmentCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);

  useEffect(() => {
    fetchAppointments();
  }, [currentDate]);

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const response = await getDoctorAppointments(
        localStorage.getItem('doctorId'),
        currentDate.toISOString().split('T')[0]
      );
      setAppointments(response.data);
    } catch (error) {
      console.error('Error fetching appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const renderCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-24 border border-gray-200"></div>);
    }

    // Add cells for each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      const dayAppointments = appointments.filter(apt => {
        const aptDate = new Date(apt.date);
        return aptDate.getDate() === day;
      });

      days.push(
        <div 
          key={day}
          className={`h-24 border border-gray-200 p-2 cursor-pointer hover:bg-gray-50
            ${selectedDate === day ? 'bg-blue-50' : ''}`}
          onClick={() => setSelectedDate(day)}
        >
          <div className="font-semibold">{day}</div>
          <div className="text-xs space-y-1">
            {dayAppointments.map((apt, index) => (
              <div 
                key={index}
                className="bg-blue-100 p-1 rounded truncate"
                title={`${apt.startTime} - ${apt.endTime}`}
              >
                {apt.startTime}
              </div>
            ))}
          </div>
        </div>
      );
    }

    return days;
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">
          {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
        </h2>
        <div className="flex gap-4">
          <button
            onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() - 1)))}
            className="px-3 py-1 border rounded-md hover:bg-gray-50"
          >
            Previous
          </button>
          <button
            onClick={() => setCurrentDate(new Date())}
            className="px-3 py-1 border rounded-md hover:bg-gray-50"
          >
            Today
          </button>
          <button
            onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + 1)))}
            className="px-3 py-1 border rounded-md hover:bg-gray-50"
          >
            Next
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-px">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="text-center font-semibold py-2">
            {day}
          </div>
        ))}
        {renderCalendarDays()}
      </div>

      {loading && (
        <div className="absolute inset-0 bg-white/50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      )}
    </div>
  );
};

export default AppointmentCalendar;