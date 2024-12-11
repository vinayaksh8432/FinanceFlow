import React, { useEffect, useState } from "react";
import {
    getPortfolioData,
    // updateStockHolding,
    // deleteStockHolding,
} from "@/utils/api";
import {
    CaretDown,
    CaretUp,
    ChartLineDown,
    ChartLineUp,
    TrendUp,
} from "@phosphor-icons/react";
import { Search, Edit } from "lucide-react";
import EditModal from "./components/editModal";

const StockCard = ({ holding, onEditClick }) => {
    return (
        <div className="bg-white border border-gray-100 rounded-2xl shadow-md p-6 transform transition-all hover:scale-[1.02] hover:shadow-xl relative">
            <button
                onClick={() => onEditClick(holding)}
                className="absolute bottom-4 right-4 text-gray-500 hover:text-gray-700"
            >
                <Edit size={20} />
            </button>

            <div className="flex justify-between items-center mb-4">
                <div className="flex items-center">
                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mr-4 text-blue-600 font-bold text-xl">
                        {holding.companyName[0]}
                    </div>
                    <div>
                        <h3 className="font-bold text-lg text-gray-800">
                            {holding.companyName}
                        </h3>
                        <p className="text-sm text-gray-500">
                            {holding.symbol}
                        </p>
                    </div>
                </div>
                <div
                    className={`flex items-center font-semibold ${
                        holding.profitLossPercentage >= 0
                            ? "text-green-600"
                            : "text-red-600"
                    }`}
                >
                    {holding.profitLossPercentage >= 0 ? (
                        <CaretUp size={20} />
                    ) : (
                        <CaretDown size={20} />
                    )}
                    {holding.profitLossPercentage.toFixed(2)}%
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-4">
                <div>
                    <p className="text-xs text-gray-500">Quantity</p>
                    <p className="font-medium text-gray-800">
                        {holding.quantity}
                    </p>
                </div>
                <div>
                    <p className="text-xs text-gray-500">Current Price</p>
                    <p className="font-medium text-gray-800">
                        ₹{holding.currentPrice.toLocaleString()}
                    </p>
                </div>
                <div>
                    <p className="text-xs text-gray-500">Investment Value</p>
                    <p className="font-medium text-gray-800">
                        ₹{holding.investmentValue.toLocaleString()}
                    </p>
                </div>
                <div>
                    <p className="text-xs text-gray-500">Profit/Loss</p>
                    <p
                        className={`font-medium ${
                            holding.profitLoss >= 0
                                ? "text-green-600"
                                : "text-red-600"
                        }`}
                    >
                        {holding.profitLoss >= 0 ? "+" : "-"}₹
                        {Math.abs(holding.profitLoss).toLocaleString()}
                    </p>
                </div>
            </div>
        </div>
    );
};

