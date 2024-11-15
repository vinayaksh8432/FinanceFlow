import { Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "../components/Sidebar/sidebar";
import Loan from "../components/Loan/Loan";
import ApplyLoan from "../components/Loan/ApplyLoan";
import ApplicationStatus from "../components/Loan/ApplicationStatus";
import StockMarket from "../components/Stocks/Market";
import Portfolio from "../components/Stocks/Portfolio";
import UserDetails from "../components/UserDetails";
import Home from "@/components/Home/Home";
import Insurance from "@/components/Insurance/insurance";
import ApplyInsurance from "@/components/Insurance/components/applyInsurance";
import { leapfrog } from "ldrs";
import { useEffect, useState } from "react";

leapfrog.register();

export default function Dashboard() {
    const [loading, isLoading] = useState(true);

    useEffect(() => {
        setTimeout(() => {
            isLoading(false);
        }, 1000);
    });

    return (
        <div className="flex relative bg-blue-50 min-h-screen">
            <Sidebar />

            <div className="flex-1 overflow-auto h-screen">
                <div className="h-full relative flex flex-col">
                    <UserDetails />
                    <div className="flex-1 p-4 bg-blue-50">
                        {loading ? (
                            <div className="m-auto flex h-3/4">
                                <div className="m-auto flex flex-col gap-4 items-center">
                                    <h1>please wait a moment</h1>
                                    <l-leapfrog
                                        size="40"
                                        speed="3.0"
                                        color="black"
                                    />
                                </div>
                            </div>
                        ) : (
                            <>
                                <Routes>
                                    <Route
                                        index
                                        element={<Navigate to="home" replace />}
                                    />
                                    <Route path="home" element={<Home />} />
                                    <Route
                                        path="insurance"
                                        element={<Insurance />}
                                    />
                                    <Route
                                        path="insurance/applynewinsurance"
                                        element={<ApplyInsurance />}
                                    />
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
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
