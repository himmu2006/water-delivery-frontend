import axios from 'axios';

const API = axios.create({
  baseURL: 'https://water-delivery-backend-ro9b.onrender.com/api',  // Update if your backend URL changes
});

// Add JWT token automatically from localStorage to Authorization header for every request
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Helper to set or remove token in localStorage and axios defaults
export const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem('token', token);
    API.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    localStorage.removeItem('token');
    delete API.defaults.headers.common['Authorization'];
  }
};

export default API;
