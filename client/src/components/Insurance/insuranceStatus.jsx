import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchUserQuotas } from "@/utils/api";
import {
    ArrowClockwise,
    TrashSimple,
    DownloadSimple,
    Warning,
} from "@phosphor-icons/react";
import { generatePDF } from "@/utils/pdfGenerator";
import { TailSpin } from "react-loader-spinner";
import Tooltip from "@mui/material/Tooltip";
import { LuBadgeCheck } from "react-icons/lu";
import { ClockClockwise } from "@phosphor-icons/react";
import { FiAlertCircle } from "react-icons/fi";

const PolicyCard = ({ policy, onDelete, onDownload }) => {
    const [showDetails, setShowDetails] = useState(false);

    const getStatusStyle = (status) => {
        switch (status?.toLowerCase()) {
            case "active":
                return "text-green-500 bg-green-100 border-green-500";
            case "pending":
                return "text-amber-600 bg-yellow-50 border-amber-600";
            case "expired":
                return "text-red-500 bg-red-100 border-red-500";
            default:
                return "text-gray-500 bg-gray-100 border-gray-500";
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case "Active":
                return <LuBadgeCheck className="w-6 h-6 text-green-500" />;
            case "Pending":
                return <ClockClockwise className="w-6 h-6 text-yellow-500" />;
            case "Expired":
                return <FiAlertCircle className="w-6 h-6 text-red-500" />;
            default:
                return null;
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        const date = new Date(dateString);
        return date instanceof Date && !isNaN(date)
            ? date.toLocaleDateString("en-IN", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
              })
            : "N/A";
    };

    return (
        <div className="border border-gray-300 rounded-xl overflow-hidden flex flex-col gap-2 h-full shadow-sm">
            <div className="flex flex-col bg-blue-300 bg-opacity-40">
                <div className="flex items-center justify-between w-full px-4 py-2">
                    <div>
                        <h1 className="text-xs">{policy.id}</h1>
                        <h3 className="text-lg font-semibold">{policy.name}</h3>
                        <span className="font-medium">{policy.type}</span>
                    </div>
                    {policy.status && (
                        <div
                            className={`flex items-center gap-2 border px-2 py-1 rounded-md ${getStatusStyle(
                                policy.status
                            )}`}
                        >
                            {policy.status} {getStatusIcon(policy.status)}
                        </div>
                    )}
                </div>
                <hr className="border border-gray-300 w-full" />
            </div>

            <div className="grid grid-cols-3 gap-4 px-4 pb-2">
                <div className="flex flex-col">
                    <span className="text-gray-600">Coverage</span>
                    <span className="font-medium">
                        ₹{policy.coverage.toLocaleString()}
                    </span>
                </div>
                <div className="flex flex-col">
                    <span className="text-gray-600">Premium</span>
                    <span className="font-medium">
                        ₹{policy.premium.toLocaleString()}/year
                    </span>
                </div>
                <div className="flex flex-col">
                    <span className="text-gray-600">Valid Till</span>
                    <span className="font-medium">
                        {formatDate(policy.endDate)}
                    </span>
                </div>
            </div>

            <div className="flex justify-between items-center px-4 border-y border-gray-300 py-2">
                <button
                    className="border border-gray-400 rounded-full px-2"
                    onClick={() => setShowDetails(!showDetails)}
                >
                    {showDetails ? "Hide Details" : "View Details"}
                </button>
                <div className="flex gap-2">
                    <Tooltip title="Delete" arrow>
                        <button
                            onClick={() => onDelete(policy._id)}
                            className="text-red-700 hover:text-red-900"
                        >
                            <TrashSimple />
                        </button>
                    </Tooltip>
                    <Tooltip title="Download" arrow>
                        <button
                            onClick={() => onDownload(policy)}
                            className="text-gray-700 hover:text-gray-900"
                        >
                            <DownloadSimple />
                        </button>
                    </Tooltip>
                </div>
            </div>

            {showDetails && (
                <div className="px-4 pb-2">
                    <div className="text-sm font-medium">Policy Details:</div>
                    <div className="text-sm text-gray-600 grid grid-cols-3 gap-2">
                        <div>
                            <span className="font-medium">
                                Coverage Details:
                            </span>
                            {policy.details && (
                                <ul className="space-y-1">
                                    {Object.entries(policy.details).map(
                                        ([key, value]) => (
                                            <li key={key}>{value}</li>
                                        )
                                    )}
                                </ul>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default function InsuranceStatus() {
    const [policies, setPolicies] = useState([]);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        fetchPolicies();
    }, []);

    const fetchPolicies = async () => {
        setIsLoading(true);
        try {
            const response = await fetchUserQuotas();
            if (Array.isArray(response)) {
                setPolicies(response);
                setError("");
            } else {
                throw new Error("Failed to fetch policies");
            }
        } catch (err) {
            console.error("Error fetching policies:", err);
            setError(err.message);
            if (err.message?.includes("Authentication required")) {
                navigate("/login");
            }
        } finally {
            setIsLoading(false);
        }
    };

    const deletePolicy = async (id) => {
        try {
            if (
                !window.confirm("Are you sure you want to delete this policy?")
            ) {
                return;
            }

            const response = await fetch(
                `${import.meta.env.VITE_BACKEND_URL}/api/insurance/${id}`,
                {
                    method: "DELETE",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            if (!response.ok) {
                throw new Error(
                    `Failed to delete policy. Status: ${response.status}`
                );
            }

            const data = await response.json();
            if (!data.success) {
                throw new Error(data.message || "Failed to delete policy");
            }

            alert("Policy deleted successfully");
            await fetchPolicies();
        } catch (err) {
            console.error("Error deleting policy:", err);
            setError(err.message || "Failed to delete policy");
            alert("Failed to delete policy. Please try again.");
        }
    };

    const handleDownload = async (policy) => {
        try {
            const pdfBlob = await generatePDF(policy);
            const url = URL.createObjectURL(pdfBlob);
            const link = document.createElement("a");
            link.href = url;
            link.download = `policy_${policy._id}.pdf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        } catch (err) {
            console.error("Error generating PDF:", err);
            setError(err.message);
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-full">
                <TailSpin
                    height="50"
                    width="50"
                    color="#000"
                    ariaLabel="loading"
                />
            </div>
        );
    }

    return (
        <>
            <div>
                {policies.length === 0 ? (
                    <div className="text-center text-gray-500 py-12">
                        <p>No policies found.</p>
                        <button
                            onClick={fetchPolicies}
                            className="mt-4 p-2.5 border rounded-md shadow-sm flex gap-1 items-center mx-auto"
                        >
                            <ArrowClockwise /> Refresh
                        </button>
                    </div>
                ) : (
                    <div className="flex flex-col gap-6 relative">
                        {policies.map((policy) => (
                            <PolicyCard
                                key={policy._id}
                                policy={policy}
                                onDelete={deletePolicy}
                                onDownload={handleDownload}
                            />
                        ))}
                    </div>
                )}
            </div>

            {error && (
                <div className="p-2 border rounded-md shadow-sm text-red-600">
                    <Warning className="inline-block mr-2" />
                    {error}
                </div>
            )}
        </>
    );
}
