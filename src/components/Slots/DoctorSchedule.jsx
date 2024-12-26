// src/components/Slots/DoctorSchedule.jsx
import React, { useState, useEffect } from 'react';
import { getDoctorSchedule, releaseSlot } from '../../services/api';

const DoctorSchedule = ({ doctorId }) => {
  const [schedule, setSchedule] = useState([]);
  const [dateRange, setDateRange] = useState({
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchSchedule();
  }, [doctorId, dateRange]);

  const fetchSchedule = async () => {
    setLoading(true);
    try {
      const response = await getDoctorSchedule(
        doctorId,
        dateRange.startDate,
        dateRange.endDate
      );
      setSchedule(response.data);
      setError('');
    } catch (err) {
      setError('Failed to fetch schedule');
    } finally {
      setLoading(false);
    }
  };

  const handleReleaseSlot = async (slotId) => {
    try {
      await releaseSlot(slotId);
      fetchSchedule(); // Refresh the schedule
    } catch (err) {
      setError('Failed to release slot');
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Doctor's Schedule</h2>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Start Date</label>
          <input
            type="date"
            value={dateRange.startDate}
            onChange={(e) => setDateRange(prev => ({ ...prev, startDate: e.target.value }))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">End Date</label>
          <input
            type="date"
            value={dateRange.endDate}
            onChange={(e) => setDateRange(prev => ({ ...prev, endDate: e.target.value }))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
      </div>

      {loading ? (
        <div className="text-center py-4">Loading...</div>
      ) : error ? (
        <div className="text-red-600 py-4">{error}</div>
      ) : schedule.length === 0 ? (
        <div className="text-gray-500 py-4">No schedule found for selected dates.</div>
      ) : (
        <div className="grid gap-4">
          {schedule.map((day) => (
            <div key={day.date} className="border rounded-lg p-4">
              <h3 className="font-semibold mb-2">
                {new Date(day.date).toLocaleDateString()}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {day.slots.map((slot) => (
                  <div
                    key={slot._id}
                    className={`rounded-lg p-3 ${
                      slot.isBooked
                        ? 'bg-red-50 text-red-700'
                        : 'bg-green-50 text-green-700'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span>
                        {slot.startTime} - {slot.endTime}
                      </span>
                      {slot.isBooked && (
                        <button
                          onClick={() => handleReleaseSlot(slot._id)}
                          className="text-sm bg-red-100 px-2 py-1 rounded hover:bg-red-200"
                        >
                          Release
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DoctorSchedule;