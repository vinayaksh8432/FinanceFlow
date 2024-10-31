import React, { useEffect, useState } from "react";
import ApplicationStatus from "./ApplicationStatus";
import { ThreeDots } from "react-loader-spinner";
import { ArrowCircleRight, ArrowLeft } from "@phosphor-icons/react";
import { useNavigate } from "react-router-dom";
import { fetchLoanTypes } from "../../utils/api";

export default function Loan() {
    const [showApplicationStatus, setShowApplicationStatus] = useState(false);
    const [isLoading, setLoading] = useState(true);
    const navigate = useNavigate();
    const [loanTypes, setLoanTypes] = useState([]);
    const [error, setError] = useState(null);

    const handleMyLoansClick = () => {
        navigate("/dashboard/loan/loanstatus");

        setLoading(false);
    };

    const handleApplyLoanClick = () => {
        navigate("/dashboard/loan/applynewloan");
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
            {isLoading ? (
                <div className="p-4 bg-white rounded-md flex flex-col gap-4 shadow-sm">
                    <div className="grid grid-cols-3 gap-4">
                        {loanTypes.map((type) => (
                            <div
                                key={type.id}
                                className="flex gap-6 text-sm border border-gray-300 rounded-lg shadow-inner"
                            >
                                <div className="flex flex-col gap-6">
                                    <div className="flex justify-between p-4 pb-0">
                                        <h1 className="text-base leading-[1] ">
                                            {type.name}
                                        </h1>
                                        <button className="border rounded-full px-2 bg-gray-100 text-xs tracking-wide font-[SFPro-Reg]">
                                            Starting from {type.interestRate}
                                        </button>
                                    </div>
                                    <div className="flex gap-4 pl-4 pb-4">
                                        <div className="flex flex-col gap-5">
                                            <p className="text-sm text-gray-500">
                                                {type.description}
                                            </p>
                                            <h1 className="font-[SFPro-Reg] w-min bg-orange-50 border border-orange-400 px-2 py-1 leading-[1] rounded-full text-xs tracking-wide text-nowrap">
                                                Upto {type.upto}
                                            </h1>
                                        </div>
                                        <img
                                            src={`${
                                                import.meta.env.VITE_BACKEND_URL
                                            }/${type.typeImage}`}
                                            alt={`${type.name} icon`}
                                            className="w-24 h-auto mx-auto object-contain drop-shadow-md"
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <button
                        onClick={handleMyLoansClick}
                        className="text-left text-base flex gap-4 items-center justify-between border border-gray-300 rounded-lg py-2 px-4 hover:bg-gray-100 shadow-sm"
                    >
                        <p>
                            My Loans
                            <br />
                            <span className="text-sm text-gray-500">
                                View and manage your existing borrowings
                            </span>
                        </p>
                        <ArrowCircleRight size={24} />
                    </button>

                    <button
                        onClick={handleApplyLoanClick}
                        type="button"
                        className="text-left text-base flex gap-4 items-center justify-between border border-gray-300 rounded-lg py-2 px-4 hover:bg-gray-100 shadow-sm"
                    >
                        <p>
                            Apply for a New Loan
                            <br />
                            <span className="text-sm text-gray-500">
                                Start a new loan application
                            </span>
                        </p>
                        <ArrowCircleRight size={24} />
                    </button>
                </div>
            ) : (
                <div className="m-auto flex h-5/6">
                    <div className="m-auto flex flex-col gap-4 items-center">
                        <h1>please wait a moment</h1>
                        <l-leapfrog size="40" speed="3.0" color="black" />
                    </div>
                </div>
            )}
        </>
    );
}