const PortfolioGrid = () => {
    const [portfolioData, setPortfolioData] = useState(null);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterOption, setFilterOption] = useState("all");
    const [selectedStock, setSelectedStock] = useState(null);

    useEffect(() => {
        const fetchPortfolio = async () => {
            try {
                const data = await getPortfolioData();
                if (!data) {
                    throw new Error("No data received from server");
                }

                data.holdings = Array.isArray(data.holdings)
                    ? data.holdings
                    : [];

                setPortfolioData(data);
            } catch (err) {
                console.error("Error fetching portfolio:", err);
                setError(err.message);
            }
        };

        fetchPortfolio();
    }, []);

    const handleEditStock = (stock) => {
        setSelectedStock(stock);
    };

    const handleUpdateStock = async (updatedStock) => {
        try {
            // Call API to update stock holding
            await updateStockHolding(updatedStock);

            // Refresh portfolio data
            const updatedPortfolio = await getPortfolioData();
            setPortfolioData(updatedPortfolio);

            // Close the edit modal
            setSelectedStock(null);
        } catch (err) {
            console.error("Error updating stock:", err);
            // Handle error (e.g., show error message)
        }
    };

    const handleDeleteStock = async (stockId) => {
        try {
            // Call API to delete stock holding
            await deleteStockHolding(stockId);

            // Refresh portfolio data
            const updatedPortfolio = await getPortfolioData();
            setPortfolioData(updatedPortfolio);
        } catch (err) {
            console.error("Error deleting stock:", err);
            // Handle error (e.g., show error message)
        }
    };

    const filteredHoldings =
        portfolioData?.data?.holdings?.filter((holding) => {
            const matchesSearch = holding.companyName
                .toLowerCase()
                .includes(searchTerm.toLowerCase());

            if (filterOption === "all") return matchesSearch;
            if (filterOption === "profit")
                return matchesSearch && holding.profitLoss > 0;
            if (filterOption === "loss")
                return matchesSearch && holding.profitLoss < 0;

            return matchesSearch;
        }) || [];

    // Calculate total profit/loss and total holdings from ALL holdings, not just filtered
    const totalHoldings = portfolioData?.data?.holdings?.length || 0;
    const totalProfitLoss =
        portfolioData?.data?.holdings?.reduce(
            (acc, holding) => acc + holding.profitLoss,
            0
        ) || 0;

    if (error) return <div className="text-red-500 p-4">{error}</div>;
    if (!portfolioData)
        return <div className="animate-pulse p-4">Loading...</div>;

    return (
        <div>
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white rounded-2xl shadow-md p-6 flex items-center">
                        <div className="bg-blue-100 rounded-full p-3 mr-4">
                            <ChartLineUp size={32} className="text-blue-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-600 uppercase">
                                Total Investment
                            </p>
                            <h2 className="text-3xl font-bold text-blue-800">
                                ₹
                                {portfolioData?.data?.totalInvestment?.toLocaleString() ||
                                    0}
                            </h2>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-md p-6 flex items-center">
                        <div className="bg-green-100 rounded-full p-3 mr-4">
                            <TrendUp size={32} className="text-green-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-600 uppercase">
                                Total Profit
                            </p>
                            <h2 className="text-3xl font-bold text-green-800">
                                {totalProfitLoss >= 0 ? "+" : "-"}₹
                                {Math.abs(totalProfitLoss).toLocaleString()}
                            </h2>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-md p-6 flex items-center">
                        <div className="bg-purple-100 rounded-full p-3 mr-4">
                            <ChartLineDown
                                size={32}
                                className="text-purple-600"
                            />
                        </div>
                        <div>
                            <p className="text-sm text-gray-600 uppercase">
                                Total Holdings
                            </p>
                            <h2 className="text-3xl font-bold text-purple-800">
                                {totalHoldings}
                            </h2>
                        </div>
                    </div>
                </div>

                {/* Search and Filter */}
                <div className="flex flex-col md:flex-row justify-between mb-8 gap-4">
                    <div className="relative flex-grow">
                        <input
                            type="text"
                            placeholder="Search stocks..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        />
                        <Search
                            size={20}
                            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                        />
                    </div>

                    <select
                        value={filterOption}
                        onChange={(e) => setFilterOption(e.target.value)}
                        className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    >
                        <option value="all">All Stocks</option>
                        <option value="profit">Profitable</option>
                        <option value="loss">Loss-making</option>
                    </select>
                </div>

                {/* Stock Grid */}
                {filteredHoldings.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredHoldings.map((holding) => (
                            <StockCard
                                key={holding._id}
                                holding={holding}
                                onEditClick={handleEditStock}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16 bg-white rounded-2xl shadow-md">
                        <p className="text-gray-500 text-xl">
                            No stocks found matching your search or filter.
                        </p>
                    </div>
                )}

                {/* Edit Modal for Stock */}
                {selectedStock && (
                    <EditModal
                        stock={selectedStock}
                        onSave={handleUpdateStock}
                        onCancel={() => setSelectedStock(null)}
                        onApplicationDeleted={handleDeleteStock}
                    />
                )}
            </div>
        </div>
    );
};

export default PortfolioGrid;
