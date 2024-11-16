import { useState, useEffect, useRef } from "react";
import { fetchUserQuotas } from "@/utils/api";
import { LuBadgeCheck } from "react-icons/lu";
import { ClockClockwise } from "@phosphor-icons/react";
import { FiAlertCircle } from "react-icons/fi";

const PolicyCard = ({ policy, isExpanded, onToggle, rowRef }) => {
    const getStatusIcon = (status) => {
        switch (status) {
            case "Active":
                return <LuBadgeCheck className="w-6 h-6 text-green-500" />;
            case "Pending":
                return <ClockClockwise className="w-6 h-6 text-yellow-500" />;
            case "Expired":
                return <FiAlertCircle className="w-6 h-6 text-red-500" />;
            default:
                return null;
        }
    };
    
    const [showDetails, setShowDetails] = useState(false);

    return (
        <div
            ref={rowRef}
            className="border border-gray-300 rounded-xl overflow-hidden flex flex-col gap-2 h-full"
        >
            <div className="flex flex-col bg-blue-300 bg-opacity-40">
                <div className="flex items-center justify-between w-full px-4 py-2">
                    <div>
                        <h1>{policy.id}</h1>
                        <h3 className="text-lg font-semibold">{policy.name}</h3>
                        <span className="font-medium">{policy.type}</span>
                    </div>
                    {policy.status && (
                        <div className="flex items-center gap-2 border border-gray-300 bg-blue-100 px-2 py-1 rounded-md">
                            {policy.status} {getStatusIcon(policy.status)}
                        </div>
                    )}
                </div>
                <hr className="border border-gray-300 w-full" />
            </div>

            <div className="grid grid-cols-3 gap-4 px-4 pb-2">
                <div className="flex flex-col">
                    <span className="text-gray-600">Coverage</span>
                    <span className="font-medium">
                        ₹{policy.coverage.toLocaleString()}
                    </span>
                </div>
                <div className="flex flex-col">
                    <span className="text-gray-600">Premium</span>
                    <span className="font-medium">
                        ₹{policy.premium.toLocaleString()}/year
                    </span>
                </div>
                <div className="flex flex-col">
                    <span className="text-gray-600">Valid Till</span>
                    <span className="font-medium">
                        {new Date(policy.endDate).toLocaleDateString()}
                    </span>
                </div>
            </div>
            <hr className="border border-gray-300 w-full" />
            <div className="flex justify-center pb-2">
                <button
                    className="border border-gray-400 rounded-full px-2"
                    onClick={() => setShowDetails(!showDetails)}
                >
                    {showDetails ? "Hide Details" : "View Policies"}
                </button>
            </div>
            {policy.details && showDetails && (
                <div className="px-4 pb-2">
                    <div className="text-sm font-medium mb-2">
                        Policy Details:
                    </div>
                    <ul className="text-sm text-gray-600 space-y-1">
                        {Object.entries(policy.details).map(([key, value]) => (
                            <li key={key}>{value}</li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default function InsuranceStatus() {
    const [policies, setPolicies] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadPolicies = async () => {
            try {
                const data = await fetchUserQuotas();
                setPolicies(Array.isArray(data) ? data : []);
            } catch (err) {
                setError("Failed to fetch insurance policies");
                console.error("Error fetching policies:", err);
            }
        };

        loadPolicies();
    }, []);

    if (error) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="text-red-500 text-center">
                    <p className="text-xl font-semibold">Error</p>
                    <p>{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center border border-gray-300 px-4 py-2 rounded-xl">
                <h1 className="text-2xl font-bold">My Insurance Policies</h1>
                <span className="text-sm text-gray-600">
                    Total Policies: {policies.length}
                </span>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {policies.map((policy) => (
                    <PolicyCard key={policy._id} policy={policy} />
                ))}
            </div>
            {policies.length === 0 && (
                <div className="text-center text-gray-500 py-12">
                    <p>No insurance policies found.</p>
                </div>
            )}
        </div>
    );
}
