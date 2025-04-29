import React, { useState, useEffect } from "react";
import { getUserDetails, updatePassword, logout } from "@/utils/api";
import { useNavigate } from "react-router-dom";
import {
    User2Icon,
    Edit2Icon,
    KeyRoundIcon,
    MailIcon,
    LogOutIcon,
    ArrowLeftIcon,
    ShieldIcon,
} from "lucide-react";
import { fetchLoanApplications } from "@/utils/api";
import Admin from "./Admin";

export default function Profile() {
    const [userDetails, setUserDetails] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [isAdminView, setIsAdminView] = useState(false);
    const [editData, setEditData] = useState({
        email: "",
        name: "",
    });
    const [passwordData, setPasswordData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });
    const [error, setError] = useState(null);
    const [pendingApplications, setPendingApplications] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const data = await getUserDetails();
                setUserDetails(data);
                setEditData({
                    email: data.email || "",
                    name: data.name || "",
                });
            } catch (error) {
                setError(error.message || "Failed to fetch user details");
            }
        };

        fetchUserProfile();
    }, []);

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        setError(null);

        if (passwordData.newPassword.length < 6) {
            setError("Password must be at least 6 characters long");
            return;
        }

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setError("New passwords do not match");
            return;
        }

        try {
            await updatePassword(passwordData.newPassword);
            alert("Password updated successfully");
            setPasswordData({
                currentPassword: "",
                newPassword: "",
                confirmPassword: "",
            });
            setIsEditing(false);
        } catch (error) {
            setError(error.message || "Failed to update password");
        }
    };

    const handleLogout = async () => {
        try {
            await logout();
            navigate("/login");
        } catch (error) {
            setError("Logout failed");
        }
    };

    const handleBackToDashboard = () => {
        navigate(`${import.meta.VITE_BACKEND_URL}/dashboard/home`);
    };

    const fetchPendingApplications = async () => {
        try {
            const response = await fetchLoanApplications();
            if (response.success) {
                const pendingApps = response.applications.filter(
                    (app) => app.Status.toLowerCase() === "pending"
                );
                setPendingApplications(pendingApps);
                return pendingApps;
            }
            return [];
        } catch (error) {
            setError("Failed to fetch pending applications");
            return [];
        }
    };

    const handleSwitchToAdmin = () => {
        setIsAdminView(true);
        fetchPendingApplications();
    };

    const handleApproveApplication = async (applicationId) => {
        try {
            const response = await fetch(
                `${
                    import.meta.env.VITE_BACKEND_URL
                }/api/loan-applications/${applicationId}/approve`,
                {
                    method: "POST",
                    credentials: "include",
                }
            );

            if (response.ok) {
                setPendingApplications((prev) =>
                    prev.filter((app) => app._id !== applicationId)
                );
            } else {
                throw new Error("Failed to approve application");
            }
        } catch (error) {
            setError(error.message || "Failed to approve application");
        }
    };

    if (!userDetails) {
        return (
            <div className="flex justify-center items-center h-screen bg-gradient-to-br from-blue-100 to-blue-300">
                <div className="animate-pulse rounded-full h-32 w-32 bg-blue-500"></div>
            </div>
        );
    }

    if (isAdminView) {
        return (
            <div className="bg-gradient-to-br from-blue-100 to-blue-300">
                <Admin
                    setIsAdminView={setIsAdminView}
                    fetchPendingApplications={fetchPendingApplications}
                    handleApproveApplication={handleApproveApplication}
                    pendingApplications={pendingApplications}
                />
            </div>
        );
    }

    // User Profile View
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-100 to-blue-300 p-8">
            <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden">
                {/* Header with Back and Logout Buttons */}
                <div className="bg-blue-600 text-white p-6 flex justify-between items-center">
                    <div className="flex items-center space-x-4">
                        <button
                            onClick={handleBackToDashboard}
                            className="bg-white/20 hover:bg-white/30 p-2 rounded-full transition"
                        >
                            <ArrowLeftIcon />
                        </button>
                        <h1 className="text-2xl font-bold">My Profile</h1>
                    </div>
                    <div className="flex space-x-3">
                        <button
                            onClick={handleSwitchToAdmin}
                            className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-md transition flex items-center"
                        >
                            <ShieldIcon className="mr-2" /> Admin View
                        </button>
                        <button
                            onClick={handleLogout}
                            className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-md transition flex items-center"
                        >
                            <LogOutIcon className="mr-2" /> Logout
                        </button>
                    </div>
                </div>

                {/* Error Message */}
                {error && (
                    <div
                        className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4"
                        role="alert"
                    >
                        {error}
                    </div>
                )}

                {/* Profile Content */}
                <div className="p-8 grid md:grid-cols-2 gap-8">
                    {/* User Details Card */}
                    <div className="bg-blue-50 rounded-lg p-6 shadow-md flex items-center">
                        <div className="flex items-center space-x-6">
                            <div className="bg-blue-200 rounded-full p-4">
                                <User2Icon
                                    size="64"
                                    className="text-blue-700"
                                />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-blue-900">
                                    {userDetails.name}
                                </h2>
                                <p className="text-blue-600">
                                    {userDetails.email}
                                </p>
                                <p className="text-sm text-blue-500">
                                    Customer Account
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Edit Profile Section */}
                    <div className="bg-blue-50 rounded-lg p-6 shadow-md">
                        <h3 className="text-lg font-semibold mb-4 text-blue-900 flex items-center">
                            <Edit2Icon className="mr-2 text-blue-600" /> Edit
                            Profile
                        </h3>
                        <form className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-blue-800 mb-2">
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    value={editData.email}
                                    onChange={(e) =>
                                        setEditData({
                                            ...editData,
                                            email: e.target.value,
                                        })
                                    }
                                    className="w-full px-4 py-2 border border-blue-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
                                />
                            </div>
                            <button
                                type="button"
                                onClick={() => setIsEditing(!isEditing)}
                                className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition"
                            >
                                {isEditing ? "Cancel" : "Change Password"}
                            </button>
                        </form>
                    </div>

                    {/* Change Password Section */}
                    {isEditing && (
                        <div className="md:col-span-2 bg-blue-50 rounded-lg p-6 shadow-md">
                            <h3 className="text-lg font-semibold mb-4 text-blue-900 flex items-center">
                                <KeyRoundIcon className="mr-2 text-blue-600" />
                                Change Password
                            </h3>
                            <form
                                onSubmit={handlePasswordChange}
                                className="max-w-md flex flex-col mx-auto space-y-4"
                            >
                                <div>
                                    <label className="block text-sm font-medium text-blue-800 mb-2">
                                        New Password
                                    </label>
                                    <input
                                        type="password"
                                        value={passwordData.newPassword}
                                        onChange={(e) =>
                                            setPasswordData({
                                                ...passwordData,
                                                newPassword: e.target.value,
                                            })
                                        }
                                        className="w-full px-4 py-2 border border-blue-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
                                        minLength="6"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-blue-800 mb-2">
                                        Confirm Password
                                    </label>
                                    <input
                                        type="password"
                                        value={passwordData.confirmPassword}
                                        onChange={(e) =>
                                            setPasswordData({
                                                ...passwordData,
                                                confirmPassword: e.target.value,
                                            })
                                        }
                                        className="w-full px-4 py-2 border border-blue-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
                                        minLength="6"
                                        required
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition"
                                >
                                    Update Password
                                </button>
                            </form>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
