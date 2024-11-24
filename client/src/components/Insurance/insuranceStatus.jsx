import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchUserQuotas, deleteInsuranceQuota } from "@/utils/api";
import { generatePDF } from "@/utils/pdfGenerator";
import {
    Download,
    Trash2,
    AlertCircle,
    Shield,
    Calendar,
    Wallet,
    Clock,
    AlertTriangle,
} from "lucide-react";
import { CheckCircle, XCircle } from "@phosphor-icons/react";

export default function InsuranceStatus() {
    const [policies, setPolicies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const fetchPolicies = async () => {
        setLoading(true);
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
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPolicies();
    }, []);

    const getStatusStyle = (status) => {
        const styles = {
            active: {
                bg: "bg-green-50",
                text: "text-green-700",
                border: "border-green-200",
                icon: <CheckCircle className="w-5 h-5 text-green-500" />,
            },
            pending: {
                bg: "bg-yellow-50",
                text: "text-yellow-700",
                border: "border-yellow-200",
                icon: <Clock className="w-5 h-5 text-yellow-500" />,
            },
            expired: {
                bg: "bg-red-50",
                text: "text-red-700",
                border: "border-red-200",
                icon: <XCircle className="w-5 h-5 text-red-500" />,
            },
            "under review": {
                bg: "bg-blue-50",
                text: "text-blue-700",
                border: "border-blue-200",
                icon: <AlertTriangle className="w-5 h-5 text-blue-500" />,
            },
        };
        return styles[status?.toLowerCase()] || styles.pending;
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

    const handleDelete = async (id) => {
        try {
            await deleteInsuranceQuota(id);
            await fetchPolicies();
            showConfirm(false);
        } catch (err) {
            setError(err.message);
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
            setError("Failed to download policy");
        }
    };

    const LoadingSkeleton = () => (
        <div className="animate-pulse space-y-6">
            {[1, 2].map((n) => (
                <div
                    key={n}
                    className="bg-white rounded-2xl shadow-sm p-8 border border-gray-200"
                >
                    <div className="flex justify-between items-start mb-6">
                        <div className="space-y-4">
                            <div className="h-8 bg-gray-200 rounded-lg w-48"></div>
                            <div className="space-y-2">
                                <div className="h-4 bg-gray-200 rounded w-32"></div>
                                <div className="h-4 bg-gray-200 rounded w-40"></div>
                            </div>
                        </div>
                        <div className="h-10 bg-gray-200 rounded-full w-32"></div>
                    </div>
                    <div className="grid grid-cols-4 gap-6">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="bg-gray-100 rounded-xl p-5">
                                <div className="h-4 bg-gray-200 rounded w-20 mb-2"></div>
                                <div className="h-6 bg-gray-200 rounded w-24"></div>
                            </div>
                        ))}
                    </div>
                    <div className="mt-6 flex gap-3">
                        <div className="h-12 bg-gray-200 rounded-lg w-40"></div>
                        <div className="h-12 bg-gray-200 rounded-lg w-32"></div>
                    </div>
                </div>
            ))}
        </div>
    );

    const [confirmId, setConfirmId] = useState(null);

    const showConfirm = (id) => {
        setConfirmId(id);
    };
    if (loading) return <LoadingSkeleton />;

    return (
        <div className="w-full px-2 py-4">
            {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700">
                    <AlertCircle className="w-5 h-5" />
                    <span>{error}</span>
                </div>
            )}

            {policies.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-200">
                    <Shield className="w-12 h-12 mx-auto text-gray-400 mb-3" />
                    <p className="text-lg font-medium text-gray-900 mb-1">
                        No insurance policies found
                    </p>
                    <p className="text-sm text-gray-500">
                        Your active insurance policies will appear here
                    </p>
                </div>
            ) : (
                <div className="space-y-6">
                    {policies.map((policy) => {
                        const statusStyle = getStatusStyle(policy.status);
                        return (
                            <div
                                key={policy._id}
                                className="flex flex-col gap-6 bg-white p-8 rounded-2xl shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-300"
                            >
                                <div className="flex justify-between items-start">
                                    <div className="space-y-2">
                                        <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
                                            {policy.name}
                                        </h2>
                                        <div className="space-y-1">
                                            <p className="text-sm font-medium text-gray-600">
                                                Policy ID:{" "}
                                                <span className="text-gray-900">
                                                    {policy.id}
                                                </span>
                                            </p>
                                            <p className="text-sm font-medium text-gray-600">
                                                Type:{" "}
                                                <span className="text-gray-900">
                                                    {policy.type}
                                                </span>
                                            </p>
                                        </div>
                                    </div>
                                    <div
                                        className={`px-5 py-2.5 rounded-full flex items-center gap-2 ${statusStyle.bg} ${statusStyle.text} ${statusStyle.border} shadow-sm`}
                                    >
                                        {statusStyle.icon}
                                        <span className="font-semibold">
                                            {policy.status}
                                        </span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-4 gap-6">
                                    {[
                                        {
                                            label: "Coverage Amount",
                                            value: `₹${policy.coverage.toLocaleString()}`,
                                            icon: (
                                                <Shield className="w-5 h-5" />
                                            ),
                                        },
                                        {
                                            label: "Annual Premium",
                                            value: `₹${policy.premium.toLocaleString()}`,
                                            icon: (
                                                <Wallet className="w-5 h-5" />
                                            ),
                                        },
                                        {
                                            label: "Valid Till",
                                            value: formatDate(policy.endDate),
                                            icon: (
                                                <Calendar className="w-5 h-5" />
                                            ),
                                        },
                                        {
                                            label: "Next Premium Due",
                                            value: formatDate(
                                                policy.nextPremiumDate
                                            ),
                                            icon: <Clock className="w-5 h-5" />,
                                        },
                                    ].map((item, index) => (
                                        <div
                                            key={index}
                                            className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-5 flex flex-col gap-2 shadow-sm"
                                        >
                                            <div className="flex items-center gap-2">
                                                {item.icon}
                                                <p className="text-sm font-medium text-gray-600">
                                                    {item.label}
                                                </p>
                                            </div>
                                            <p className="text-lg font-bold text-gray-900">
                                                {item.value}
                                            </p>
                                        </div>
                                    ))}
                                </div>

                                {policy.details && (
                                    <div className="bg-gray-50 rounded-xl p-4">
                                        <h3 className="text-sm font-semibold text-gray-700 mb-2">
                                            Policy Details
                                        </h3>
                                        <ul className="space-y-1 text-sm text-gray-600">
                                            {Object.entries(policy.details).map(
                                                ([key, value]) => (
                                                    <li key={key}>{value}</li>
                                                )
                                            )}
                                        </ul>
                                    </div>
                                )}

                                <div className="flex gap-3 pt-2">
                                    <button
                                        onClick={() => handleDownload(policy)}
                                        className="inline-flex items-center justify-center px-6 py-3 border-2 border-gray-300 rounded-lg text-sm font-semibold bg-white hover:bg-blue-50 focus:outline-none transition-all duration-200"
                                    >
                                        <Download className="w-4 h-4 mr-2" />
                                        Download Policy
                                    </button>
                                    <div className="relative">
                                        <button
                                            onClick={() =>
                                                showConfirm(policy._id)
                                            }
                                            className="inline-flex items-center justify-center px-6 py-3 border-2 border-red-200 rounded-lg text-sm font-semibold text-red-600 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-200"
                                        >
                                            <Trash2 className="w-4 h-4 mr-2" />
                                            Delete
                                        </button>
                                        {confirmId === policy._id && (
                                            <div className="flex flex-col gap-4 absolute left-0 -top-32 bg-white p-4 w-48 text-sm border rounded-xl">
                                                Are you sure you want to delete
                                                this policy?
                                                <div className="flex gap-2">
                                                    <button
                                                        className="border px-2 py-1 rounded-md flex items-center gap-2 hover:bg-gray-50"
                                                        onClick={() =>
                                                            handleDelete(
                                                                policy._id
                                                            )
                                                        }
                                                    >
                                                        Yes
                                                        <CheckCircle />
                                                    </button>
                                                    <button
                                                        className="border px-2 py-1 rounded-md flex items-center gap-2 hover:bg-gray-50"
                                                        onClick={() =>
                                                            showConfirm(null)
                                                        }
                                                    >
                                                        No <XCircle />
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
