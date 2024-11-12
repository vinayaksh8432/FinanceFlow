import React, { useState } from "react";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid,
} from "recharts";

const StockChart = ({ stockData, timeframe, setTimeframe, loading }) => {
    const [isFullscreen, setIsFullscreen] = useState(false);

    const formatXAxis = (dateStr) => {
        const date = new Date(dateStr);
        const months = [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec",
        ];

        switch (timeframe) {
            case "1D":
                return date.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                });
            case "1M":
                return `${date.getDate()} ${months[date.getMonth()]}`;
            case "5Y":
                return `${months[date.getMonth()]} ${date.getFullYear()}`;
            default:
                return dateStr;
        }
    };

    const calculateXAxisInterval = () => {
        if (!stockData.length) return 0;
        return Math.floor(stockData.length / 7);
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(price);
    };

    const getYAxisDomain = () => {
        if (!stockData.length) return [0, "auto"];
        const prices = stockData.map((d) => d.price);
        const min = Math.min(...prices);
        const max = Math.max(...prices);

        // Calculate the price range
        const range = max - min;

        // Calculate step size (roughly 4-6 steps)
        const roughStep = range / 4;
        const magnitude = Math.pow(10, Math.floor(Math.log10(roughStep)));
        const normalizedStep = roughStep / magnitude;

        // Choose appropriate step size
        let step;
        if (normalizedStep <= 1) step = magnitude;
        else if (normalizedStep <= 2) step = 2 * magnitude;
        else if (normalizedStep <= 5) step = 5 * magnitude;
        else step = 10 * magnitude;

        // Calculate min and max bounds
        const minBound = Math.floor(min / step) * step;
        const maxBound = Math.ceil(max / step) * step;

        return [minBound, maxBound];
    };

    const formatYAxis = (value) => {
        // Simply return the number without currency symbol
        return value.toFixed(2);
    };

    const toggleFullscreen = () => {
        setIsFullscreen(!isFullscreen);
    };

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            const date = new Date(label);
            const formattedDate =
                timeframe === "1D"
                    ? date.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: true,
                      })
                    : `${date.getDate()} ${date.toLocaleString("default", {
                          month: "short",
                      })} ${date.getFullYear()}`;

            return (
                <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-sm">
                    <p className="text-gray-600 text-sm mb-1">
                        {formattedDate}
                    </p>
                    <p className="font-medium">
                        Price: {formatPrice(payload[0].value)}
                    </p>
                </div>
            );
        }
        return null;
    };

    const chartContent = (
        <div
            className={`flex flex-col gap-4 overflow-auto p-4 ${
                isFullscreen ? "h-full" : "h-72"
            }`}
        >
            <div className="flex items-center justify-between">
                <div className="flex gap-2 bg-gray-100 border px-2 py-1 rounded-xl text-sm">
                    {["1D", "1M", "5Y"].map((period) => (
                        <button
                            key={period}
                            onClick={() => setTimeframe(period)}
                            className={`px-4 py-1 rounded-md transition-colors ${
                                timeframe === period
                                    ? "bg-white border shadow-sm"
                                    : "bg-gray-100 hover:bg-gray-200"
                            }`}
                        >
                            {period}
                        </button>
                    ))}
                </div>
            </div>
            {loading ? (
                <div className="flex items-center justify-center h-full">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                </div>
            ) : (
                stockData?.length > 0 && (
                    <>
                        <ResponsiveContainer>
                            <LineChart
                                data={stockData}
                                margin={{
                                    top: 15,
                                    right: 15,
                                    bottom: 0,
                                    left: 10,
                                }}
                            >
                                <CartesianGrid
                                    strokeDasharray="4 4"
                                    vertical={false}
                                    stroke="#E5E7EB"
                                />
                                <XAxis
                                    dataKey="date"
                                    tickFormatter={formatXAxis}
                                    tickMargin={8}
                                    tick={{
                                        fontSize: 10,
                                        fill: "#6B7280",
                                    }}
                                    tickLine={false}
                                    axisLine={true}
                                    interval={calculateXAxisInterval()}
                                />
                                <YAxis
                                    tickFormatter={formatYAxis}
                                    tick={{ fontSize: 10, fill: "#6B7280" }}
                                    tickLine={false}
                                    axisLine={false}
                                    domain={getYAxisDomain()}
                                    interval={0}
                                    width={45}
                                    tickMargin={8}
                                />
                                <Tooltip content={<CustomTooltip />} />
                                <Line
                                    type="monotone"
                                    dataKey="price"
                                    stroke="#2563eb"
                                    strokeWidth={2}
                                    dot={false}
                                    animationDuration={500}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </>
                )
            )}
        </div>
    );

    if (isFullscreen) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                <div className="bg-white w-11/12 h-5/6 rounded-xl border shadow-lg">
                    {chartContent}
                </div>
            </div>
        );
    }

    return (
        <div className="border border-gray-300 rounded-xl shadow-sm">
            {chartContent}
        </div>
    );
};

export default StockChart;
