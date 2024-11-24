import { fetchLoanTypes } from "@/utils/api";
import { useEffect, useState } from "react";
import loanStrip from "@/assets/loanStrip.png";
import { FaLongArrowAltRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function LoanCard() {
    const navigate = useNavigate();
    const [loanTypes, setLoanTypes] = useState([]);

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
    });

    return (
        <>
            <div className="overflow-hidden">
                <img src={loanStrip} alt="" className="w-full rounded-t-xl" />
                <div className="border border-t-0 border-gray-300 rounded-xl rounded-t-none">
                    <div className="flex justify-between py-4 items-center px-4">
                        <div>
                            <h1>
                                Explore the perfect loan for your needs at our
                                one-stop destination. We offer a variety of
                                loans tailored for individuals, professionals,
                                and MSMEs.
                            </h1>
                            <h1>
                                Check exclusive loan offers for loan products
                                just for you
                            </h1>
                        </div>
                        <div>
                            <button
                                onClick={() =>
                                    navigate("/dashboard/loan/applynewloan")
                                }
                                className="bg-gradient-to-r from-blue-600 to-blue-400 rounded-full py-2 px-6 font-semibold text-white"
                            >
                                Apply Loan
                            </button>
                        </div>
                    </div>
                    <hr />
                    <div className="px-4 py-4 space-y-4">
                        <div className="flex justify-between items-center">
                            <h1 className="text-lg font-semibold">
                                All Loan Types
                            </h1>
                            <button
                                onClick={() => navigate("/dashboard/loan")}
                                className="text-sm text-gray-500 hover:text-gray-600 flex gap-2 items-center"
                            >
                                View all <FaLongArrowAltRight size={16} />
                            </button>
                        </div>
                        <div className="grid grid-cols-6 gap-4">
                            {loanTypes.map((item, index) => (
                                <div
                                    key={index}
                                    className="border border-gray-300 rounded-lg flex flex-col justify-between items-center bg-gradient-to-b from-blue-300 to-blue-100 overflow-hidden"
                                >
                                    <div className="m-auto">
                                        <img
                                            src={`${
                                                import.meta.env.VITE_BACKEND_URL
                                            }/${item.typeImage}`}
                                            alt={`${item.name} icon`}
                                            className="w-28 h-auto object-contain drop-shadow-lg p-2 flex justify-center"
                                        />
                                    </div>
                                    <h1 className="border-t w-full text-center py-1 bg-blue-50">
                                        {item.name} Loan
                                    </h1>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
