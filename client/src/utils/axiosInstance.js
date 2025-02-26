import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: import.meta.env.MODE === 'development' ? 'http://localhost:5000/api' : '/api',
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000,
    withCredentials: true, // Send cookies when cross-origin
});


axiosInstance.interceptors.request.use((config) => {

    const token = localStorage.getItem('accessToken')

    if (token) {
        config.headers.Authorization = `${token}`
    }

    return config

}, (error) => {
    return Promise.reject(error)
})

export default axiosInstance;
