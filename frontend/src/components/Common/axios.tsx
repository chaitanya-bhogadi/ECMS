import { baseURL } from "../../constants"
import axios, { AxiosResponse } from 'axios';

import { useSnackbar } from "../../contexts/SnackbarContext";

interface RefreshResponse {
    refresh: string,
    access: string
}


const axiosInstance = axios.create({
    baseURL: baseURL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Adding the JWT token to every outgoing request
axiosInstance.interceptors.request.use(
    (config: any) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            if (window.location.pathname === "/login") {

                window.location.replace("/");
            }

            config.headers = config.headers || {};
            config.headers['Authorization'] = `JWT ${token}`;
        }
        else {
            if (
                config.url === '/api/auth/token/' ||
                config.url === '/api/auth/token/refresh'
            ) {
            } else if (config.url === '/api/auth/logout/') {
                window.location.replace("/login");
            }
        }
        return config;
    },
    (error: any) => {
        return Promise.reject(error);
    }
);

// Handling 401 errors globally
axiosInstance.interceptors.response.use(
    (response: AxiosResponse) => response,
    async (error: any) => {
        const originalRequest = error.config;
        if (
            error.response.status === 401 &&
            originalRequest.url === `${baseURL}/api/auth/token/`
        ) {
        }
        else if (
            error.response.status === 401 &&
            originalRequest.url === `${baseURL}/api/auth/token/refresh/`
        ) {
            window.location.replace("/login");
            const { showMessage } = useSnackbar();
            showMessage('Session expired please login again', 'error');
            return;
        }
        else if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            const refreshToken = localStorage.getItem('refreshToken');
            try {
                const res = await axios.post<RefreshResponse>(baseURL, { refreshToken });
                if (res.status === 201) {
                    localStorage.setItem('accessToken', res.data.access);
                    localStorage.setItem('refreshToken', res.data.refresh);
                    axios.defaults.headers.common['Authorization'] = `JWT ${res.data.access}`;
                    return axiosInstance(originalRequest);
                }
            } catch (refreshError) {
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;