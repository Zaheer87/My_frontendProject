// src/components/Slots/CreateSlots.jsx
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { createDoctorSlots, bulkCreateSlots } from '../../services/api';

const CreateSlots = ({ doctorId, onSuccess }) => {
  const [isBulkCreate, setIsBulkCreate] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      if (isBulkCreate) {
        await bulkCreateSlots({
          doctorId,
          startDate: data.startDate,
          endDate: data.endDate,
          timeSlots: [{
            startTime: data.startTime,
            endTime: data.endTime
          }]
        });
      } else {
        await createDoctorSlots({
          doctorId,
          date: data.date,
          timeSlots: [{
            startTime: data.startTime,
            endTime: data.endTime
          }]
        });
      }
      setMessage('Slots created successfully!');
      if (onSuccess) onSuccess();
    } catch (error) {
      setMessage(error.response?.data?.message || 'Error creating slots');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Create Time Slots</h2>

      <div className="mb-4">
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={isBulkCreate}
            onChange={(e) => setIsBulkCreate(e.target.checked)}
            className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
          <span className="ml-2">Create slots for multiple days</span>
        </label>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {isBulkCreate ? (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Start Date</label>
              <input
                type="date"
                {...register('startDate', { required: 'Start date is required' })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
              {errors.startDate && (
                <span className="text-red-500 text-sm">{errors.startDate.message}</span>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">End Date</label>
              <input
                type="date"
                {...register('endDate', { required: 'End date is required' })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
              {errors.endDate && (
                <span className="text-red-500 text-sm">{errors.endDate.message}</span>
              )}
            </div>
          </div>
        ) : (
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
        )}

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
          disabled={loading}
          className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
        >
          {loading ? 'Creating...' : 'Create Slots'}
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

export default CreateSlots;