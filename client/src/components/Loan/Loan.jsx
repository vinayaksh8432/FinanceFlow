import React, { useState, useEffect } from "react";
import ApplicationStatus from "./ApplicationStatus";
import ApplyLoan from "./ApplyLoan";

export default function Loan() {
    const [showApplicationStatus, setShowApplicationStatus] = useState(false);

    useEffect(() => {
        checkApplications();
    }, []);

    const checkApplications = async () => {
        try {
            const response = await fetch(
                "http://localhost:3000/api/loan-applications"
            );
            const data = await response.json();
            setShowApplicationStatus(data.length > 0);
        } catch (error) {
            console.error("Error checking applications:", error);
        }
    };

    const handleFormSubmit = () => {
        setShowApplicationStatus(true);
        checkApplications();
    };

    const handleApplyClick = () => {
        setShowApplicationStatus(false);
    };

    return (
        <div className="bg-white rounded-xl flex flex-col overflow-hidden gap-4">
            {showApplicationStatus ? (
                <ApplicationStatus onApplyClick={handleApplyClick} />
            ) : (
                <ApplyLoan onFormSubmit={handleFormSubmit} />
            )}
        </div>
    );
}
