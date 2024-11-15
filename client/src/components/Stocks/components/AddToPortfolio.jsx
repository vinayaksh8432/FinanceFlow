import React from "react";
import { LuX } from "react-icons/lu";

export default function AddToPortfolio({
    isOpen,
    onClose,
    selectedStock,
    currentPrice,
    onAddToPortfolio,
    priceChange,
    priceChangePercent,
}) {
    const [quantity, setQuantity] = React.useState("1");
    const [isLoading, setIsLoading] = React.useState(false);

    if (!isOpen) return null;

    const handleAddToPortfolio = async () => {
        try {
            setIsLoading(true);
            const quantityInt = parseInt(quantity);

            // Validate inputs
            if (!selectedStock.symbol || !quantityInt || quantityInt <= 0) {
                return;
            }

            // Ensure numbers are properly handled
            const numericPriceChange = Number(priceChange);
            const numericPriceChangePercent = Number(priceChangePercent);

            // Calculate profit/loss
            const profitLoss = numericPriceChange * quantityInt;
            const profitLossPercentage = numericPriceChangePercent;

            // Prepare stock data with profit/loss information
            const stockData = {
                symbol: selectedStock.symbol,
                companyName: selectedStock.symbol.split(".")[0],
                quantity: quantityInt,
                currentPrice: currentPrice,
                averagePrice: currentPrice,
                investmentValue: currentPrice * quantityInt,
                currentValue: currentPrice * quantityInt,
                profitLoss: profitLoss,
                profitLossPercentage: profitLossPercentage,
            };

            await onAddToPortfolio(stockData);
            setQuantity("");
            onClose();
        } catch (error) {
            console.error("Failed to add stock to portfolio:", error);
        } finally {
            setIsLoading(false);
        }
    };

    // Close modal if clicking outside
    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    // Ensure priceChange is treated as a number
    const numericPriceChange = Number(priceChange);
    const priceChangeColor =
        numericPriceChange >= 0 ? "text-green-600" : "text-red-600";

    return (
        <div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            onClick={handleBackdropClick}
        >
            <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl transform transition-all">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold text-gray-900">
                        Add {selectedStock.symbol} to your Portfolio
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-1 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                        <LuX size={20} className="text-gray-500" />
                    </button>
                </div>

                <div className="flex flex-col gap-4">
                    <div className="bg-blue-50 px-6 py-4 rounded-xl flex items-center gap-4">
                        <img src="" alt="" className="w-5 h-5" />
                        <div>
                            <h3 className="text-2xl font-bold text-blue-900">
                                {selectedStock.symbol}
                            </h3>
                            <p className="text-lg font-medium text-blue-700">
                                ₹ {currentPrice.toFixed(2)}
                            </p>
                            <p
                                className={`text-sm font-medium ${priceChangeColor}`}
                            >
                                {numericPriceChange >= 0 ? "+" : ""}
                                {numericPriceChange.toFixed(2)} (
                                {Number(priceChangePercent).toFixed(2)}%)
                            </p>
                        </div>
                    </div>

                    {/* Input for quantity */}
                    <div className="flex flex-col gap-2">
                        <label
                            htmlFor="quantity"
                            className="text-sm font-medium text-gray-700"
                        >
                            Quantity
                        </label>
                        <input
                            type="number"
                            id="quantity"
                            value={quantity}
                            onChange={(e) => setQuantity(e.target.value)}
                            min="1"
                            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter quantity"
                        />
                    </div>

                    {/* Total investment preview */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex justify-between items-center">
                            <span className="text-gray-600">
                                Total Investment
                            </span>
                            <span className="font-medium">
                                ₹{" "}
                                {(
                                    currentPrice * parseInt(quantity || 0)
                                ).toFixed(2)}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                        disabled={isLoading}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleAddToPortfolio}
                        disabled={
                            !quantity || parseInt(quantity) <= 0 || isLoading
                        }
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        {isLoading ? "Adding..." : "Add to Portfolio"}
                    </button>
                </div>
            </div>
        </div>
    );
}
