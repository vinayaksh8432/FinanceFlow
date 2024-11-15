import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { fetchLoanApplications } from "@/utils/api";
import {
    ArrowClockwise,
    ArrowLeft,
    DownloadSimple,
    Pen,
    TrashSimple,
    Warning,
} from "@phosphor-icons/react";
import EditModal from "../Home/editModal";
import { generatePDF } from "@/utils/pdfGenerator";
import { TailSpin } from "react-loader-spinner";
import Tooltip from "@mui/material/Tooltip";

export default function ApplicationStatus() {
    const [applications, setApplications] = useState([]);
    const [error, setError] = useState("");
    const [actions, setActions] = useState(false);
    const [editingApplication, setEditingApplication] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        fetchApplications();
    }, []);

    const fetchApplications = async () => {
        setIsLoading(true);
        try {
            const data = await fetchLoanApplications();
            let applicationsArray = Array.isArray(data) ? data : [data];
            setApplications(
                applicationsArray.map((app) => ({ ...app, status: "Pending" }))
            );
        } catch (err) {
            console.error("Error fetching applications:", err);
            setError(
                typeof err === "string"
                    ? err
                    : "An error occurred while fetching applications"
            );
        } finally {
            setIsLoading(false);
        }
    };

    const handleEdit = (application) => {
        setEditingApplication(application);
        setActions(null);
    };

    const handleSaveEdit = async (updatedApplication) => {
        try {
            const response = await fetch(
                `http://localhost:3000/api/loan-applications/updateApplication/${updatedApplication._id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(updatedApplication),
                }
            );

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(
                    errorData.message ||
                        `HTTP error! status: ${response.status}`
                );
            }

            await fetchApplications();
            setEditingApplication(null);
        } catch (err) {
            console.error("Error updating application:", err);
            setError(
                err.message || "An error occurred while updating application"
            );
        }
    };

    const handleApplicationDeleted = async (deletedId) => {
        setApplications(applications.filter((app) => app._id !== deletedId));
        setEditingApplication(null);
        await fetchApplications();
    };

    const deleteApplication = async (id) => {
        try {
            const response = await fetch(
                `http://localhost:3000/api/loan-applications/deleteApplication/${id}`,
                {
                    method: "DELETE",
                }
            );

            if (response.ok) {
                await handleApplicationDeleted(id);
                setActions(null);
            } else {
                const errorData = await response.json();
                throw new Error(
                    errorData.message || "Failed to delete application"
                );
            }
        } catch (err) {
            console.error("Error deleting application:", err);
            setError(
                err.message || "An error occurred while deleting application"
            );
        }
    };

    const handleDownload = async (application) => {
        try {
            const pdfBlob = await generatePDF(application);
            const url = URL.createObjectURL(pdfBlob);
            const link = document.createElement("a");
            link.href = url;
            link.download = `application_${application._id}.pdf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (err) {
            console.error("Error generating PDF:", err);
            setError(
                typeof err === "string"
                    ? err
                    : "An error occurred while generating PDF"
            );
        }
    };

    return (
        <>
            <div className="rounded-md overflow-hidden h-full">
                {applications.length === 0 ? (
                    <>
                        <p className="p-2 border rounded-md shadow-sm flex gap-1 items-center">
                            <Warning /> No applications found.
                        </p>
                        <button
                            onClick={fetchApplications}
                            className="p-2.5 border rounded-md shadow-sm flex gap-1 items-center"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <TailSpin
                                    height="15"
                                    width="20"
                                    color="#000"
                                    ariaLabel="loading"
                                />
                            ) : (
                                <ArrowClockwise />
                            )}
                        </button>
                    </>
                ) : (
                    <div className="flex flex-col gap-4">
                        {applications.map((app) => (
                            <div
                                key={app._id}
                                className="bg-gradient-to-br from-orange-100 border border-gray-600 rounded-lg shadow-sm p-4 flex justify-between"
                            >
                                <div>
                                    <p className="text-xs">{app.loanId}</p>
                                    <p className="text-lg mb-4">
                                        {app.FirstName} {app.MiddleName}{" "}
                                        {app.LastName}
                                    </p>
                                    <p className="text-sm ">
                                        Loan Type: {app.LoanType}
                                    </p>
                                    <p className="text-sm ">
                                        Amount: {app.DesiredLoanAmount}
                                    </p>
                                    <p className="text-sm ">
                                        Duration: {app.LoanTenure}
                                    </p>
                                </div>
                                <div className="flex flex-col justify-between items-center">
                                    <span className="text-xs bg-yellow-50 text-amber-600 rounded-full border border-amber-600 px-1.5">
                                        PENDING
                                    </span>
                                    <div className="flex gap-2">
                                        <Tooltip title="Edit" arrow>
                                            <button
                                                onClick={() => handleEdit(app)}
                                                className="text-sm text-gray-700 hover:text-gray-900"
                                            >
                                                <Pen />
                                            </button>
                                        </Tooltip>

                                        <Tooltip title="Delete" arrow>
                                            <button
                                                onClick={() =>
                                                    deleteApplication(app._id)
                                                }
                                                className="text-sm text-red-700"
                                            >
                                                <TrashSimple />
                                            </button>
                                        </Tooltip>

                                        <Tooltip title="Download" arrow>
                                            <button
                                                onClick={() =>
                                                    handleDownload(app)
                                                }
                                                className="text-sm text-gray-700 hover:text-gray-900"
                                            >
                                                <DownloadSimple />
                                            </button>
                                        </Tooltip>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
                {editingApplication && (
                    <EditModal
                        application={editingApplication}
                        onSave={handleSaveEdit}
                        onCancel={() => setEditingApplication(null)}
                        onApplicationDeleted={handleApplicationDeleted}
                    />
                )}
            </div>
        </>
    );
}
