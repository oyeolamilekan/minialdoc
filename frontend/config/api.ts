import axios from "axios";
import { deleteCookie, getCookie } from "cookies-next";
import { BASE_URL } from "./url";
import { clearSessionStorage } from "@/hooks/useSessionStorage";


const getToken = () => {
    const token = getCookie("token");
    return token ? `Bearer ${token}` : '';
};

const axiosInstance = axios.create({
    baseURL: BASE_URL,
    timeout: 10000
});

axiosInstance.interceptors.request.use(config => {
    if (config.data instanceof FormData) {
        config.headers['Content-Type'] = 'multipart/form-data';
    } else {
        config.headers['Content-Type'] = 'application/json';
    }
    config.headers['Authorization'] = getToken();
    return config;
});

axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response?.status === 401) {
            deleteCookie("token")
            clearSessionStorage()
            window.location.href = "/auth/sign-in";
        }

        if (error.response?.status === 402) {
            console.log('hello boss')
            window.location.href = "/dashboard/payment";
        }
        return Promise.reject(error);
    }
);

export { axiosInstance };
