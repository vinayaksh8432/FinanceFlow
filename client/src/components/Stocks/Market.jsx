import { ArrowsOut } from "@phosphor-icons/react";
import React, { useState, useMemo } from "react";
import { LuPlus } from "react-icons/lu";
import {
    ResponsiveContainer,
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
} from "recharts";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogClose,
} from "@/components/ui/dialog";
import { useToast } from "../../hooks/use-toast";
import StockSearch from "./components/StockSearch";
import { addToPortfolio } from "@/utils/api";
import { useNavigate } from "react-router-dom";

export default function StockMarket() {
    const [timeFrame, setTimeFrame] = useState("1W");
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [quantity, setQuantity] = useState("");
    const { toast } = useToast();

    const navigate = useNavigate();

    const [selectedStock, setSelectedStock] = useState({
        symbol: "RELIANCE.BSE",
        data: {
            "Meta Data": {
                "1. Information":
                    "Daily Time Series with Splits and Dividend Events",
                "2. Symbol": "RELIANCE.BSE",
                "3. Last Refreshed": "2024-11-08",
                "4. Output Size": "Full size",
                "5. Time Zone": "US/Eastern",
            },
            "Time Series (Daily)": {
                "2024-11-08": {
                    "1. open": "1302.65",
                    "2. high": "1302.8",
                    "3. low": "1278.0",
                    "4. close": "1284.0",
                    "6. volume": "927106",
                },
                "2024-11-07": {
                    "1. open": "1322.15",
                    "2. high": "1324.0",
                    "3. low": "1303.2",
                    "4. close": "1305.65",
                    "6. volume": "529604",
                },
                "2024-11-06": {
                    "1. open": "1311.85",
                    "2. high": "1328.45",
                    "3. low": "1300.3",
                    "4. close": "1325.55",
                    "6. volume": "873762",
                },
                "2024-11-05": {
                    "1. open": "1293.75",
                    "2. high": "1309.35",
                    "3. low": "1286.15",
                    "4. close": "1305.95",
                    "6. volume": "410474",
                },
                "2024-11-04": {
                    "1. open": "1337.0",
                    "2. high": "1338.6",
                    "3. low": "1285.1",
                    "4. close": "1302.0",
                    "6. volume": "1351832",
                },
            },
        },
    });

    // Sample stock data for different symbols
    const stockDataMap = {
        "TSCO.LON": {
            "Time Series (Daily)": {
                "2024-11-08": {
                    "1. open": "240.15",
                    "2. high": "242.80",
                    "3. low": "238.00",
                    "4. close": "241.00",
                    "6. volume": "927106",
                },
                "2024-11-07": {
                    "1. open": "242.15",
                    "2. high": "244.00",
                    "3. low": "239.20",
                    "4. close": "240.65",
                    "6. volume": "529604",
                },
                "2024-11-06": {
                    "1. open": "241.85",
                    "2. high": "245.45",
                    "3. low": "240.30",
                    "4. close": "243.55",
                    "6. volume": "873762",
                },
            },
        },
        TSCDF: {
            "Time Series (Daily)": {
                "2024-11-08": {
                    "1. open": "180.65",
                    "2. high": "182.80",
                    "3. low": "178.00",
                    "4. close": "181.00",
                    "6. volume": "827106",
                },
                "2024-11-07": {
                    "1. open": "182.15",
                    "2. high": "184.00",
                    "3. low": "179.20",
                    "4. close": "180.65",
                    "6. volume": "429604",
                },
                "2024-11-06": {
                    "1. open": "181.85",
                    "2. high": "185.45",
                    "3. low": "180.30",
                    "4. close": "183.55",
                    "6. volume": "773762",
                },
            },
        },
    };

    const handleStockSelect = (result) => {
        setSelectedStock({
            symbol: result["1. symbol"],
            data: stockDataMap[result["1. symbol"]] || selectedStock.data,
        });
    };

    const processedData = useMemo(() => {
        const timeSeriesData = selectedStock.data["Time Series (Daily)"];
        return Object.entries(timeSeriesData)
            .map(([date, values]) => ({
                date,
                close: parseFloat(values["4. close"]),
                volume: parseInt(values["6. volume"]),
            }))
            .reverse();
    }, [selectedStock]);

    const currentPrice = useMemo(() => {
        if (processedData.length > 0) {
            return processedData[processedData.length - 1].close;
        }
        return 0;
    }, [processedData]);

    const handleAddToPortfolio = async () => {
        try {
            // Parse the quantity as an integer
            const quantityInt = parseInt(quantity);

            // Ensure we have all required data
            if (!selectedStock.symbol || !quantityInt || quantityInt <= 0) {
                toast({
                    title: "Error",
                    description: "Please enter a valid quantity",
                    variant: "destructive",
                });
                return;
            }

            // Calculate values
            const stockData = {
                symbol: selectedStock.symbol,
                companyName: selectedStock.symbol.split(".")[0], // Extract company name from symbol
                quantity: quantityInt,
                currentPrice: currentPrice,
                investmentValue: currentPrice * quantityInt,
                currentValue: currentPrice * quantityInt,
                profitLoss: 0, // Initial profit/loss is 0 for new purchases
                profitLossPercentage: 0,
            };

            // Add additional validation
            if (
                !stockData.symbol ||
                !stockData.companyName ||
                !stockData.quantity ||
                !stockData.currentPrice
            ) {
                toast({
                    title: "Error",
                    description: "Missing required stock data",
                    variant: "destructive",
                });
                return;
            }

            const response = await addToPortfolio(stockData);

            if (response.success) {
                toast({
                    title: "Stock Added",
                    description: `Successfully added ${quantity} shares of ${selectedStock.symbol} to your portfolio.`,
                    variant: "success",
                });

                setIsAddModalOpen(false);
                setQuantity("");
                navigate("/dashboard/portfolio");
            } else {
                throw new Error(
                    response.message || "Failed to add stock to portfolio"
                );
            }
        } catch (error) {
            console.error("Portfolio addition error:", error);
            toast({
                title: "Error",
                description:
                    error.message ||
                    "Failed to add stock to portfolio. Please try again.",
                variant: "destructive",
            });
        }
    };

    const latestVolume = useMemo(() => {
        if (processedData.length > 0) {
            return processedData[processedData.length - 1].volume;
        }
        return 0;
    }, [processedData]);

    const filteredData = useMemo(() => {
        const now = new Date();
        let filterDate = new Date();

        switch (timeFrame) {
            case "1D":
                filterDate.setDate(now.getDate() - 1);
                break;
            case "1W":
                filterDate.setDate(now.getDate() - 7);
                break;
            case "1M":
                filterDate.setMonth(now.getMonth() - 1);
                break;
            default:
                return processedData;
        }

        return processedData.filter(
            (item) => new Date(item.date) >= filterDate
        );
    }, [processedData, timeFrame]);

    const priceChange = useMemo(() => {
        if (filteredData.length >= 2) {
            const currentPrice = filteredData[filteredData.length - 1].close;
            const previousPrice = filteredData[0].close;
            const change = currentPrice - previousPrice;
            const percentChange = (change / previousPrice) * 100;
            return {
                change: change.toFixed(2),
                percentChange: percentChange.toFixed(2),
            };
        }
        return { change: "0.00", percentChange: "0.00" };
    }, [filteredData]);

    const CustomTooltip = ({ active, payload }) => {
        if (!active || !payload || !payload.length) return null;

        return (
            <div className="bg-slate-100 border border-neutral-200 rounded px-2 flex items-center gap-2">
                ₹ {payload[0].value.toLocaleString()}
                <div className="text-sm text-neutral-500">
                    {new Date(payload[0].payload.date).toLocaleString(
                        "default",
                        { month: "long", day: "numeric", year: "numeric" }
                    )}
                </div>
            </div>
        );
    };

    return (
        <div className="w-full flex flex-col gap-4 h-full">
            <StockSearch onStockSelect={handleStockSelect} />
            <div className="flex items-center justify-between">
                <div className="flex gap-4 items-center">
                    <div className="p-2 bg-white border border-gray-300 rounded-xl">
                        <img src="" alt="" className="w-12 h-12" />
                    </div>
                    <div className="flex flex-col">
                        <h1 className="text-2xl font-bold text-gray-800">
                            {selectedStock.symbol}
                        </h1>
                        <div className="flex items-center gap-2">
                            <span className="text-xl">
                                ₹
                                {filteredData[
                                    filteredData.length - 1
                                ]?.close.toFixed(2)}
                            </span>
                            <span
                                className={`text-sm ${
                                    priceChange.change >= 0
                                        ? "text-green-600"
                                        : "text-red-600"
                                }`}
                            >
                                {priceChange.change >= 0 ? "+" : ""}
                                {priceChange.change} (
                                {priceChange.percentChange}%)
                            </span>
                        </div>
                    </div>
                </div>

                <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
                    <DialogTrigger asChild>
                        <button className="p-2 border border-blue-400 bg-blue-200 rounded-xl shadow-sm">
                            <LuPlus size={25} />
                        </button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>
                                Add {selectedStock.symbol} to Portfolio
                            </DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <label>Current Market Price</label>
                                <div className="font-medium">
                                    ₹{currentPrice.toFixed(2)}
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="quantity">Quantity</label>
                                <input
                                    id="quantity"
                                    type="number"
                                    min="1"
                                    value={quantity}
                                    onChange={(e) =>
                                        setQuantity(e.target.value)
                                    }
                                    placeholder="Enter number of shares"
                                />
                            </div>
                            {quantity && (
                                <div className="space-y-2">
                                    <label>Total Investment</label>
                                    <div className="font-medium">
                                        ₹
                                        {(
                                            currentPrice *
                                            parseInt(quantity || 0)
                                        ).toFixed(2)}
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="flex justify-end gap-3">
                            <DialogClose asChild>
                                <button variant="outline">Cancel</button>
                            </DialogClose>
                            <button
                                onClick={handleAddToPortfolio}
                                disabled={!quantity || parseInt(quantity) <= 0}
                            >
                                Add to Portfolio
                            </button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>
            <div className="grid grid-cols-6 text-sm gap-4">
                {[
                    {
                        label: "Open",
                        value: filteredData[0]?.close.toFixed(2),
                    },
                    {
                        label: "High",
                        value: Math.max(
                            ...filteredData.map((d) => d.close)
                        ).toFixed(2),
                    },
                    {
                        label: "Low",
                        value: Math.min(
                            ...filteredData.map((d) => d.close)
                        ).toFixed(2),
                    },
                    {
                        label: "Volume",
                        value: latestVolume.toLocaleString(),
                    },
                    {
                        label: "Change",
                        value: priceChange.change,
                        isChange: true,
                    },
                    {
                        label: "Change %",
                        value: `${priceChange.percentChange}%`,
                        isChange: true,
                    },
                ].map((item, index) => (
                    <div
                        className="bg-white flex justify-between py-2 px-4 rounded-xl border border-gray-300 shadow-sm"
                        key={index}
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

            <div className="flex gap-4 h-full">
                <div className="flex gap-4 flex-grow">
                    <div className="flex flex-col gap-4 bg-white rounded-xl p-4 border border-gray-300 w-full">
                        <div className="flex justify-between items-center">
                            <div className="grid grid-cols-3 gap-2 bg-blue-50 px-3 py-2 rounded-lg text-sm">
                                {["1D", "1W", "1M"].map((period) => (
                                    <button
                                        key={period}
                                        onClick={() => setTimeFrame(period)}
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

                        <div className="flex-grow">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart
                                    data={filteredData}
                                    margin={{
                                        top: 5,
                                        right: 5,
                                        left: 5,
                                        bottom: 5,
                                    }}
                                >
                                    <CartesianGrid
                                        strokeDasharray="3 3"
                                        stroke="#f0f0f0"
                                    />
                                    <XAxis
                                        dataKey="date"
                                        tickFormatter={(date) =>
                                            new Date(date).toLocaleDateString()
                                        }
                                        stroke="#9CA3AF"
                                    />
                                    <YAxis
                                        domain={["dataMin", "dataMax"]}
                                        tickFormatter={(value) =>
                                            value.toFixed(2)
                                        }
                                        stroke="#9CA3AF"
                                    />
                                    <Tooltip
                                        content={<CustomTooltip />}
                                        cursor={{
                                            stroke: "#3b82f6",
                                            strokeWidth: 1,
                                            strokeDasharray: "5 5",
                                        }}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="close"
                                        stroke="#2563eb"
                                        strokeWidth={2}
                                        dot={false}
                                        activeDot={{ r: 4 }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
                <div className="bg-white border border-gray-300 rounded-xl p-4">
                    Recently added
                </div>
            </div>
        </div>
    );
}
