import React, { useRef, useState, useEffect } from "react";
import { ArrowLineRight } from "@phosphor-icons/react";
import { FaCheck } from "react-icons/fa6";
import { FaTrash } from "react-icons/fa";
import { RiCloseLargeFill } from "react-icons/ri";
import { TailSpin } from "react-loader-spinner";
import { CaretUp, CaretDown } from "@phosphor-icons/react";
import { FaMinus, FaPlus } from "react-icons/fa6";

export default function EditModal({
    stock,
    onSave,
    onCancel,
    onApplicationDeleted,
}) {
    const [editedStock, setEditedStock] = useState({
        _id: stock?._id,
        quantity: stock?.quantity || 1,
        avgBuyPrice: stock?.avgBuyPrice || 0,
    });
    const [error, setError] = useState("");
    const actionMenuRef = useRef(null);
    const [action, setAction] = useState(null);
    const [isLoading, setLoading] = useState(false);

    // Calculate potential changes
    const calculateProjectedValues = () => {
        const currentInvestmentValue = stock.quantity * stock.avgBuyPrice;
        const newInvestmentValue = editedStock.quantity * stock.avgBuyPrice;
        const currentTotalValue = stock.quantity * stock.currentPrice;
        const newTotalValue = editedStock.quantity * stock.currentPrice;

        const currentProfitLoss = stock.profitLoss;
        const potentialProfitLossChange =
            newTotalValue -
            newInvestmentValue -
            (currentTotalValue - currentInvestmentValue);

        return {
            currentInvestmentValue,
            newInvestmentValue,
            currentTotalValue,
            newTotalValue,
            potentialProfitLossChange,
        };
    };

    const projectedValues = calculateProjectedValues();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditedStock((prev) => ({
            ...prev,
            [name]: name === "quantity" ? parseInt(value) : parseFloat(value),
        }));
    };

    const handleDeleteStock = async () => {
        if (!stock?._id) {
            setError("Cannot delete stock: Invalid stock ID");
            return;
        }

        setLoading(true);
        try {
            await onApplicationDeleted(stock._id);
            onCancel();
        } catch (err) {
            console.error("Error deleting stock:", err);
            setError(err.message || "An error occurred while deleting stock");
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (editedStock.quantity <= 0) {
            setError("Quantity must be greater than 0");
            return;
        }

        setLoading(true);
        try {
            await onSave({ ...stock, ...editedStock });
            onCancel();
        } catch (err) {
            console.error("Error saving stock:", err);
            setError(err.message || "Failed to save stock details");
        } finally {
            setLoading(false);
        }
    };

    if (!stock) {
        return null;
    }

    const toggleAction = () => {
        setAction(!action);
    };

    return (
        <div className="fixed inset-0 bg-slate-400 bg-opacity-35 flex justify-end z-50">
            <form
                onSubmit={handleSubmit}
                ref={actionMenuRef}
                className="bg-white py-4 px-6 w-1/3 rounded-tl-3xl flex flex-col justify-between"
            >
                <div>
                    <div className="flex justify-between pb-4">
                        <button
                            type="button"
                            onClick={onCancel}
                            className="-mx-0 px-2 text-gray-400 rounded-md hover:text-gray-600 hover:bg-gray-200 text-lg"
                        >
                            <ArrowLineRight />
                        </button>
                        <div className="flex justify-end gap-4">
                            <button
                                type="submit"
                                className="px-4 py-2 bg-blue-400 text-white rounded text-xs flex items-center gap-2 hover:bg-blue-500"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <TailSpin
                                        height="20"
                                        width="20"
                                        color="#ffffff"
                                        ariaLabel="loading"
                                    />
                                ) : (
                                    <>
                                        <FaCheck />
                                        Save Changes
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                    <hr className="border-t border-gray-200 -mx-6" />

                    <div className="flex flex-col gap-4">
                        <div className="flex items-center space-x-6 pt-4">
                            <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-3xl">
                                {stock.companyName[0]}
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-gray-800">
                                    {stock.companyName}
                                </h2>
                                <p className="text-gray-600">{stock.symbol}</p>
                                <div
                                    className={`flex items-center font-semibold ${
                                        stock.profitLossPercentage >= 0
                                            ? "text-green-600"
                                            : "text-red-600"
                                    }`}
                                >
                                    {stock.profitLossPercentage >= 0 ? (
                                        <CaretUp size={20} />
                                    ) : (
                                        <CaretDown size={20} />
                                    )}
                                    {stock.profitLossPercentage.toFixed(2)}%
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Quantity
                            </label>
                            <div className="flex items-center gap-4 mt-1">
                                <button
                                    type="button"
                                    onClick={() =>
                                        handleChange({
                                            target: {
                                                name: "quantity",
                                                value: Math.max(
                                                    1,
                                                    isNaN(editedStock.quantity)
                                                        ? 1
                                                        : editedStock.quantity -
                                                              1
                                                ),
                                            },
                                        })
                                    }
                                    className="p-2 border rounded-md hover:bg-gray-100"
                                >
                                    <FaMinus size={14} />
                                </button>
                                <span className="text-lg font-medium w-16 text-center">
                                    {isNaN(editedStock.quantity)
                                        ? "NaN"
                                        : editedStock.quantity}
                                </span>
                                <button
                                    type="button"
                                    onClick={() =>
                                        handleChange({
                                            target: {
                                                name: "quantity",
                                                value: isNaN(
                                                    editedStock.quantity
                                                )
                                                    ? 1
                                                    : editedStock.quantity + 1,
                                            },
                                        })
                                    }
                                    className="p-2 border rounded-md hover:bg-gray-100"
                                >
                                    <FaPlus size={14} />
                                </button>
                            </div>
                        </div>

                        <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                            <h3 className="text-lg font-semibold text-gray-700">
                                Projected Changes
                            </h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-gray-600">
                                        Current Total Value
                                    </p>
                                    <p className="font-medium text-gray-800">
                                        ₹
                                        {projectedValues.currentTotalValue.toLocaleString()}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">
                                        New Total Value
                                    </p>
                                    <p className="font-medium text-gray-800">
                                        ₹
                                        {projectedValues.newTotalValue.toLocaleString()}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-4">
                    <hr className="border-t border-gray-200 -mx-6 pb-4" />
                    <div className="flex gap-4 items-center">
                        <button
                            type="button"
                            className="bg-red-400 text-red-900 px-4 py-2 text-sm rounded-md flex gap-2 items-center "
                            onClick={toggleAction}
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <TailSpin
                                    height="20"
                                    width="20"
                                    color="#ffffff"
                                    ariaLabel="loading"
                                />
                            ) : (
                                <>
                                    <FaTrash />
                                    Remove Stock
                                </>
                            )}
                        </button>

                        {action && (
                            <div className="bg-white rounded-md flex gap-2 text-xs">
                                <button
                                    type="button"
                                    className="p-2 border rounded hover:bg-gray-100"
                                    onClick={handleDeleteStock}
                                >
                                    <FaCheck />
                                </button>
                                <button
                                    type="button"
                                    className="p-2 border rounded hover:bg-gray-100"
                                    onClick={() => setAction(null)}
                                >
                                    <RiCloseLargeFill />
                                </button>
                            </div>
                        )}
                    </div>
                </div>
                {error && <p className="text-red-500 mt-2">{error}</p>}
            </form>
        </div>
    );
}
