import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchLoanApplications } from "@/utils/api";
import { generatePDF } from "@/utils/pdfGenerator";
import {
    Download,
    Trash2,
    RefreshCw,
    FileText,
    AlertCircle,
    Clock,
    CheckCircle,
    XCircle,
    CalendarClock,
    IndianRupee,
    PiggyBank,
    HandCoins,
    Calendar1,
} from "lucide-react";
import { Calendar } from "@phosphor-icons/react/dist/ssr";

export default function ApplicationStatus() {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const fetchApplications = async () => {
        setLoading(true);
        try {
            const response = await fetchLoanApplications();
            if (response.success) {
                setApplications(response.applications || []);
                setError("");
            } else {
                throw new Error(
                    response.message || "Failed to fetch applications"
                );
            }
        } catch (err) {
            console.error("Error fetching applications:", err);
            setError(err.message);
            if (err.message?.includes("Authentication required")) {
                navigate("/login");
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchApplications();
    }, []);

    const getStatusStyle = (status) => {
        const styles = {
            approved: {
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
            rejected: {
                bg: "bg-red-50",
                text: "text-red-700",
                border: "border-red-200",
                icon: <XCircle className="w-5 h-5 text-red-500" />,
            },
            "under review": {
                bg: "bg-blue-50",
                text: "text-blue-700",
                border: "border-blue-200",
                icon: <Clock className="w-5 h-5 text-blue-500" />,
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
        if (
            !window.confirm("Are you sure you want to delete this application?")
        ) {
            return;
        }
        try {
            const response = await fetch(
                `${
                    import.meta.env.VITE_BACKEND_URL
                }/api/loan-applications/${id}`,
                {
                    method: "DELETE",
                    credentials: "include",
                }
            );
            if (response.ok) {
                await fetchApplications();
            } else {
                throw new Error("Failed to delete application");
            }
        } catch (err) {
            setError(err.message);
        }
    };

    const handleDownload = async (application) => {
        try {
            const pdfBlob = await generatePDF(application);
            const url = URL.createObjectURL(pdfBlob);
            const link = document.createElement("a");
            link.href = url;
            link.download = `loan_application_${application.loanId}.pdf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        } catch (err) {
            setError("Failed to download application");
        }
    };

    const LoadingSkeleton = () => (
        <div className="animate-pulse space-y-4">
            {[1, 2].map((n) => (
                <div key={n} className="bg-white rounded-xl shadow-sm p-6">
                    <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
                    <div className="h-8 bg-gray-200 rounded w-3/4 mb-6"></div>
                    <div className="grid grid-cols-3 gap-4">
                        <div className="h-20 bg-gray-200 rounded"></div>
                        <div className="h-20 bg-gray-200 rounded"></div>
                        <div className="h-20 bg-gray-200 rounded"></div>
                    </div>
                </div>
            ))}
        </div>
    );

    if (loading) return <LoadingSkeleton />;

    return (
        <div className="w-full px-2 py-4">
            {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700">
                    <AlertCircle className="w-5 h-5" />
                    <span>{error}</span>
                </div>
            )}

            {applications.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-200">
                    <FileText className="w-12 h-12 mx-auto text-gray-400 mb-3" />
                    <p className="text-lg font-medium text-gray-900 mb-1">
                        No applications found
                    </p>
                    <p className="text-sm text-gray-500">
                        Your loan applications will appear here
                    </p>
                </div>
            ) : (
                <div className="space-y-4">
                    {applications.map((application) => {
                        const statusStyle = getStatusStyle(application.Status);
                        return (
                            <div
                                key={application._id}
                                className="flex flex-col gap-6 bg-white p-8 rounded-2xl shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-300"
                            >
                                <div className="flex justify-between items-start">
                                    <div className="space-y-2">
                                        <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
                                            {application.FirstName}{" "}
                                            {application.LastName}
                                        </h2>
                                        <div className="space-y-1">
                                            <p className="text-sm font-medium text-gray-600">
                                                Loan ID:{" "}
                                                <span className="text-gray-900">
                                                    {application.loanId}
                                                </span>
                                            </p>
                                            <p className="text-sm font-medium text-gray-600">
                                                Loan Type:{" "}
                                                <span className="text-gray-900">
                                                    {application.LoanType} Loan
                                                </span>
                                            </p>
                                        </div>
                                    </div>
                                    <div
                                        className={`px-5 py-2.5 rounded-full flex items-center gap-2 ${statusStyle.bg} ${statusStyle.text} ${statusStyle.border} shadow-sm`}
                                    >
                                        {statusStyle.icon}
                                        <span className="font-semibold">
                                            {application.Status}
                                        </span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-4 gap-6">
                                    {[
                                        {
                                            label: "Loan Amount",
                                            value: `₹ ${Number(
                                                application.totalLoanAmount
                                            ).toLocaleString()}`,
                                            icon: <PiggyBank />,
                                        },
                                        {
                                            label: "Tenure",
                                            value: `${application.LoanTenure} Months`,
                                            icon: <CalendarClock />,
                                        },
                                        {
                                            label: "Monthly EMI",
                                            value: `₹ ${application.monthlyEmi}`,
                                            icon: <HandCoins />,
                                        },
                                        {
                                            label: "Applied On",
                                            value: formatDate(
                                                application.ApplicationDate
                                            ),
                                            icon: <Calendar1 />,
                                        },
                                    ].map((item, index) => (
                                        <div
                                            key={index}
                                            className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-5 flex flex-col gap-2 shadow-sm"
                                        >
                                            <div className="flex items-center gap-2">
                                                <span className="text-lg">
                                                    {item.icon}
                                                </span>
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

                                <div className="flex gap-3 pt-2">
                                    <button
                                        onClick={() =>
                                            handleDownload(application)
                                        }
                                        className="inline-flex items-center justify-center px-6 py-3 border-2 border-gray-300 rounded-lg text-sm font-semibold bg-white hover:bg-blue-50 focus:outline-none transition-all duration-200"
                                    >
                                        <Download className="w-4 h-4 mr-2" />
                                        Download Application
                                    </button>
                                    <button
                                        onClick={() =>
                                            handleDelete(application._id)
                                        }
                                        className="inline-flex items-center justify-center px-6 py-3 border-2 border-red-200 rounded-lg text-sm font-semibold text-red-600 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-200"
                                    >
                                        <Trash2 className="w-4 h-4 mr-2" />
                                        Delete
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
