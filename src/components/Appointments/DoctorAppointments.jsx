// src/components/Appointments/DoctorAppointments.jsx
import React, { useState, useEffect } from 'react';
import { getDoctorAppointments, markAsNoShow, cancelAppointment } from '../../services/api';

const DoctorAppointments = ({ doctorId }) => {
  const [appointments, setAppointments] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchAppointments = async () => {
    setIsLoading(true);
    setError('');
    try {
      const response = await getDoctorAppointments(doctorId, selectedDate);
      setAppointments(response.data);
    } catch (error) {
      setError('Failed to fetch appointments');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (doctorId) {
      fetchAppointments();
    }
  }, [doctorId, selectedDate]);

  const handleNoShow = async (appointmentId) => {
    try {
      await markAsNoShow(appointmentId);
      fetchAppointments(); // Refresh the list
    } catch (error) {
      setError('Failed to mark as no-show');
    }
  };

  const handleCancel = async (appointmentId, reason) => {
    try {
      await cancelAppointment(appointmentId, { reason });
      fetchAppointments(); // Refresh the list
    } catch (error) {
      setError('Failed to cancel appointment');
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-4">Doctor's Appointments</h2>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="border rounded p-2"
        />
      </div>

      {isLoading ? (
        <div className="text-center">Loading appointments...</div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : appointments.length === 0 ? (
        <div className="text-gray-500">No appointments found for this date.</div>
      ) : (
        <div className="space-y-4">
          {appointments.map((appointment) => (
            <div
              key={appointment._id}
              className="border rounded-lg p-4 flex justify-between items-center"
            >
              <div>
                <p className="font-semibold">
                  Time: {appointment.startTime} - {appointment.endTime}
                </p>
                <p>Patient ID: {appointment.patientId}</p>
              </div>
              <div className="space-x-2">
                <button
                  onClick={() => handleNoShow(appointment._id)}
                  className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                >
                  Mark No-Show
                </button>
                <button
                  onClick={() => {
                    const reason = window.prompt('Please enter cancellation reason:');
                    if (reason) handleCancel(appointment._id, reason);
                  }}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                >
                  Cancel
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DoctorAppointments;