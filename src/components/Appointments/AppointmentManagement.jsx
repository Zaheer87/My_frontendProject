// src/components/Appointments/AppointmentManagement.jsx
import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import CreateAppointment from './CreateAppointment';
import AppointmentList from './AppointmentList';
import AppointmentDetails from './AppointmentDetails';
import RescheduleAppointment from './RescheduleAppointment';

const AppointmentManagement = () => {
  const [activeView, setActiveView] = useState('list');

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <nav className="flex gap-4">
          <button
            onClick={() => setActiveView('list')}
            className={`px-4 py-2 rounded-md ${
              activeView === 'list'
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-200 text-gray-700'
            }`}
          >
            Appointments List
          </button>
          <button
            onClick={() => setActiveView('create')}
            className={`px-4 py-2 rounded-md ${
              activeView === 'create'
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-200 text-gray-700'
            }`}
          >
            Create Appointment
          </button>
        </nav>
      </div>

      <div className="bg-white rounded-lg shadow">
        {activeView === 'list' && <AppointmentList />}
        {activeView === 'create' && <CreateAppointment />}
      </div>

      {/* Modal for appointment details and rescheduling */}
      <Routes>
        <Route path="/appointments/:appointmentId" element={<AppointmentDetails />} />
        <Route path="/appointments/:appointmentId/reschedule" element={<RescheduleAppointment />} />
      </Routes>
    </div>
  );
};

export default AppointmentManagement;