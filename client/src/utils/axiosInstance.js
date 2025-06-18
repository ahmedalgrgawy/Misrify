import axios from 'axios';
import { logout, setAccessToken } from '../features/authSlice';
let store;

export const injectStore = (_store) => {
  store = _store;
};

const publicEndpoints = [
  '/auth/signup',
  '/auth/login',
  '/auth/refresh-token',
  '/auth/verify-email',
  '/auth/forgot-password',
  '/auth/reset-password',
];

// Create Axios instance
const axiosInstance = axios.create({
  baseURL: 'http://localhost:5000/api/',
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
  withCredentials: true,
});

// Request Interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const isPublic = publicEndpoints.some((url) => config.url.includes(url));
    const token = store?.getState().auth.accessToken;

    if (!isPublic && token) {
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

    const isAuthError = error.response?.status === 401;
    const isPublic = publicEndpoints.some((url) => originalRequest.url.includes(url));
    const alreadyRetried = originalRequest._retry;

    if (isAuthError && !isPublic && !alreadyRetried) {
      originalRequest._retry = true;

      try {
        const rawAxios = axios.create({
          baseURL: 'http://localhost:5000/api/',
          withCredentials: true,
        });

        const refreshResponse = await rawAxios.post('/auth/refresh-token');
        const newAccessToken = refreshResponse.data.accessToken;

        store.dispatch(setAccessToken(newAccessToken));
        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;

        return axiosInstance(originalRequest); // Retry original request
      } catch (refreshError) {
        store.dispatch(logout());
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;