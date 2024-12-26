// src/components/Appointments/CreateAppointment.jsx
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { createAppointment, checkAvailability } from '../../services/api';

const CreateAppointment = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  const checkSlotAvailability = async (data) => {
    try {
      const response = await checkAvailability(data);
      return response.data.available;
    } catch (error) {
      console.error('Error checking availability:', error);
      return false;
    }
  };

  const onSubmit = async (data) => {
    setIsLoading(true);
    setMessage('');

    try {
      // First check if slot is available
      const isAvailable = await checkSlotAvailability(data);
      
      if (!isAvailable) {
        setMessage('This slot is not available. Please choose another time.');
        return;
      }

      // If available, create appointment
      const response = await createAppointment(data);
      setMessage('Appointment created successfully!');
    } catch (error) {
      setMessage(error.response?.data?.message || 'Error creating appointment');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Create New Appointment</h2>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Doctor</label>
          <input
            type="text"
            {...register('doctorId', { required: 'Doctor ID is required' })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            placeholder="Enter doctor ID"
          />
          {errors.doctorId && (
            <span className="text-red-500 text-sm">{errors.doctorId.message}</span>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Patient</label>
          <input
            type="text"
            {...register('patientId', { required: 'Patient ID is required' })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            placeholder="Enter patient ID"
          />
          {errors.patientId && (
            <span className="text-red-500 text-sm">{errors.patientId.message}</span>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Date</label>
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
            <label className="block text-sm font-medium text-gray-700">Start Time</label>
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
            <label className="block text-sm font-medium text-gray-700">End Time</label>
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
          {isLoading ? 'Creating...' : 'Create Appointment'}
        </button>

        {message && (
          <div className={`mt-4 p-3 rounded ${message.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
            {message}
          </div>
        )}
      </form>
    </div>
  );
};

export default CreateAppointment;