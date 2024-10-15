import React, { useEffect, useState, useRef } from "react";
import { fetchLoanApplications } from "../../utils/api";
import {
    ArrowClockwise,
    DotsThree,
    DownloadSimple,
    Pen,
    TrashSimple,
    Warning,
    WarningCircle,
} from "@phosphor-icons/react";
import EditModal from "../Home/editModal";
import { generatePDF } from "../../utils/pdfGenerator";
import { TailSpin } from "react-loader-spinner";

export default function ApplicationStatus() {
    const [applications, setApplications] = useState([]);
    const [error, setError] = useState("");
    const [actions, setActions] = useState(false);
    const [editingApplication, setEditingApplication] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const actionMenuRef = useRef(null);

    useEffect(() => {
        fetchApplications();
    }, []);

    const toggleAction = (index) => {
        setActions(actions === index ? false : index);
    };

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
        <div className="max-w-7xl bg-white p-4 rounded-md ">
            <h1 className="text-2xl font-bold mb-4">Application Status</h1>
            {applications.length === 0 ? (
                <div className="flex items-center gap-2 text-sm">
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
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {applications.map((app, index) => (
                        <div
                            key={app._id}
                            className="border border-gray-300 rounded-lg shadow-sm p-4 flex items-start justify-between"
                        >
                            <div>
                                <h2 className="text-lg font-semibold">
                                    {app.FirstName} {app.MiddleName}{" "}
                                    {app.LastName}
                                </h2>
                                <p className="text-sm text-gray-600">
                                    Loan Type: {app.LoanType}
                                </p>
                                <p className="text-sm text-gray-600">
                                    Amount: {app.DesiredLoanAmount}
                                </p>
                                <p className="text-sm text-gray-600">
                                    Duration: {app.LoanTenure}
                                </p>
                                <p className="text-sm text-gray-600">
                                    Status:{" "}
                                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                                        PENDING
                                    </span>
                                </p>
                            </div>
                            <div className="relative">
                                <button
                                    onClick={() => toggleAction(index)}
                                    className="relative"
                                >
                                    <DotsThree
                                        size={24}
                                        className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-sm "
                                    />
                                </button>
                                {actions === index && (
                                    <div
                                        ref={actionMenuRef}
                                        className="absolute z-10 rounded-md bg-white border border-gray-200 flex flex-col items-center"
                                    >
                                        <button
                                            onClick={() => handleEdit(app)}
                                            className="py-2 px-4 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 w-full flex justify-between items-center"
                                        >
                                            Edit
                                            <Pen />
                                        </button>
                                        <hr className="border-t border-neutral-200 w-4/5" />
                                        <button
                                            onClick={() =>
                                                deleteApplication(app._id)
                                            }
                                            className="py-2 px-4 text-sm text-red-700 hover:bg-red-100 hover:text-red-900 w-full flex justify-between items-center"
                                        >
                                            Delete
                                            <TrashSimple />
                                        </button>
                                        <hr className="border-t border-neutral-200 w-4/5" />
                                        <button
                                            onClick={() => handleDownload(app)}
                                            className="py-2 px-4 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 w-full flex justify-between items-center gap-2"
                                        >
                                            Download
                                            <DownloadSimple />
                                        </button>
                                    </div>
                                )}
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
    );
}
