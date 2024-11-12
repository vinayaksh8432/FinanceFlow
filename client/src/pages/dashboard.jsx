import { Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "../components/Sidebar/sidebar";
import Loan from "../components/Loan/Loan";
import ApplyLoan from "../components/Loan/ApplyLoan";
import ApplicationStatus from "../components/Loan/ApplicationStatus";
import StockMarket from "../components/Stocks/Market";
import Portfolio from "../components/Stocks/Portfolio";
import UserDetails from "../components/UserDetails";
import Home from "@/components/Home/Home";
import { useEffect, useState } from "react";
import { ThreeDots } from "react-loader-spinner";

export default function Dashboard() {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setTimeout(() => {
            setIsLoading(false);
        }, 2000);
    }, []);

    return (
        <div className="flex relative bg-blue-50 min-h-screen">
            <Sidebar />
            {isLoading ? (
                <div className="flex-1 h-screen w-full mx-auto flex items-center justify-center">
                    <ThreeDots color="#2563EB" height={50} width={50} />
                </div>
            ) : (
                <div className="flex-1 overflow-auto h-screen">
                    <div className="h-full relative flex flex-col">
                        <UserDetails />
                        <div className="flex-1 p-4 bg-blue-50">
                            <Routes>
                                <Route
                                    index
                                    element={<Navigate to="home" replace />}
                                />
                                <Route path="home" element={<Home />} />
                                <Route path="loan" element={<Loan />} />
                                <Route
                                    path="loan/applynewloan"
                                    element={<ApplyLoan />}
                                />
                                <Route
                                    path="loan/loanstatus"
                                    element={<ApplicationStatus />}
                                />
                                <Route
                                    path="portfolio"
                                    element={<Portfolio />}
                                />
                                <Route
                                    path="market"
                                    element={<StockMarket />}
                                />
                            </Routes>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
