// src/components/Appointments/AppointmentDetails.jsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getAppointmentDetails, cancelAppointment, markAsNoShow } from '../../services/api';

const AppointmentDetails = () => {
  const { appointmentId } = useParams();
  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cancelReason, setCancelReason] = useState('');
  const [showCancelModal, setShowCancelModal] = useState(false);

  useEffect(() => {
    fetchAppointmentDetails();
  }, [appointmentId]);

  const fetchAppointmentDetails = async () => {
    try {
      const response = await getAppointmentDetails(appointmentId);
      setAppointment(response.data);
    } catch (err) {
      setError('Failed to fetch appointment details');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async () => {
    try {
      await cancelAppointment(appointmentId, { reason: cancelReason });
      fetchAppointmentDetails();
      setShowCancelModal(false);
    } catch (err) {
      setError('Failed to cancel appointment');
    }
  };

  const handleNoShow = async () => {
    try {
      await markAsNoShow(appointmentId);
      fetchAppointmentDetails();
    } catch (err) {
      setError('Failed to mark as no-show');
    }
  };

  if (loading) return <div className="text-center py-4">Loading...</div>;
  if (error) return <div className="text-red-600 py-4">{error}</div>;
  if (!appointment) return <div className="text-center py-4">Appointment not found</div>;

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-2xl font-semibold mb-6">Appointment Details</h2>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium text-gray-500">Patient Name</h3>
            <p className="mt-1 text-sm text-gray-900">{appointment.patientName}</p>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-500">Date & Time</h3>
            <p className="mt-1 text-sm text-gray-900">
              {new Date(appointment.date).toLocaleDateString()} at {appointment.startTime}
            </p>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-500">Status</h3>
            <p className={`mt-1 text-sm ${
              appointment.status === 'confirmed' ? 'text-green-600' :
              appointment.status === 'cancelled' ? 'text-red-600' :
              'text-yellow-600'
            }`}>
              {appointment.status}
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium text-gray-500">Doctor</h3>
            <p className="mt-1 text-sm text-gray-900">{appointment.doctorName}</p>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-500">Duration</h3>
            <p className="mt-1 text-sm text-gray-900">
              {appointment.startTime} - {appointment.endTime}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-8 flex gap-4">
        <button
          onClick={() => setShowCancelModal(true)}
          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          disabled={appointment.status !== 'confirmed'}
        >
          Cancel Appointment
        </button>
        
        <button
          onClick={handleNoShow}
          className="px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700"
          disabled={appointment.status !== 'confirmed'}
        >
          Mark as No-Show
        </button>
      </div>

      {/* Cancel Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-96">
            <h3 className="text-lg font-medium mb-4">Cancel Appointment</h3>
            <textarea
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              className="w-full border rounded-md p-2 mb-4"
              placeholder="Reason for cancellation"
              rows="3"
            />
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowCancelModal(false)}
                className="px-4 py-2 border rounded-md"
              >
                Close
              </button>
              <button
                onClick={handleCancel}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Confirm Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AppointmentDetails;