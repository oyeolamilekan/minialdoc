import { axiosInstance } from "@/config/api";

export const authenticateUser = async (body: { email: string, password: string }) => {
    const { data } = await axiosInstance.post('auth/signin', body);
    return data;
}

export const changePassword = async (body: { password: string, password2: string }) => {
    const { data } = await axiosInstance.post('auth/change_password', body);
    return data;
}

export const createUser = async (body: { email: string, first_name: string, last_name: string, password: string, buisness_name: string }) => {
    const { data } = await axiosInstance.post('auth/signup', body);
    return data;
}

export const requestResetPassword = async (body: { email: string }) => {
    const { data } = await axiosInstance.post('auth/request_reset_password', body);
    return data;
}

export const resetPassword = async (body: { email: string }) => {
    const { data } = await axiosInstance.post('auth/reset_password', body);
    return data;
}