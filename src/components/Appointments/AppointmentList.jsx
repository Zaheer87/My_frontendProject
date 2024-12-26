// src/components/Appointments/AppointmentList.jsx
import React, { useState, useEffect } from 'react';
import { getDoctorAppointments } from '../../services/api';

const AppointmentList = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dateRange, setDateRange] = useState({
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  });

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const response = await getDoctorAppointments(
        localStorage.getItem('doctorId'),
        dateRange.startDate
      );
      setAppointments(response.data);
    } catch (error) {
      console.error('Error fetching appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, [dateRange]);

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Appointments</h2>
        <div className="flex gap-4">
          <input
            type="date"
            value={dateRange.startDate}
            onChange={(e) => setDateRange(prev => ({ ...prev, startDate: e.target.value }))}
            className="border rounded-md px-3 py-2"
          />
          <input
            type="date"
            value={dateRange.endDate}
            onChange={(e) => setDateRange(prev => ({ ...prev, endDate: e.target.value }))}
            className="border rounded-md px-3 py-2"
          />
        </div>
      </div>

      {loading ? (
        <div className="text-center py-4">Loading appointments...</div>
      ) : (
        <div className="divide-y">
          {appointments.map((appointment) => (
            <div key={appointment._id} className="py-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium text-gray-900">
                    Patient: {appointment.patientName}
                  </h3>
                  <p className="text-gray-600">
                    {new Date(appointment.date).toLocaleDateString()} at{' '}
                    {appointment.startTime}
                  </p>
                </div>
                <div className="flex gap-2">
                  <span
                    className={`px-2 py-1 text-sm rounded ${
                      appointment.status === 'confirmed'
                        ? 'bg-green-100 text-green-800'
                        : appointment.status === 'cancelled'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {appointment.status}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AppointmentList;