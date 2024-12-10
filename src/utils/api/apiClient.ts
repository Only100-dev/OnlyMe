import axios, { AxiosInstance, AxiosError } from 'axios';
import { setupCache } from 'axios-cache-interceptor';

// Create axios instance with caching
const axiosInstance = setupCache(axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
}));

// Error handling interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    if (error.response?.status === 429) {
      // Rate limiting handling
      const retryAfter = error.response.headers['retry-after'];
      return new Promise(resolve => {
        setTimeout(() => {
          resolve(axiosInstance(error.config!));
        }, parseInt(retryAfter || '5000'));
      });
    }

    // Handle other errors
    const errorMessage = error.response?.data?.message || error.message;
    console.error('API Error:', errorMessage);
    throw error;
  }
);

export const apiClient = axiosInstance;