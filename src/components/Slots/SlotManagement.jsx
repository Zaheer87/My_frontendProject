// src/components/Slots/SlotManagement.jsx
import React from 'react';
import CreateSlots from './CreateSlots';
import AvailableSlots from './AvailableSlots';
import DoctorSchedule from './DoctorSchedule';

const SlotManagement = ({ doctorId }) => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 gap-8">
        <CreateSlots
          doctorId={doctorId}
          onSuccess={() => {
            // Refresh other components if needed
          }}
        />
        <AvailableSlots doctorId={doctorId} />
        <DoctorSchedule doctorId={doctorId} />
      </div>
    </div>
  );
};

export default SlotManagement;