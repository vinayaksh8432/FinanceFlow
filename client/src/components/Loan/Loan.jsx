import React, { useEffect, useState } from "react";
import { ArrowCircleRight } from "@phosphor-icons/react";
import { useNavigate } from "react-router-dom";
import { fetchLoanTypes } from "@/utils/api";

export default function Loan() {
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
            <div className="flex gap-4 h-full">
                <div className="flex flex-col gap-4 border-r border-gray-300 pr-4 w-3/4">
                    <button
                        onClick={handleMyLoansClick}
                        className="bg-blue-300 bg-opacity-40 text-left text-base flex items-center justify-between rounded-lg py-3 px-6 hover:bg-opacity-75 transition-colors shadow-sm"
                    >
                        <p className="flex flex-col">
                            My Loans
                            <span className="text-sm text-neutral-600">
                                View and manage your existing borrowings
                            </span>
                        </p>
                        <ArrowCircleRight size={24} />
                    </button>

                    <button
                        onClick={handleApplyLoanClick}
                        type="button"
                        className="bg-blue-300 bg-opacity-40 text-left text-base flex items-center justify-between rounded-lg py-3 px-6 hover:bg-opacity-75 transition-colors shadow-sm"
                    >
                        <p className="flex flex-col">
                            Apply for a New Loan
                            <span className="text-sm text-neutral-600">
                                Start a new loan application
                            </span>
                        </p>
                        <ArrowCircleRight size={24} />
                    </button>
                </div>
                <div className="grid grid-cols-2 gap-4 ">
                    {loanTypes.map((type) => (
                        <div
                            key={type.id}
                            className="bg-blue-300 bg-opacity-40 flex gap-6 text-sm rounded-lg shadow-inner"
                        >
                            <div className="flex flex-col gap-4">
                                <div className="flex justify-between p-6 pb-0">
                                    <h1 className="text-base font-medium">
                                        {type.name} Loan
                                    </h1>
                                    <button className="border rounded-full px-2 bg-gray-100 text-xs tracking-wide">
                                        Starting from {type.interestRate}
                                    </button>
                                </div>
                                <div className="flex gap-4 pl-6 pb-6">
                                    <div className="flex flex-col gap-5">
                                        <p className="text-sm">
                                            {type.description}
                                        </p>
                                        <h1 className="w-min bg-orange-50 border border-orange-400 px-2 py-1 leading-[1] rounded-full text-xs tracking-wide text-nowrap">
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
            </div>

            <div>
                {error && (
                    <div className="text-red-500 text-center mt-4">{error}</div>
                )}
            </div>
        </>
    );
}
