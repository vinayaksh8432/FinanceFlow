import { useState, useEffect } from "react";
import { fetchAllInsurance, createInsuranceQuota } from "@/utils/api";
import { useNavigate } from "react-router-dom";
import { leapfrog } from "ldrs";
leapfrog.register();

export default function ApplyInsurance() {
    const [insuranceData, setInsuranceData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedType, setSelectedType] = useState("All");
    const [processingQuoteId, setProcessingQuoteId] = useState(null); // Track which quote is being processed
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const data = await fetchAllInsurance();
                setInsuranceData(data);
                setError(null);
            } catch (err) {
                setError(
                    "Failed to fetch insurance data. Please try again later."
                );
                console.error("Error:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleGetQuote = async (insurance) => {
        try {
            setProcessingQuoteId(insurance.id); // Set the ID of the insurance being processed
            await createInsuranceQuota(insurance);
            navigate("/dashboard/insurance/insurancestatus");
        } catch (err) {
            console.error("Error getting quote:", err);
            setError("Failed to create insurance quote. Please try again.");
        } finally {
            setProcessingQuoteId(null); // Clear the processing state
        }
    };

    const filteredData = Array.isArray(insuranceData)
        ? selectedType === "All"
            ? insuranceData
            : insuranceData.filter(
                  (insurance) => insurance.catagory === selectedType
              )
        : [];

    if (error) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="text-red-500 text-center">
                    <p className="text-xl font-semibold">Error</p>
                    <p>{error}</p>
                </div>
            </div>
        );
    }

    return (
        <>
            <div
                className="flex gap-4 overflow-hidden h-full"
                style={{ maxHeight: "calc(100vh - 14vh)" }}
            >
                <div className="flex flex-col gap-4 items-start sticky top-0 border border-gray-300 rounded-xl p-4">
                    <h1 className="text-xl font-bold">Filters</h1>
                    <hr className="border border-gray-200 w-full" />
                    <p className="font-medium">Catagory</p>
                    <div className="grid grid-cols-2 gap-3 text-sm rounded-xl">
                        {["All", "Health", "Car"].map((type) => (
                            <button
                                key={type}
                                onClick={() => setSelectedType(type)}
                                className={`px-4 py-2 rounded-lg transition-colors ${
                                    selectedType === type
                                        ? "bg-blue-500 text-white"
                                        : "bg-blue-100 hover:bg-gray-200"
                                }`}
                            >
                                {type}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="flex-1 flex flex-col gap-4 h-full border border-gray-300 rounded-xl p-4">
                    <h1 className="text-xl font-bold">
                        Results ({filteredData.length})
                    </h1>
                    <div className="overflow-y-auto flex flex-col gap-4 border-y border-gray-300 rounded-xl">
                        {filteredData.map((insurance) => (
                            <div
                                key={insurance.id}
                                className="border border-gray-400 shadow-sm rounded-xl p-6 hover:shadow-md transition-shadow"
                            >
                                <div className="flex justify-between">
                                    <div className="flex gap-4 items-start">
                                        <img
                                            src={insurance.image}
                                            alt={insurance.name}
                                            className="w-12 h-12 rounded-full border border-gray-300 shadow-inner"
                                        />
                                        <div className="flex flex-col items-start">
                                            <div>
                                                <h2 className="font-semibold text-lg">
                                                    {insurance.name}
                                                </h2>
                                                <p className="pb-1 text-gray-600">
                                                    {insurance.id}
                                                </p>
                                            </div>
                                            <div className="flex gap-2">
                                                <label className="text-xs bg-blue-100 px-3 py-1 rounded-full uppercase">
                                                    {insurance.type}
                                                </label>
                                                <label className="text-xs bg-green-100 px-3 py-1 rounded-full uppercase">
                                                    {insurance.catagory}
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                    {insurance.price && (
                                        <div className="text-right">
                                            <h3 className="font-semibold">
                                                Price
                                            </h3>
                                            <p className="text-lg text-blue-600">
                                                ₹{insurance.price}/year
                                            </p>
                                            {insurance.coverage && (
                                                <p className="text-sm text-gray-600">
                                                    Coverage: ₹
                                                    {insurance.coverage}
                                                </p>
                                            )}
                                        </div>
                                    )}
                                </div>

                                <div className="mt-4">
                                    <h3 className="font-semibold mb-2">
                                        Key Features:
                                    </h3>
                                    <ul className="list-disc list-inside space-y-1 text-gray-600">
                                        {Object.values(insurance.details).map(
                                            (detail, index) => (
                                                <li key={index}>{detail}</li>
                                            )
                                        )}
                                    </ul>
                                </div>

                                <hr className="my-4 border-gray-300" />

                                <div className="flex justify-end gap-4">
                                    <button className="px-4 py-2 border border-blue-500 rounded-full hover:bg-blue-50 transition-colors">
                                        Know More
                                    </button>
                                    <button
                                        onClick={() =>
                                            handleGetQuote(insurance)
                                        }
                                        disabled={
                                            processingQuoteId === insurance.id
                                        }
                                        className={`text-white px-4 py-2 border border-blue-400 bg-gradient-to-r from-blue-500 to-blue-300 rounded-full hover:shadow-md transition-all ${
                                            processingQuoteId === insurance.id
                                                ? "opacity-50 cursor-not-allowed"
                                                : ""
                                        }`}
                                    >
                                        {processingQuoteId === insurance.id
                                            ? "Processing..."
                                            : "Get Quote"}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}