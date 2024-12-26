import axios from 'axios';

// Create an instance of axios
const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL, 
  headers: {
    'Content-Type': 'application/json',
  },
});
// localhost:4000/api/appointments/create
// Appointments API
export const createAppointment = (data) => api.post('/appointments/create', data);
export const checkAvailability = (data) => api.post('/appointments/availability', data);
export const getDoctorAppointments = (doctorId, date) => api.get(`/appointments/doctor/${doctorId}`, { params: { date } });
export const rescheduleAppointment = (appointmentId, data) => api.patch(`/appointments/${appointmentId}/reschedule`, data);
export const cancelAppointment = (appointmentId, data) => api.delete(`/appointments/${appointmentId}`, { data });
export const markAsNoShow = (appointmentId) => api.patch(`/appointments/${appointmentId}/no-show`);

// Slots API
export const createDoctorSlots = (data) => api.post('/slots/create', data);
export const findAvailableSlots = (doctorId, startDate, endDate) => api.get(`/slots/available/${doctorId}`, { params: { startDate, endDate } });
export const bookSlot = (data) => api.post('/slots/book', data);
export const releaseSlot = (slotId) => api.patch(`/slots/release/${slotId}`);
export const findNextAvailableSlots = (doctorId, numberOfSlots, afterDate) => api.get(`/slots/next-available/${doctorId}`, { params: { numberOfSlots, afterDate } });
export const getDoctorSchedule = (doctorId, startDate, endDate) => api.get(`/slots/schedule/${doctorId}`, { params: { startDate, endDate } });
export const checkSlotAvailability = (data) => api.post('/slots/check-availability', data);
export const bulkCreateSlots = (data) => api.post('/slots/bulk-create', data);
export const deleteExpiredSlots = (beforeDate) => api.delete('/slots/expired', { params: { beforeDate } });

export default api;