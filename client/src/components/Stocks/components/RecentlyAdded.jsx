import { useEffect, useState } from "react";
import { getPortfolioData } from "@/utils/api";

export default function RecentlyAdded() {
    const [recentlyAdded, setRecentlyAdded] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let isMounted = true;

        const fetchRecentStocks = async () => {
            try {
                const response = await getPortfolioData();
                if (!response) {
                    throw new Error("No data received from server");
                }
                if (isMounted) {
                    const stocksArray = Array.isArray(response)
                        ? response
                        : Array.isArray(response.data)
                        ? response.data
                        : response.data?.holdings || [];

                    setRecentlyAdded(stocksArray);
                    setLoading(false);
                }
            } catch (err) {
                console.error("Error fetching recently added stocks:", err);
                if (isMounted) {
                    setError(err.message);
                    setLoading(false);
                }
            }
        };

        fetchRecentStocks();

        return () => {
            isMounted = false;
        };
    }, []);

    if (error) {
        return (
            <div className="bg-white border border-gray-300 rounded-xl p-4 w-80">
                <h1 className="text-lg font-semibold mb-4">Recently Added</h1>
                <div className="text-red-500 text-center py-4">
                    Error loading stocks: {error}
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white border border-gray-300 rounded-xl p-4 w-1/4 flex flex-col gap-4">
            <h1 className="text-lg font-semibold">Recently Added</h1>
            {loading ? (
                <div className="text-center py-4">Loading...</div>
            ) : !recentlyAdded || recentlyAdded.length === 0 ? (
                <div className="text-gray-500 text-center py-4">
                    No stocks added yet
                </div>
            ) : (
                <div className="flex flex-col gap-4">
                    {recentlyAdded.slice(0, 3).map((stock) => (
                        <div
                            key={stock._id}
                            className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
                        >
                            <div className="flex justify-between items-center">
                                <span className="font-medium">
                                    {stock.companyName}
                                </span>
                                <span
                                    className={`text-sm ${
                                        stock.profitLoss >= 0
                                            ? "text-green-600"
                                            : "text-red-600"
                                    }`}
                                >
                                    {stock.profitLoss >= 0 ? "+" : ""}
                                    {stock.profitLossPercentage.toFixed(2)}%
                                </span>
                            </div>
                            <div className="text-sm text-gray-600">
                                <div className="flex justify-between">
                                    <span>Quantity:</span>
                                    <span>{stock.quantity}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Current Price:</span>
                                    <span>
                                        ₹{stock.currentPrice.toFixed(2)}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Value:</span>
                                    <span>
                                        ₹{stock.currentValue.toFixed(2)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
