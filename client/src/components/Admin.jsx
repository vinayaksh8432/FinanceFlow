import React, { useState, useEffect } from "react";
import {
    ShieldIcon,
    ArrowLeftIcon,
    CheckCircleIcon,
    XCircleIcon,
} from "lucide-react";
import { approveLoanApplication, rejectLoanApplication } from "@/utils/api";

export default function Admin({
    setIsAdminView,
    fetchPendingApplications,
    pendingApplications,
}) {
    const [localPendingApplications, setLocalPendingApplications] = useState(
        []
    );
    const [error, setError] = useState(null);
    const [selectedApplication, setSelectedApplication] = useState(null);

    useEffect(() => {
        const loadPendingApplications = async () => {
            try {
                const applications = await fetchPendingApplications();
                setLocalPendingApplications(applications);
            } catch (err) {
                setError("Failed to load pending applications");
            }
        };

        loadPendingApplications();
    }, [fetchPendingApplications]);

    const handleApprove = async (applicationId) => {
        try {
            const response = await approveLoanApplication(applicationId);

            // Update the local state to mark the application as approved
            setLocalPendingApplications((prev) =>
                prev.map((app) =>
                    app._id === applicationId
                        ? { ...app, Status: "Approved" }
                        : app
                )
            );
            alert("Application approved successfully");
            console.log("Application approved:", response.message);
        } catch (err) {
            const errorMessage = err.message || "Failed to approve application";
            setError(errorMessage);
            console.error("Approval Error:", err);
        }
    };

    const handleReject = async (applicationId) => {
        try {
            const response = await rejectLoanApplication(applicationId);

            // Update the local state to mark the application as rejected
            setLocalPendingApplications((prev) =>
                prev.map((app) =>
                    app._id === applicationId
                        ? { ...app, Status: "Rejected" }
                        : app
                )
            );
            alert("Application rejected successfully");
            console.log("Application rejected:", response.message);
        } catch (err) {
            const errorMessage = err.message || "Failed to reject application";
            setError(errorMessage);
            console.error("Rejection Error:", err);
        }
    };

    const renderDocumentPreview = (document) => {
        if (!document) return null;

        return (
            <div className="bg-gray-50 p-4 rounded-lg mt-4">
                <h3 className="font-semibold mb-2">Uploaded Document</h3>
                {document.fileType.includes("image") ? (
                    <img
                        alt="Document Preview"
                        className="max-w-full h-auto max-h-64 object-contain"
                    />
                ) : (
                    <iframe
                        src={
                            "http://localhost:3000/uploads/" + document.fileName
                        }
                        className="w-full h-64"
                        title="Document Preview"
                    />
                )}
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-100 to-blue-300 p-8">
            <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden">
                <div className="bg-blue-600 text-white p-6 flex justify-between items-center">
                    <h1 className="text-2xl font-bold flex items-center">
                        <ShieldIcon className="mr-3" /> Admin Dashboard
                    </h1>
                    <div className="flex space-x-3">
                        <button
                            onClick={() => setIsAdminView(false)}
                            className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-md transition flex items-center"
                        >
                            <ArrowLeftIcon className="mr-2" /> Back to Profile
                        </button>
                    </div>
                </div>

                {error && (
                    <div
                        className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4"
                        role="alert"
                    >
                        {error}
                    </div>
                )}

                <div className="grid grid-cols-3 gap-4 p-6">
                    <div className="col-span-1 space-y-4 overflow-y-auto max-h-[700px]">
                        {localPendingApplications.length === 0 ? (
                            <div className="text-center py-12 text-gray-500">
                                No loan applications
                            </div>
                        ) : (
                            localPendingApplications.map((application) => (
                                <div
                                    key={application._id}
                                    onClick={() =>
                                        setSelectedApplication(application)
                                    }
                                    className={`
                                        rounded-lg p-4 cursor-pointer transition
                                        ${
                                            application.Status === "Approved"
                                                ? "bg-green-100 hover:bg-green-200"
                                                : application.Status ===
                                                  "Rejected"
                                                ? "bg-red-100 hover:bg-red-200"
                                                : "bg-gray-100 hover:bg-gray-200"
                                        }
                                        ${
                                            selectedApplication?._id ===
                                            application._id
                                                ? "border-b-2 border-blue-500"
                                                : ""
                                        }
                                    `}
                                >
                                    <div className="flex items-center">
                                        <p className="font-bold text-lg text-blue-800 mr-3">
                                            {application.FirstName}{" "}
                                            {application.LastName}
                                        </p>
                                        {application.Status === "Approved" && (
                                            <span className="flex items-center text-green-600">
                                                <CheckCircleIcon className="w-5 h-5 mr-2" />
                                                Approved
                                            </span>
                                        )}
                                        {application.Status === "Rejected" && (
                                            <span className="flex items-center text-red-600">
                                                <XCircleIcon className="w-5 h-5 mr-2" />
                                                Rejected
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-gray-600">
                                        Loan Type: {application.LoanType}
                                    </p>
                                    <p className="text-gray-700 font-semibold">
                                        Amount: ₹{application.totalLoanAmount}
                                    </p>
                                </div>
                            ))
                        )}
                    </div>

                    <div className="col-span-2 bg-gray-50 p-6 rounded-lg">
                        {selectedApplication ? (
                            <div>
                                <h2 className="text-2xl font-bold mb-6 text-blue-800">
                                    Application Details
                                </h2>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <h3 className="text-lg font-semibold mb-2">
                                            Personal Information
                                        </h3>
                                        <div className="space-y-2 bg-white p-4 rounded-lg">
                                            <p>
                                                <strong>Full Name:</strong>{" "}
                                                {selectedApplication.FirstName}{" "}
                                                {selectedApplication.MiddleName}{" "}
                                                {selectedApplication.LastName}
                                            </p>
                                            <p>
                                                <strong>Email:</strong>{" "}
                                                {selectedApplication.Email}
                                            </p>
                                            <p>
                                                <strong>Phone:</strong>{" "}
                                                {selectedApplication.Phone}
                                            </p>
                                            <p>
                                                <strong>Date of Birth:</strong>{" "}
                                                {new Date(
                                                    selectedApplication.DateofBirth
                                                ).toLocaleDateString()}
                                            </p>
                                            <p>
                                                <strong>Gender:</strong>{" "}
                                                {selectedApplication.Gender}
                                            </p>
                                            <p>
                                                <strong>Marital Status:</strong>{" "}
                                                {
                                                    selectedApplication.MartialStatus
                                                }
                                            </p>
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="text-lg font-semibold mb-2">
                                            Address Details
                                        </h3>
                                        <div className="space-y-2 bg-white p-4 rounded-lg">
                                            <p>
                                                <strong>Address:</strong>
                                                {
                                                    selectedApplication.AddressLine1
                                                }
                                                ,
                                                {
                                                    selectedApplication.AddressLine2
                                                }
                                            </p>
                                            <p>
                                                <strong>City:</strong>{" "}
                                                {selectedApplication.City}
                                            </p>
                                            <p>
                                                <strong>State:</strong>{" "}
                                                {selectedApplication.State}
                                            </p>
                                            <p>
                                                <strong>Postal Code:</strong>{" "}
                                                {selectedApplication.PostalCode}
                                            </p>
                                            <p>
                                                <strong>
                                                    Residential Status:
                                                </strong>{" "}
                                                {
                                                    selectedApplication.ResidentialStatus
                                                }
                                            </p>
                                            <p>
                                                <strong>
                                                    Years at Current Address:
                                                </strong>{" "}
                                                {
                                                    selectedApplication.StayedInCurrentAddress
                                                }
                                            </p>
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="text-lg font-semibold mb-2">
                                            Employment Information
                                        </h3>
                                        <div className="space-y-2 bg-white p-4 rounded-lg">
                                            <p>
                                                <strong>Occupation:</strong>{" "}
                                                {selectedApplication.Occupation}
                                            </p>
                                            <p>
                                                <strong>
                                                    Employment Status:
                                                </strong>{" "}
                                                {
                                                    selectedApplication.EmploymentStatus
                                                }
                                            </p>
                                            <p>
                                                <strong>Experience:</strong>{" "}
                                                {
                                                    selectedApplication
                                                        .YearsOfExperience.years
                                                }{" "}
                                                years{" "}
                                                {
                                                    selectedApplication
                                                        .YearsOfExperience
                                                        .months
                                                }{" "}
                                                months
                                            </p>
                                            <p>
                                                <strong>
                                                    Gross Monthly Income:
                                                </strong>{" "}
                                                ₹
                                                {
                                                    selectedApplication.GrossMonthlyIncome
                                                }
                                            </p>
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="text-lg font-semibold mb-2">
                                            Loan Details
                                        </h3>
                                        <div className="space-y-2 bg-white p-4 rounded-lg">
                                            <p>
                                                <strong>Loan Type:</strong>{" "}
                                                {selectedApplication.LoanType}
                                            </p>
                                            <p>
                                                <strong>
                                                    Desired Loan Amount:
                                                </strong>{" "}
                                                ₹
                                                {
                                                    selectedApplication.DesiredLoanAmount
                                                }
                                            </p>
                                            <p>
                                                <strong>
                                                    Total Loan Amount:
                                                </strong>{" "}
                                                ₹
                                                {
                                                    selectedApplication.totalLoanAmount
                                                }
                                            </p>
                                            <p>
                                                <strong>Loan Tenure:</strong>{" "}
                                                {selectedApplication.LoanTenure}{" "}
                                                months
                                            </p>
                                            <p>
                                                <strong>Monthly EMI:</strong> ₹
                                                {selectedApplication.monthlyEmi}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Identity Document Preview */}
                                {renderDocumentPreview(
                                    selectedApplication.DocumentFile
                                )}

                                <div
                                    className="mt-6 flex
                                 justify-center space-x-4"
                                >
                                    <button
                                        onClick={() => {
                                            handleApprove(
                                                selectedApplication._id
                                            );
                                            setSelectedApplication({
                                                ...selectedApplication,
                                                Status: "Approved",
                                            });
                                        }}
                                        className={`px-8 py-3 rounded-full transition flex items-center ${
                                            selectedApplication.Status ===
                                            "Approved"
                                                ? "bg-gray-400 cursor-not-allowed"
                                                : "bg-green-500 hover:bg-green-600"
                                        } text-white`}
                                    >
                                        <CheckCircleIcon className="mr-2" />
                                        {selectedApplication.Status ===
                                        "Approved"
                                            ? "Already Approved"
                                            : "Approve Application"}
                                    </button>
                                    <button
                                        onClick={() => {
                                            handleReject(
                                                selectedApplication._id
                                            );
                                            setSelectedApplication({
                                                ...selectedApplication,
                                                Status: "Rejected",
                                            });
                                        }}
                                        className={`px-8 py-3 rounded-full transition flex items-center ${
                                            selectedApplication.Status ===
                                            "Rejected"
                                                ? "bg-gray-400 cursor-not-allowed"
                                                : "bg-red-500 hover:bg-red-600"
                                        } text-white`}
                                    >
                                        <XCircleIcon className="mr-2" />
                                        {selectedApplication.Status ===
                                        "Rejected"
                                            ? "Already Rejected"
                                            : "  Application"}
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center text-gray-500 py-12">
                                Select an application to view details
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
