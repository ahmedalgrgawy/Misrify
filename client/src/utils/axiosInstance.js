import axios from 'axios';
import { logout, setAccessToken } from '../features/authSlice';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:5000/api/',
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
  withCredentials: true,
});

// Request Interceptor
axiosInstance.interceptors.request.use(
  async (config) => {
    const { store } = await import('../app/store');
    const token = store.getState().auth.accessToken;
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes('/auth/refresh-token')
    ) {
      originalRequest._retry = true;
      try {
        // Use a clean Axios instance for the refresh
        const rawAxios = axios.create({
          baseURL,
          withCredentials: true,
        });

        const refreshResponse = await rawAxios.post('/auth/refresh-token');
        const newAccessToken = refreshResponse.data.accessToken;

        const { store } = await import('../app/store');
        store.dispatch(setAccessToken(newAccessToken));

        // Set the new token for retry
        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        const { store } = await import('../app/store');
        store.dispatch(logout());
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
