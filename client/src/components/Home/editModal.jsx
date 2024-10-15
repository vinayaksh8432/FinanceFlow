import React, { useEffect, useRef, useState } from "react";
import { fetchLoanTenure, fetchLoanTypes } from "../../utils/api";
import { ArrowLineRight } from "@phosphor-icons/react";
import { FaCheck } from "react-icons/fa6";
import { FaTrash } from "react-icons/fa";
import { RiCloseLargeFill } from "react-icons/ri";
import { TailSpin } from "react-loader-spinner";

const EditModal = ({ application, onSave, onCancel, onApplicationDeleted }) => {
    const [editedApplication, setEditedApplication] = useState({
        FirstName: application?.FirstName || "",
        LastName: application?.LastName || "",
        email: application?.email || "",
        phone: application?.phone || "",
        LoanType: application?.LoanType || "",
        DesiredLoanAmount: application?.DesiredLoanAmount || "",
        LoanTenure: application?.LoanTenure || "",
    });
    const [error, setError] = useState("");
    const actionMenuRef = useRef(null);
    const [selectedLoanType, setSelectedLoanType] = useState([]);
    const [selectedLoanTenure, setSelectedLoanTenure] = useState([]);
    const [action, setAction] = useState(null);
    const [isLoading, setLoading] = useState(false);

    useEffect(() => {
        const getLoanTypes = async () => {
            try {
                const data = await fetchLoanTypes();
                setSelectedLoanType(data);
            } catch (err) {
                setError(err.message || "Failed to fetch loan types");
                console.error("Error fetching loan types:", err);
            }
        };

        const getLoanTenure = async () => {
            try {
                const response = await fetchLoanTenure();
                setSelectedLoanTenure(response);
            } catch (err) {
                setError(err.message || "Failed to fetch loan tenure");
                console.error("Error fetching loan tenure:", err);
            }
        };

        getLoanTypes();
        getLoanTenure();
    }, []);

    const handleLoanTypeSelect = (loanType) => {
        setEditedApplication((prev) => ({ ...prev, LoanType: loanType }));
    };

    const handleLoanTenureSelect = (loanTenure) => {
        setEditedApplication((prev) => ({ ...prev, LoanTenure: loanTenure }));
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditedApplication((prev) => ({ ...prev, [name]: value }));
    };

    const handleDeleteApplication = async () => {
        if (!application?._id) {
            setError("Cannot delete application: Invalid application ID");
            return;
        }

        setLoading(true);
        try {
            const response = await fetch(
                `http://localhost:3000/api/loan-applications/deleteApplication/${application._id}`,
                {
                    method: "DELETE",
                }
            );

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(
                    errorData.message || "Failed to delete application"
                );
            }

            onApplicationDeleted(application._id);
            onCancel(); // Close the modal after successful deletion
        } catch (err) {
            console.error("Error deleting application:", err);
            setError(
                err.message || "An error occurred while deleting application"
            );
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await onSave({ ...application, ...editedApplication });
        } finally {
            setLoading(false);
        }
    };

    if (!application) {
        return null; // Or display an error message
    }

    const toggleAction = () => {
        setAction(!action);
    };

    return (
        <div className="fixed inset-0 bg-slate-400 bg-opacity-35 flex justify-end">
            <form
                onSubmit={handleSubmit}
                ref={actionMenuRef}
                className="bg-white py-4 px-6 w-1/3 rounded-tl-3xl flex flex-col justify-between"
            >
                <div>
                    <div className="flex justify-between pb-4">
                        <button
                            type="button"
                            onClick={onCancel}
                            className="-mx-0 px-2 text-gray-400 rounded-md hover:text-gray-600 hover:bg-gray-200 text-lg"
                        >
                            <ArrowLineRight />
                        </button>
                        <div className="flex justify-end gap-4">
                            <button
                                type="submit"
                                className="px-4 py-2 bg-blue-400 text-white rounded text-xs flex items-center gap-2 hover:bg-blue-500"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <TailSpin
                                        height="20"
                                        width="20"
                                        color="#ffffff"
                                        ariaLabel="loading"
                                    />
                                ) : (
                                    <>
                                        <FaCheck />
                                        Save Changes
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                    <hr className="border-t border-gray-200 -mx-6" />
                </div>
                <div className="flex flex-col h-full justify-evenly">
                    <h1 className="text-2xl font-semibold tracking-wide">
                        Edit Application
                    </h1>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col gap-2">
                            <label>First Name</label>
                            <input
                                type="text"
                                name="FirstName"
                                value={editedApplication.FirstName}
                                onChange={handleChange}
                                className="w-full p-2 border rounded"
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label>Last Name</label>
                            <input
                                type="text"
                                name="LastName"
                                value={editedApplication.LastName}
                                onChange={handleChange}
                                className="w-full p-2 border rounded"
                            />
                        </div>
                        <div>
                            <label>Email</label>
                            <input
                                type="text"
                                name="email"
                                value={editedApplication.email}
                                onChange={handleChange}
                                className="w-full p-2 border rounded"
                            />
                        </div>
                        <div>
                            <label>Phone</label>
                            <input
                                type="number"
                                name="phone"
                                value={editedApplication.phone}
                                onChange={handleChange}
                                className="w-full p-2 border rounded"
                            />
                        </div>
                    </div>
                    <div className="flex flex-col gap-2">
                        <label>Loan Type</label>
                        <div className="grid grid-cols-3 gap-4">
                            {selectedLoanType.map((type) => (
                                <button
                                    key={type.id}
                                    type="button"
                                    onClick={() =>
                                        handleLoanTypeSelect(type.name)
                                    }
                                    className={`py-2 px-4 rounded-md border transition-all duration-200 ${
                                        editedApplication.LoanType === type.name
                                            ? "bg-gray-800 text-white transition-all"
                                            : "border-gray-300 hover:bg-gray-100 transition-all"
                                    }`}
                                >
                                    {type.name}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="flex justify-between items-center">
                        <label>Loan Amount</label>
                        <input
                            type="number"
                            name="DesiredLoanAmount"
                            value={editedApplication.DesiredLoanAmount}
                            onChange={handleChange}
                            className="p-2 border rounded"
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label>Loan Tenure</label>
                        <div className="grid grid-cols-3 gap-4">
                            {selectedLoanTenure.map((tenure) => (
                                <button
                                    key={tenure.id}
                                    type="button"
                                    onClick={() =>
                                        handleLoanTenureSelect(tenure.name)
                                    }
                                    className={`py-2 px-4 rounded-md border border-gray-300 transition-all duration-200 ${
                                        editedApplication.LoanTenure ===
                                        tenure.name
                                            ? "bg-gray-800 text-white transition-all"
                                            : "border border-gray-300 hover:bg-gray-100 transition-all"
                                    }`}
                                >
                                    {tenure.name}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
                <div>
                    <hr className="border-t border-gray-200 -mx-6 pb-4" />
                    <div className="flex gap-4 items-center">
                        <button
                            type="button"
                            className="bg-red-400 text-red-900 px-4 py-2 text-sm rounded-md flex gap-2 items-center "
                            onClick={toggleAction}
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <TailSpin
                                    height="20"
                                    width="20"
                                    color="#ffffff"
                                    ariaLabel="loading"
                                />
                            ) : (
                                <>
                                    <FaTrash />
                                    Withdraw Application
                                </>
                            )}
                        </button>

                        {action && (
                            <div className="bg-white rounded-md flex gap-2 text-xs">
                                <button
                                    className="p-2 border rounded hover:bg-gray-100"
                                    onClick={handleDeleteApplication}
                                >
                                    <FaCheck />
                                </button>
                                <button
                                    className="p-2 border rounded hover:bg-gray-100"
                                    onClick={() => setAction(null)}
                                >
                                    <RiCloseLargeFill />
                                </button>
                            </div>
                        )}
                    </div>
                </div>
                {error && <p className="text-red-500 mt-2">{error}</p>}
            </form>
        </div>
    );
};

export default EditModal;
