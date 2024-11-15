import axios from "axios";

const API_URL = `${import.meta.env.VITE_BACKEND_URL}/api`;

const api = axios.create({
    baseURL: API_URL,
    withCredentials: true,
});

export const register = async (userData) => {
    try {
        const response = await api.post("/users/register", userData);
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

export const login = async (userData) => {
    try {
        const response = await api.post("/users/login", userData);
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

export const getUserDetails = async () => {
    try {
        const response = await api.get("/users/user");
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

export const logout = async () => {
    try {
        const response = await api.post("/users/logout");
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

export const fetchLoanTypes = async () => {
    try {
        const response = await api.get("/loan-types");
        return response.data;
    } catch (error) {
        console.warn("Using mock loan types due to API error:", error);
        return loanTypes; // Fallback to local data if API fails
    }
};

export const fetchLoanApplications = async () => {
    try {
        const response = await api.get("/loan-applications");
        return response.data;
    } catch (error) {
        console.error(
            "Error in fetchLoanApplications:",
            error.response || error
        );
        throw error.response?.data || error.message;
    }
};

export const submitLoanApplication = async (formData) => {
    try {
        const response = await api.post("/loan-applications/submit", formData);
        return response.data;
    } catch (error) {
        console.error("Loan submission error:", error.response || error);
        throw (
            error.response?.data || {
                message:
                    "Failed to submit application. Please try again later.",
            }
        );
    }
};

export const addToPortfolio = async (stockData) => {
    try {
        const response = await api.post("/portfolio/add-stock", stockData);

        if (!response.data.success) {
            throw new Error(
                response.data.message || "Failed to add stock to portfolio"
            );
        }

        return response.data;
    } catch (error) {
        console.error("Portfolio addition error:", error);
        if (error.response?.status === 401) {
            throw new Error("Please login to add stocks to portfolio");
        }
        throw error.response?.data || { message: error.message };
    }
};

export const getPortfolioData = async () => {
    try {
        const response = await api.get("/portfolio");

        if (!response.data.success && !response.data.holdings) {
            throw new Error(
                response.data.message || "Failed to fetch portfolio data"
            );
        }

        // console.log("Portfolio data:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error fetching portfolio data:", error);
        if (error.response?.status === 401) {
            throw new Error("Please login to view portfolio");
        }
        throw error.response?.data || { message: error.message };
    }
};

export const fetchInsuranceTypes = async () => {
    try {
        const response = await api.get("/insurance-types");
        return response.data;
    } catch (error) {
        console.error("Error fetching insurance types:", error);
        throw error.response?.data || error.message;
    }
};

export const fetchAllInsurance = async () => {
    try {
        const response = await api.get("/insurance-types/all");
        return response.data;
    } catch (error) {
        console.error("Error fetching insurance data:", error);
        throw error.response?.data || error.message;
    }
};

export const addInsurance = async (insuranceData) => {
    try {
        const response = await api.post("/insurance-types/add", insuranceData);
        return response.data;
    } catch (error) {
        console.error("Error adding insurance:", error);
        throw error.response?.data || error.message;
    }
};

export const updateInsurance = async (id, insuranceData) => {
    try {
        const response = await api.put(
            `/insurance-types/update/${id}`,
            insuranceData
        );
        return response.data;
    } catch (error) {
        console.error("Error updating insurance:", error);
        throw error.response?.data || error.message;
    }
};

export const deleteInsurance = async (id) => {
    try {
        const response = await api.delete(`/insurance-types/delete/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error deleting insurance:", error);
        throw error.response?.data || error.message;
    }
};
