// api.js
import axios from 'axios';

// Base API URL
const API_URL = 'https://xeno-backend-pue2.onrender.com/api';

const axiosInstance = axios.create({
  baseURL: API_URL,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('firebaseToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('Authorization Header:', config.headers.Authorization); 
    } else {
      console.warn('Firebase token not found in localStorage');
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const fetchCampaigns = () => axiosInstance.get('/campaigns');

export const createCampaign = (data) => axiosInstance.post('/campaign', data);

export const sendMessages = (campaignId) => axiosInstance.post(`/campaign/${campaignId}/send`);

export const updateDeliveryReceipt = (logId) => axiosInstance.post(`/communication/${logId}/receipt`);

export default axiosInstance;