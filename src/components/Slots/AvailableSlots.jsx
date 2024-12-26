// src/components/Slots/AvailableSlots.jsx
import React, { useState, useEffect } from 'react';
import { findAvailableSlots, findNextAvailableSlots } from '../../services/api';

const AvailableSlots = ({ doctorId }) => {
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [dateRange, setDateRange] = useState({
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  });
  const [showNextAvailable, setShowNextAvailable] = useState(false);

  useEffect(() => {
    fetchSlots();
  }, [doctorId, dateRange, showNextAvailable]);

  const fetchSlots = async () => {
    setLoading(true);
    try {
      let response;
      if (showNextAvailable) {
        response = await findNextAvailableSlots(
          doctorId,
          5, // number of slots to fetch
          dateRange.startDate
        );
      } else {
        response = await findAvailableSlots(
          doctorId,
          dateRange.startDate,
          dateRange.endDate
        );
      }
      setSlots(response.data);
      setError('');
    } catch (err) {
      setError('Failed to fetch available slots');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Available Slots</h2>
        <button
          onClick={() => setShowNextAvailable(!showNextAvailable)}
          className="px-4 py-2 bg-indigo-100 text-indigo-700 rounded-md hover:bg-indigo-200"
        >
          {showNextAvailable ? 'Show All Slots' : 'Show Next Available'}
        </button>
      </div>

      {!showNextAvailable && (
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
      )}

      {loading ? (
        <div className="text-center py-4">Loading...</div>
      ) : error ? (
        <div className="text-red-600 py-4">{error}</div>
      ) : slots.length === 0 ? (
        <div className="text-gray-500 py-4">No available slots found.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {slots.map((slot) => (
            <div
              key={slot._id}
              className="border rounded-lg p-4 hover:bg-gray-50"
            >
              <div className="font-semibold">{new Date(slot.date).toLocaleDateString()}</div>
              <div className="text-gray-600">
                {slot.startTime} - {slot.endTime}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AvailableSlots;