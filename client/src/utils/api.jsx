import axios from "axios";

const API_URL = "http://localhost:3000/api";

export const register = async (userData) => {
    try {
        const response = await axios.post(
            `${API_URL}/users/register`,
            userData
        );
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};

export const login = async (userData) => {
    try {
        const response = await axios.post(`${API_URL}/users/login`, userData);
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};

export const getUserDetails = async (token) => {
    try {
        const response = await axios.get(`${API_URL}/users/user`, {
            headers: {
                "x-auth-token": token,
            },
        });
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};

// New logout function
export const logout = async () => {
    try {
        const response = await axios.post(
            `${API_URL}/users/logout`,
            {},
            { withCredentials: true }
        );
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};
