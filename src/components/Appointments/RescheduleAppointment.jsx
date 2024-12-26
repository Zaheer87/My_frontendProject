// src/components/Appointments/RescheduleAppointment.jsx
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { rescheduleAppointment, checkAvailability } from '../../services/api';

const RescheduleAppointment = ({ appointmentId, onRescheduleSuccess }) => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  const onSubmit = async (data) => {
    setIsLoading(true);
    setMessage('');

    try {
      // Check if new slot is available
      const isAvailable = await checkAvailability({
        doctorId: data.doctorId,
        date: data.date,
        startTime: data.startTime,
        endTime: data.endTime
      });

      if (!isAvailable) {
        setMessage('This slot is not available. Please choose another time.');
        return;
      }

      // Reschedule appointment
      await rescheduleAppointment(appointmentId, {
        newSlot: {
          date: data.date,
          startTime: data.startTime,
          endTime: data.endTime
        }
      });

      setMessage('Appointment rescheduled successfully!');
      if (onRescheduleSuccess) onRescheduleSuccess();
    } catch (error) {
      setMessage(error.response?.data?.message || 'Error rescheduling appointment');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Reschedule Appointment</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">New Date</label>
          <input
            type="date"
            {...register('date', { required: 'Date is required' })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
          {errors.date && (
            <span className="text-red-500 text-sm">{errors.date.message}</span>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">New Start Time</label>
            <input
              type="time"
              {...register('startTime', { required: 'Start time is required' })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
            {errors.startTime && (
              <span className="text-red-500 text-sm">{errors.startTime.message}</span>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">New End Time</label>
            <input
              type="time"
              {...register('endTime', { required: 'End time is required' })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
            {errors.endTime && (
              <span className="text-red-500 text-sm">{errors.endTime.message}</span>
            )}
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
        >
          {isLoading ? 'Rescheduling...' : 'Reschedule Appointment'}
        </button>

        {message && (
          <div className={`mt-4 p-4 rounded-md ${
            message.includes('successfully') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
          }`}>
            {message}
          </div>
        )}
      </form>
    </div>
  );
};

export default RescheduleAppointment;