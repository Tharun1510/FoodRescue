import axios from 'axios';

// 🌐 AUTOMATIC URL SWITCHER
// If we are on Vercel, use the environment variable. 
// If we are on Localhost, use port 5000.
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const socketURL = API_URL;

const api = axios.create({
  baseURL: API_URL,
});
export default api;