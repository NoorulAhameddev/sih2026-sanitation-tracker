import api from './axios';

/**
 * Waste Collection Worker Attendance & Route Register API.
 * Communicates strictly via Axios to Express + SQLite backend.
 */

export const getAttendance = (params = {}) => {
  const query = {};
  if (params.ward) query.ward = params.ward;
  if (params.covered) query.covered = params.covered;
  if (params.date) query.date = params.date;
  if (params.search) query.q = params.search;
  if (params.limit) query.limit = params.limit;
  if (params.offset) query.offset = params.offset;

  return api.get('/attendance', { params: query });
};

export const getAttendanceById = (id) => {
  return api.get(`/attendance/${id}`);
};

export const createAttendance = (data) => {
  return api.post('/attendance', data);
};

export const updateAttendance = (id, data) => {
  return api.put(`/attendance/${id}`, data);
};

export const deleteAttendance = (id) => {
  return api.delete(`/attendance/${id}`);
};
