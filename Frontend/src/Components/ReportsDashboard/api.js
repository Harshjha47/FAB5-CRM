import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BAHI_KHATA_URL,
  withCredentials: true,
  headers: {
    'x-api-key': import.meta.env.VITE_INTERNAL_BAHIKHATA_SECRET 
  }
});

export default api;