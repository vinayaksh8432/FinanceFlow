import { Routes, Route, Navigate } from "react-router-dom";
import Home from "../components/Home/Home";
import Sidebar from "../components/Sidebar/sidebar";
import Loan from "../components/Loan/Loan";
import ApplyLoan from "../components/Loan/ApplyLoan";
import ApplicationStatus from "../components/Loan/ApplicationStatus";

export default function Dashboard() {
    return (
        <div className="flex relative">
            <div className="w-1/6 sticky self-start top-0 bg-gray-200">
                <div className="h-screen p-4">
                    <Sidebar />
                </div>
            </div>

            <div className="flex-1">
                <div className="p-4 h-full relative">
                    <Routes>
                        <Route index element={<Navigate to="home" replace />} />
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
                            path="activities"
                            element={<div>Activities Component</div>}
                        />
                    </Routes>
                </div>
            </div>
        </div>
    );
}
