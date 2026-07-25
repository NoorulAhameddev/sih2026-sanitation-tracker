import axios from 'axios';
import toast from 'react-hot-toast';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    // Network error — no response from server at all
    if (!error.response) {
      if (error.code === 'ECONNABORTED') {
        toast.error('Request timed out. Please check your connection and try again.');
      } else if (error.message === 'Network Error') {
        toast.error('Unable to reach the server. Please check if the backend is running.');
      } else {
        toast.error('An unexpected network error occurred.');
      }
      return Promise.reject(error);
    }

    const { status, data } = error.response;
    const serverMessage = data?.error?.message;

    switch (status) {
      case 400:
        // Validation or bad request — let the calling code handle inline display
        break;
      case 404:
        // Not found — let the calling code handle it
        break;
      case 409:
        // Duplicate record — let the mutation onError handle the toast
        break;
      case 422:
        toast.error(serverMessage || 'Validation failed. Please check your input.');
        break;
      case 500:
        toast.error('Internal server error. Please try again later.');
        break;
      default:
        toast.error(serverMessage || `Unexpected error (${status}).`);
    }

    return Promise.reject(error);
  }
);

export default api;
