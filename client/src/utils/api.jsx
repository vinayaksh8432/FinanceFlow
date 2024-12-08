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
        const response = await api.get("/users/");
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

export const resetPassword = async (email) => {
    try {
        const response = await api.post("/users/reset-password", { email });
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

export const updatePassword = async (newPassword) => {
    try {
        const response = await api.post("/users/update-password", {
            newPassword,
        });
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
        if (error.response?.status === 401) {
            throw new Error("Please login to view your applications");
        }
        console.error(
            "Error in fetchLoanApplications:",
            error.response || error
        );
        throw error.response?.data || error.message;
    }
};

export const submitLoanApplication = async (formData) => {
    try {
        const response = await api.post("/loan-applications", formData, {
            headers: {
                // Don't set Content-Type - axios will set it automatically for FormData
                // Including the boundary parameter
            },
        });
        console.log("Form data", response.data);

        return response.data;
    } catch (error) {
        if (error.response?.status === 401) {
            throw new Error("Please login to submit an application");
        }
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

export const removeFromPortfolio = async (symbol) => {
    try {
        const response = await api.delete(`/portfolio/remove-stock/${symbol}`);
        if (!response.data.success) {
            throw new Error(
                response.data.message || "Failed to remove stock from portfolio"
            );
        }

        return response.data;
    } catch (error) {
        console.error("Portfolio removal error:", error);
        if (error.response?.status === 401) {
            throw new Error("Please login to remove stocks from portfolio");
        }
        throw error.response?.data || { message: error.message };
    }
};

export const updatePortfolioStock = async (symbol, updatedData) => {
    try {
        const response = await api.put(`/portfolio/update-stock/${symbol}`, {
            ...updatedData,
        });
        if (!response.data.success) {
            throw new Error(
                response.data.message || "Failed to update stock in portfolio"
            );
        }

        return response.data;
    } catch (error) {
        console.error("Portfolio update error:", error);
        if (error.response?.status === 401) {
            throw new Error("Please login to update stocks in portfolio");
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
        // Transform the response to match the UI structure
        const transformedData = response.data.reduce((acc, insurance) => {
            acc[insurance.category] = {
                category: insurance.category,
                items: insurance.items.map((item) => ({
                    ...item,
                    catagory: insurance.category, // Keep catagory for backward compatibility
                })),
            };
            return acc;
        }, {});
        return transformedData;
    } catch (error) {
        console.error("Error fetching insurance data:", error);
        throw error.response?.data || error.message;
    }
};

export const createInsuranceQuota = async (insuranceData) => {
    try {
        // Clean the coverage and price values by removing commas and converting to numbers
        const cleanNumber = (value) => {
            if (typeof value === "string") {
                return Number(value.replace(/,/g, ""));
            }
            return value;
        };

        const response = await api.post("/insurance-quotas/create", {
            name: insuranceData.name,
            type: insuranceData.catagory,
            coverage: cleanNumber(insuranceData.coverage),
            premium: cleanNumber(insuranceData.price),
            startDate: new Date(),
            endDate: new Date(
                new Date().setFullYear(new Date().getFullYear() + 1)
            ),
            status: "Active",
            details: insuranceData.details,
            // The userId will be extracted from the JWT token in the backend
            // using the authMiddleware, so we don't need to send it explicitly
        });

        if (!response.data.success) {
            throw new Error(
                response.data.message || "Failed to create insurance quota"
            );
        }

        return response.data;
    } catch (error) {
        if (error.response?.data?.message) {
            throw new Error(error.response.data.message);
        }
        throw error;
    }
};

export const fetchUserQuotas = async () => {
    try {
        const response = await api.get("/insurance-quotas/user-quotas");
        return response.data.data; // Make sure we return the data array from the response
    } catch (error) {
        console.error("Error fetching user quotas:", error);
        throw error.response?.data || error.message;
    }
};

export const deleteInsuranceQuota = async (quotaId) => {
    try {
        const response = await api.delete(
            `/insurance-quotas/delete/${quotaId}`
        );
        if (!response.data.success) {
            throw new Error(
                response.data.message || "Failed to delete insurance quota"
            );
        }
        return response.data;
    } catch (error) {
        console.error("Error deleting insurance quota:", error);
        throw error.response?.data || error.message;
    }
};
