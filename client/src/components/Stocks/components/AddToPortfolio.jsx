import React from "react";
import { LuX } from "react-icons/lu";
import { FiMinus, FiPlus } from "react-icons/fi"; // Add these imports

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
                companyName: selectedStock.name, // Changed from splitting symbol to using full name
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

    if (!isOpen) return null;

    const handleQuantityChange = (value) => {
        const newValue = Math.max(1, parseInt(value) || 1);
        setQuantity(newValue.toString());
    };

    // Rest of your existing functions remain the same...

    return (
        <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50"
            onClick={handleBackdropClick}
        >
            <div className="bg-white rounded-2xl w-full max-w-md p-8 shadow-2xl transform transition-all">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-2xl font-bold text-gray-900">
                        Add to Portfolio
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                    >
                        <LuX size={24} className="text-gray-500" />
                    </button>
                </div>

                <div className="flex flex-col gap-6">
                    {/* Stock Info Card */}
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 px-6 py-5 rounded-2xl flex items-center justify-between shadow-sm">
                        <div>
                            <h2 className="text-lg font-bold text-blue-900">
                                {selectedStock.name}
                            </h2>
                            <h3 className="text-blue-700">
                                {selectedStock.symbol}
                            </h3>
                            <div className="flex items-baseline gap-2">
                                <p className="text-lg font-semibold text-blue-700">
                                    ₹ {Number(currentPrice).toFixed(2)}
                                </p>
                                <p
                                    className={`text-sm font-medium ${
                                        Number(priceChange) >= 0
                                            ? "text-green-600"
                                            : "text-red-600"
                                    }`}
                                >
                                    {Number(priceChange) >= 0 ? "+" : ""}
                                    {Number(priceChange).toFixed(2)} (
                                    {Number(priceChangePercent).toFixed(2)}%)
                                </p>
                            </div>
                        </div>
                        <div className="bg-white p-3 rounded-xl shadow-sm">
                            <img src="" alt="" className="w-16 h-16" />
                        </div>
                    </div>

                    {/* Quantity Input */}
                    <div className="flex flex-col gap-3">
                        <label className="text-sm font-semibold text-gray-700">
                            Quantity
                        </label>
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() =>
                                    handleQuantityChange(Number(quantity) - 1)
                                }
                                className="w-12 h-12 flex items-center justify-center rounded-xl border border-gray-300 hover:bg-gray-50 transition-colors"
                            >
                                <FiMinus size={20} className="text-gray-600" />
                            </button>
                            <input
                                type="number"
                                value={quantity}
                                onChange={(e) =>
                                    handleQuantityChange(e.target.value)
                                }
                                className="flex-1 h-12 text-center text-lg font-medium border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <button
                                onClick={() =>
                                    handleQuantityChange(Number(quantity) + 1)
                                }
                                className="w-12 h-12 flex items-center justify-center rounded-xl border border-gray-300 hover:bg-gray-50 transition-colors"
                            >
                                <FiPlus size={20} className="text-gray-600" />
                            </button>
                        </div>
                    </div>

                    {/* Total Investment Card */}
                    <div className="bg-gray-50 p-6 rounded-xl shadow-sm">
                        <div className="flex justify-between items-center">
                            <span className="text-gray-700 font-medium">
                                Total Investment
                            </span>
                            <span className="text-xl font-bold text-gray-900">
                                ₹{" "}
                                {(
                                    currentPrice * parseInt(quantity || 0)
                                ).toFixed(2)}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end gap-4 mt-8 pt-6 border-t">
                    <button
                        onClick={onClose}
                        className="px-6 py-3 text-gray-700 font-medium hover:bg-gray-100 rounded-xl transition-colors"
                        disabled={isLoading}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleAddToPortfolio}
                        disabled={
                            !quantity || parseInt(quantity) <= 0 || isLoading
                        }
                        className="px-6 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
                    >
                        {isLoading ? "Adding..." : "Add to Portfolio"}
                    </button>
                </div>
            </div>
        </div>
    );
}
