import axios from 'axios';
import { BASE_URL } from './apiPaths';

const axiosInstance = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
        Accept:'application/json',
    },
});

//Request interceptor
axiosInstance.interceptors.request.use(
    (config) => {
        const accesstoken = localStorage.getItem('token');
        if (accesstoken) {
            config.headers.Authorization = `Bearer ${accesstoken}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

//Response interceptor
axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if(error.response){
            if(error.response.status === 401){
                window.location.href="/";
            } else if (error.response.status === 500) {
                console.log('Internal Server Error');
            }
        } else if(error.code === 'ECONNABORTED'){
            console.log('Timeout Error');
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;