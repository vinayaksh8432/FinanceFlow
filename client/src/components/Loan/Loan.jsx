import React, { useEffect, useState } from "react";
import { ArrowCircleRight } from "@phosphor-icons/react";
import { useNavigate } from "react-router-dom";
import { fetchLoanTypes } from "@/utils/api";

export default function Loan() {
    const navigate = useNavigate();
    const [loanTypes, setLoanTypes] = useState([]);

    const handleMyLoansClick = () => {
        navigate("/dashboard/loan/loanstatus");
    };

    const handleApplyLoanClick = () => {
        navigate("/dashboard/loan/applynewloan");
    };

    useEffect(() => {
        const getLoanTypes = async () => {
            try {
                const data = await fetchLoanTypes();
                setLoanTypes(data);
            } catch (err) {
                console.error("Error fetching loan types:", err);
            }
        };

        getLoanTypes();
    }, []);

    return (
        <div className="h-full flex gap-10 p-2">
            <div className="w-full h-full flex flex-col gap-6">
                <div className="grid grid-cols-3 gap-8">
                    <button
                        onClick={handleMyLoansClick}
                        className="bg-white border-2 border-blue-200 text-left flex items-center justify-between rounded-2xl px-6 py-4 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 hover:border-blue-400"
                    >
                        <div className="flex flex-col gap-2">
                            <h1 className="text-2xl font-bold text-blue-800">
                                My Loans
                            </h1>
                            <span className="text-sm text-gray-600">
                                View and manage your existing borrowings
                            </span>
                        </div>
                        <ArrowCircleRight size={40} className="text-blue-500" />
                    </button>

                    <button
                        onClick={handleApplyLoanClick}
                        className="bg-gradient-to-r from-blue-500 to-blue-700 text-left flex items-center justify-between rounded-2xl px-6 py-4 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
                    >
                        <div className="flex flex-col gap-2">
                            <h1 className="text-2xl font-bold text-white">
                                Apply for a New Loan
                            </h1>
                            <span className="text-sm text-blue-100">
                                Start a new loan application
                            </span>
                        </div>
                        <ArrowCircleRight size={40} className="text-white" />
                    </button>
                </div>

                <div className="grid grid-cols-3 gap-6">
                    {loanTypes.map((type) => (
                        <div
                            key={type.id}
                            className="bg-white border-2 border-blue-100 rounded-2xl flex flex-col text-center shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 hover:border-blue-300"
                        >
                            <div className="flex flex-col">
                                <div className="flex justify-between px-6 py-4 pb-0">
                                    <h1 className="text-lg font-semibold text-blue-800">
                                        {type.name} Loan
                                    </h1>
                                    <span className="bg-blue-50 text-blue-600 rounded-full px-4 py-1 text-xs font-medium flex items-center">
                                        Starting from {type.interestRate}
                                    </span>
                                </div>
                                <div className="flex gap-6 pl-6 pb-4 py-2">
                                    <div className="flex flex-col justify-between gap-4 flex-1">
                                        <p className="text-sm text-gray-600 text-left">
                                            {type.description}
                                        </p>
                                        <span className="w-max bg-orange-50 border border-orange-400 px-4 py-1 rounded-full text-sm font-medium text-orange-600">
                                            Upto {type.upto}
                                        </span>
                                    </div>
                                    <img
                                        src={`${
                                            import.meta.env.VITE_BACKEND_URL
                                        }/${type.typeImage}`}
                                        alt={`${type.name} icon`}
                                        className="w-28 h-24 object-contain drop-shadow-lg"
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
