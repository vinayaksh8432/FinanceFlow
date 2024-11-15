import React from "react";
import {
    ResponsiveContainer,
    AreaChart,
    Area,
    XAxis,
    YAxis,
    Tooltip,
} from "recharts";

export default function StockChart({ stockData, timeFrame, isLoading }) {
    const formatDate = (dateStr, format = "default") => {
        try {
            const date = new Date(dateStr);
            if (isNaN(date)) return dateStr;

            switch (format) {
                case "tooltip":
                    switch (timeFrame) {
                        case "1D":
                            return date.toLocaleTimeString();
                        case "1W":
                            return date.toLocaleDateString("en-US", {
                                weekday: "short",
                                month: "short",
                                day: "numeric",
                            });
                        default:
                            return date.toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                            });
                    }
                case "xAxis":
                    switch (timeFrame) {
                        case "1D":
                            return date.toLocaleTimeString("en-US", {
                                hour: "numeric",
                                minute: "2-digit",
                            });
                        case "1W":
                            return date.toLocaleDateString("en-US", {
                                weekday: "short",
                            });
                        default:
                            return date.toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                            });
                    }
                default:
                    return date.toLocaleDateString();
            }
        } catch (error) {
            console.error("Date formatting error:", error);
            return dateStr;
        }
    };

    const CustomTooltip = ({ active, payload }) => {
        if (!active || !payload || !payload.length) return null;

        return (
            <div className="bg-white border border-gray-200 rounded-lg px-3 py-2 shadow-md">
                <div className="text-lg font-semibold">₹{payload[0].value}</div>
                <div className="text-sm text-gray-500">
                    {formatDate(payload[0].payload.date, "tooltip")}
                </div>
                <div className="text-xs text-gray-400">
                    Volume:{" "}
                    {parseInt(payload[0].payload.volume).toLocaleString()}
                </div>
            </div>
        );
    };

    if (isLoading) {
        return (
            <div className="h-full w-full flex items-center justify-center">
                <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
            </div>
        );
    }

    return (
        <div className="flex-grow h-[390px]">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                    data={stockData}
                    margin={{ top: 5, right: 5, left: 0, bottom: 5 }}
                >
                    <defs>
                        <linearGradient
                            id="colorClose"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                        >
                            <stop
                                offset="5%"
                                stopColor="#3b82f6"
                                stopOpacity={0.3}
                            />
                            <stop
                                offset="95%"
                                stopColor="#3b82f6"
                                stopOpacity={0}
                            />
                        </linearGradient>
                    </defs>
                    <XAxis
                        dataKey="date"
                        tickFormatter={(date) => formatDate(date, "xAxis")}
                        stroke="#9CA3AF"
                        tick={{ fontSize: 12 }}
                        interval="preserveStartEnd"
                    />
                    <YAxis
                        domain={["auto", "auto"]}
                        tickFormatter={(value) => value.toFixed(2)}
                        stroke="#9CA3AF"
                        tick={{ fontSize: 12 }}
                        width={60}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Area
                        type="monotone"
                        dataKey="close"
                        stroke="#3b82f6"
                        fillOpacity={1}
                        fill="url(#colorClose)"
                        strokeWidth={2}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
}
