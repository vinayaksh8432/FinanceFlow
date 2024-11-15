import React, { useState, useMemo, useEffect } from "react";
import { LuPlus } from "react-icons/lu";
import StockSearch from "./components/StockSearch";
import RecentlyAdded from "./components/RecentlyAdded";
import AddToPortfolio from "./components/AddToPortfolio";
import StockChart from "./components/StockChart";
import { mockHistoricalData, mockStockQuote } from "./mock";
import {
    convertUnixTimestampToDate,
    createDate,
    convertDateToUnixTimestamp,
} from "@/utils/helper/date-helper";
import { ArrowsOut } from "@phosphor-icons/react";
import { addToPortfolio } from "@/utils/api";
import { useNavigate } from "react-router-dom";

export default function StockMarket() {
    const [timeFrame, setTimeFrame] = useState("1W");
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const navigate = useNavigate();

    const chartConfig = {
        "1D": { resolution: "1", days: 1, weeks: 0, months: 0, years: 0 },
        "1W": { resolution: "15", days: 0, weeks: 1, months: 0, years: 0 },
        "1M": { resolution: "60", days: 0, weeks: 0, months: 1, years: 0 },
        "1Y": { resolution: "D", days: 0, weeks: 0, months: 0, years: 1 },
    };

    const [stockData, setStockData] = useState(mockStockQuote);
    const [historicalData, setHistoricalData] = useState([]);
    const [selectedStock, setSelectedStock] = useState({
        symbol: "AAPL",
        data: null,
    });

    const formatHistoricalData = (data) => {
        return data.c.map((close, index) => ({
            close: close.toFixed(2),
            high: data.h[index].toFixed(2),
            low: data.l[index].toFixed(2),
            open: data.o[index].toFixed(2),
            date: convertUnixTimestampToDate(data.t[index]),
            volume: data.v[index],
        }));
    };

    const fetchHistoricalData = async (symbol, timeFrame) => {
        try {
            // Get date range based on timeframe
            const endDate = new Date();
            const { days, weeks, months, years } = chartConfig[timeFrame];
            const startDate = createDate(
                endDate,
                -days,
                -weeks,
                -months,
                -years
            );

            const startTimestamp = convertDateToUnixTimestamp(startDate);
            const endTimestamp = convertDateToUnixTimestamp(endDate);

            // For demo, using mock data
            const data = mockHistoricalData;
            const formattedData = formatHistoricalData(data);
            setHistoricalData(formattedData);
        } catch (error) {
            console.error("Error fetching historical data:", error);
        }
    };

    // Fetch data when selected stock or timeframe changes
    useEffect(() => {
        fetchHistoricalData(selectedStock.symbol, timeFrame);
    }, [selectedStock.symbol, timeFrame]);

    const handleTimeFrameChange = (newTimeFrame) => {
        setTimeFrame(newTimeFrame);
    };

    const handleStockSelect = (result) => {
        setSelectedStock({
            symbol: result["1. symbol"],
            name: result["2. name"],
            data: null,
        });
    };

    const priceChange = useMemo(() => {
        if (historicalData.length >= 2) {
            const firstPrice = parseFloat(historicalData[0].close);
            const lastPrice = parseFloat(
                historicalData[historicalData.length - 1].close
            );
            const change = lastPrice - firstPrice;
            const percentChange = (change / firstPrice) * 100;

            return {
                change,
                percentChange,
            };
        }
        return {
            change: stockData.c - stockData.pc,
            percentChange: ((stockData.c - stockData.pc) / stockData.pc) * 100,
        };
    }, [historicalData, stockData]);

    const handleAddToPortfolio = async (stockData) => {
        try {
            const response = await addToPortfolio(stockData);

            if (response.success) {
                setIsAddModalOpen(false);
                navigate("/dashboard/portfolio");
            } else {
                throw new Error(
                    response.message || "Failed to add stock to portfolio"
                );
            }
        } catch (error) {
            console.error("Portfolio addition error:", error);
        }
    };

    return (
        <div className="w-full flex flex-col gap-4">
            <StockSearch onStockSelect={handleStockSelect} />
            <div className="flex items-center justify-between">
                <div className="flex gap-4 items-center">
                    <div className="p-2 bg-white border border-gray-300 rounded-xl">
                        <img
                            src={`/api/placeholder/48/48`}
                            alt={selectedStock.symbol}
                            className="w-12 h-12"
                        />
                    </div>
                    <div className="flex flex-col">
                        <h1 className="text-2xl font-bold text-gray-800">
                            {selectedStock.name || selectedStock.symbol}
                        </h1>
                        <div className="flex items-center gap-2">
                            <span className="text-xl">
                                ₹{stockData.c.toFixed(2)}
                            </span>
                            <span
                                className={`text-sm ${
                                    priceChange.change >= 0
                                        ? "text-green-600"
                                        : "text-red-600"
                                }`}
                            >
                                {priceChange.change >= 0 ? "+" : ""}
                                {priceChange.change.toFixed(2)} (
                                {priceChange.percentChange.toFixed(2)}%)
                            </span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setIsAddModalOpen(true)}
                        className="p-2 border border-blue-400 bg-blue-200 rounded-xl shadow-sm hover:bg-blue-300 transition-colors"
                    >
                        <LuPlus size={25} />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-6 text-sm gap-4">
                {[
                    {
                        label: "Open",
                        value: stockData.o.toFixed(2),
                    },
                    {
                        label: "High",
                        value: stockData.h.toFixed(2),
                    },
                    {
                        label: "Low",
                        value: stockData.l.toFixed(2),
                    },
                    {
                        label: "Volume",
                        value:
                            historicalData[0]?.volume?.toLocaleString() || "0",
                    },
                    {
                        label: "Change",
                        value: priceChange.change.toFixed(2),
                        isChange: true,
                    },
                    {
                        label: "Change %",
                        value: `${priceChange.percentChange.toFixed(2)}%`,
                        isChange: true,
                    },
                ].map((item, index) => (
                    <div
                        key={index}
                        className="bg-white flex justify-between py-2 px-4 rounded-xl border border-gray-300 shadow-sm"
                    >
                        <h1 className="uppercase">{item.label}</h1>
                        <p
                            className={`font-medium ${
                                item.isChange
                                    ? parseFloat(item.value) >= 0
                                        ? "text-green-600"
                                        : "text-red-600"
                                    : ""
                            }`}
                        >
                            {item.isChange && parseFloat(item.value) >= 0
                                ? "+"
                                : ""}
                            {item.value}
                        </p>
                    </div>
                ))}
            </div>

            <div className="flex gap-4">
                <div className="flex gap-4 flex-grow">
                    <div className="flex flex-col gap-4 bg-white rounded-xl p-4 border border-gray-300 w-full">
                        <div className="flex justify-between items-center">
                            <div className="grid grid-cols-4 gap-2 bg-blue-50 px-3 py-2 rounded-lg text-sm">
                                {Object.keys(chartConfig).map((period) => (
                                    <button
                                        key={period}
                                        onClick={() =>
                                            handleTimeFrameChange(period)
                                        }
                                        className={`p-1 px-2 rounded-lg transition-colors ${
                                            timeFrame === period
                                                ? "bg-blue-600 text-white"
                                                : "bg-blue-200 hover:bg-blue-300"
                                        }`}
                                    >
                                        {period}
                                    </button>
                                ))}
                            </div>
                            <div className="bg-blue-50 p-2 rounded-lg text-sm cursor-pointer shadow-sm">
                                <ArrowsOut size={23} />
                            </div>
                        </div>

                        <StockChart
                            stockData={historicalData}
                            timeFrame={timeFrame}
                        />
                    </div>
                </div>
                <RecentlyAdded />
            </div>

            {isAddModalOpen && (
                <AddToPortfolio
                    isOpen={isAddModalOpen}
                    onClose={() => setIsAddModalOpen(false)}
                    selectedStock={selectedStock}
                    currentPrice={stockData.c}
                    onAddToPortfolio={handleAddToPortfolio}
                    priceChange={priceChange.change.toFixed(2)}
                    priceChangePercent={priceChange.percentChange.toFixed(2)}
                />
            )}
        </div>
    );
}
