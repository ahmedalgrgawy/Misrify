import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'http://localhost:5001/api/',
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000,
    withCredentials: true,
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
