import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: '/api',
  validateStatus: (status) => status < 500,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default axiosInstance;
