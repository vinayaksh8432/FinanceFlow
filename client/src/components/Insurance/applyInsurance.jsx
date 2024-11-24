import { useState, useEffect } from "react";
import { fetchAllInsurance, createInsuranceQuota } from "@/utils/api";
import { useNavigate } from "react-router-dom";
import { Heartbeat, Moped } from "@phosphor-icons/react";
import { MdDoneAll } from "react-icons/md";
import { AiOutlineCar } from "react-icons/ai";
import { useNotifications } from "@/context/notification";
import { Cross } from "lucide-react";
import { tailspin } from "ldrs";

tailspin.register();

export default function ApplyInsurance() {
    const [insuranceData, setInsuranceData] = useState({});
    const [error, setError] = useState(null);
    const [selectedType, setSelectedType] = useState("All");
    const [processingQuoteId, setProcessingQuoteId] = useState(null);
    const navigate = useNavigate();

    const { addNotification } = useNotifications();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await fetchAllInsurance();
                setInsuranceData(data);
                setError(null);
            } catch (err) {
                setError(
                    "Failed to fetch insurance data. Please try again later."
                );
                console.error("Error:", err);
            }
        };

        fetchData();
    }, []);

    const getFilteredData = () => {
        if (!insuranceData || Object.keys(insuranceData).length === 0)
            return [];

        if (selectedType === "All") {
            return Object.values(insuranceData).flatMap(
                (category) => category.items
            );
        }

        return insuranceData[selectedType]?.items || [];
    };

    const handleGetQuote = async (insurance) => {
        try {
            setProcessingQuoteId(insurance.itemId);
            await createInsuranceQuota(insurance);

            // Add notification
            addNotification({
                message: `New insurance quote created for ${insurance.name}`,
                type: "quote",
                link: "/dashboard/insurance/insurancestatus",
            });

            navigate("/dashboard/insurance/insurancestatus");
        } catch (err) {
            console.error("Error getting quote:", err);
            setError("Failed to create insurance quote. Please try again.");

            // Add error notification
            addNotification({
                message: `Failed to create quote for ${insurance.name}`,
                type: "error",
            });
        } finally {
            setProcessingQuoteId(null);
        }
    };

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

    const filteredData = getFilteredData();

    return (
        <div
            className="flex overflow-hidden h-full border border-gray-300 rounded-xl"
            style={{ maxHeight: "calc(100vh - 14vh)" }}
        >
            <div className="bg-gray-50 flex flex-col gap-4 items-start sticky top-0 border-r border-gray-300 min-w-40">
                <h1 className="text-xl font-bold px-4 py-4 flex items-center border-b border-gray-300 w-full">
                    Filters
                </h1>
                <div className="px-4 flex flex-col gap-2">
                    <p className="font-medium">Category</p>
                    <div className="flex flex-col gap-3 text-sm rounded-xl">
                        {[
                            { icon: <MdDoneAll size={20} />, label: "All" },
                            { icon: <Cross size={20} />, label: "Health" },
                            { icon: <AiOutlineCar size={20} />, label: "Car" },
                            {
                                icon: <Moped size={20} />,
                                label: "TwoWheeler",
                                text: "Two Wheel",
                            },
                            { icon: <Heartbeat size={20} />, label: "Life" },
                        ].map((type) => (
                            <button
                                key={type.label}
                                onClick={() => setSelectedType(type.label)}
                                className={`px-4 py-2 rounded-lg transition-colors flex gap-2 items-center ${
                                    selectedType === type.label
                                        ? "bg-blue-500 text-white"
                                        : "bg-blue-100 hover:bg-blue-200"
                                }`}
                            >
                                {type.icon}
                                {type.label === "TwoWheeler"
                                    ? type.text
                                    : type.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="bg-white flex-1 flex flex-col gap-4 h-full">
                <h1 className="text-xl font-bold border-b border-gray-300 pb-4 p-4">
                    Results ({filteredData.length})
                </h1>
                <div className="overflow-y-auto flex flex-col gap-4 rounded-md mx-4 border-y border-gray-300">
                    {filteredData.map((insurance) => (
                        <div
                            key={insurance.itemId}
                            className="border border-gray-300 rounded-md shadow-sm hover:shadow-md transition-shadow"
                        >
                            <div className="p-6">
                                <div className="flex justify-between">
                                    <div className="flex gap-4 items-start">
                                        <img
                                            src={`${
                                                import.meta.env.VITE_BACKEND_URL
                                            }/${insurance.image}`}
                                            alt={insurance.name}
                                            className="w-12 h-12 rounded-full border border-gray-300 shadow-inner"
                                        />
                                        <div className="flex flex-col items-start">
                                            <div>
                                                <h2 className="font-semibold text-lg">
                                                    {insurance.name}
                                                </h2>
                                                <p className="pb-1 text-gray-600">
                                                    {insurance.itemId}
                                                </p>
                                            </div>
                                            <div className="flex gap-2">
                                                <span className="text-xs bg-blue-100 px-3 py-1 rounded-full uppercase">
                                                    {insurance.type}
                                                </span>
                                                <span className="text-xs bg-green-100 px-3 py-1 rounded-full uppercase">
                                                    {insurance.catagory}
                                                </span>
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
                                        {Object.entries(insurance.details).map(
                                            ([key, value]) => (
                                                <li key={key}>{value}</li>
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
                                            processingQuoteId ===
                                            insurance.itemId
                                        }
                                        className={`text-white px-4 py-2 border border-blue-400 bg-gradient-to-r from-blue-500 to-blue-300 rounded-full hover:shadow-md transition-all ${
                                            processingQuoteId ===
                                            insurance.itemId
                                                ? "opacity-50 cursor-not-allowed"
                                                : ""
                                        }`}
                                    >
                                        {processingQuoteId ===
                                        insurance.itemId ? (
                                            <div className="m-auto flex px-5">
                                                <l-tailspin
                                                    size="20"
                                                    stroke="3"
                                                    speed="1"
                                                    color="white"
                                                />
                                            </div>
                                        ) : (
                                            "Get Quote"
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <div></div>
            </div>
        </div>
    );
}
