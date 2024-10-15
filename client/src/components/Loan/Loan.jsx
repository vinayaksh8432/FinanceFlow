import React, { useEffect, useState } from "react";
import ApplicationStatus from "./ApplicationStatus";
import { ThreeDots } from "react-loader-spinner";
import { ArrowCircleRight, ArrowLeft } from "@phosphor-icons/react";
import { useNavigate } from "react-router-dom";
import { fetchLoanTypes } from "../../utils/api";

export default function Loan() {
    const [showApplicationStatus, setShowApplicationStatus] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const [loanTypes, setLoanTypes] = useState([]);
    const [error, setError] = useState(null);

    const handleMyLoansClick = () => {
        setShowApplicationStatus(true);

        setLoading(false);
    };

    const handleApplyLoanClick = () => {
        navigate("/dashboard/loan/applynewloan");
    };

    const handleBackToOptions = () => {
        setShowApplicationStatus(false);
    };

    useEffect(() => {
        const getLoanTypes = async () => {
            try {
                const data = await fetchLoanTypes();
                setLoanTypes(data);
                setError(null);
            } catch (err) {
                setError(err.message || "Failed to fetch loan types");
                console.error("Error fetching loan types:", err);
            }
        };

        getLoanTypes();
    }, []);

    return (
        <>
            {loading ? (
                <ThreeDots color="#64b5f6" width="70" height="70" />
            ) : (
                <>
                    {!showApplicationStatus && (
                        <div className="p-4 bg-white rounded-md flex flex-col gap-4">
                            <div className="grid grid-cols-3 gap-4">
                                {loanTypes.map((type) => (
                                    <div
                                        key={type.id}
                                        className="flex gap-4 text-justify text-sm border rounded-md p-2"
                                    >
                                        <div>
                                            <div className="flex justify-between pb-2">
                                                <h1>{type.name}</h1>
                                                <button className="border rounded-full px-2 bg-gray-100">
                                                    {type.interestRate}
                                                </button>
                                            </div>
                                            <p className="text-xs text-gray-500">
                                                {type.description}
                                            </p>
                                        </div>
                                        <img
                                            src={`${
                                                import.meta.env.VITE_BACKEND_URL
                                            }${type.typeImage}`}
                                            alt={`${type.name} icon`}
                                            className="w-16 h-16 mt-2 mx-auto object-contain"
                                        />
                                    </div>
                                ))}
                            </div>
                            <button
                                onClick={handleMyLoansClick}
                                className="text-left text-sm flex gap-4 items-center justify-between border border-gray-300 rounded-xl py-2 px-4 hover:bg-gray-100 shadow-sm"
                            >
                                <p>
                                    My Loans
                                    <br />
                                    <span className="text-xs text-gray-500">
                                        View and manage your existing borrowings
                                    </span>
                                </p>
                                <ArrowCircleRight size={24} />
                            </button>

                            <button
                                onClick={handleApplyLoanClick}
                                className="text-left text-sm flex gap-4 items-center justify-between border border-gray-300 rounded-xl py-2 px-4 hover:bg-gray-100 shadow-sm"
                            >
                                <p>
                                    Apply For a New Loan
                                    <br />
                                    <span className="text-xs text-gray-500">
                                        Start a new loan application
                                    </span>
                                </p>
                                <ArrowCircleRight size={24} />
                            </button>

                            {/* <div className="flex items-center gap-12 border rounded-md px-4">
                                <div className="text-left space-y-2 text-sm">
                                    <p>
                                        Get a Step Closer to <br /> your Dream
                                        Home <br />
                                        with FinanceFlow <br /> Home Loan
                                    </p>
                                    <button className="border border-gray-300 px-4 py-2 rounded-xl">
                                        Get Started
                                    </button>
                                </div>
                                <img
                                    src={home}
                                    alt="home"
                                    className="w-40 h-auto p-4"
                                />
                            </div> */}
                        </div>
                    )}
                    {showApplicationStatus && (
                        <>
                            <button
                                onClick={handleBackToOptions}
                                className="text-blue-500 hover:text-blue-700 flex items-center gap-2 pb-2"
                            >
                                <ArrowLeft /> Back to loan options
                            </button>
                            <ApplicationStatus />
                        </>
                    )}
                </>
            )}
        </>
    );
}
