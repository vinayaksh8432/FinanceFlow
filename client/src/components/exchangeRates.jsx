import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";

export default function ExchangeRates() {
    const [chartData, setChartData] = useState({
        series: [],
        options: {
            chart: {
                height: 350,
                type: "line",
                zoom: {
                    enabled: false,
                },
            },
            dataLabels: {
                enabled: false,
            },
            stroke: {
                curve: "smooth",
            },
            title: {
                text: "USD to INR Exchange Rate (Intraday)",
                align: "left",
            },
            xaxis: {
                categories: [],
                title: {
                    text: "Time",
                },
            },
            yaxis: {
                title: {
                    text: "Exchange Rate (INR)",
                },
            },
            grid: {
                row: {
                    colors: ["#f3f3f3", "transparent"],
                    opacity: 0.5,
                },
            },
        },
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(
                    "https://api.currencyapi.com/v3/latest?apikey=cur_live_Bukh4WxsDHFeTyCSYFWuIG9MX3JosW1W0PJZfKD5"
                );
                const data = await response.json();

                // Simulate historical data with fluctuations (replace with real historical data if available)
                const timePoints = [
                    "09:00 AM",
                    "10:00 AM",
                    "11:00 AM",
                    "12:00 PM",
                    "01:00 PM",
                    "02:00 PM",
                    "03:00 PM",
                    "04:00 PM",
                    "05:00 PM",
                ];
                const usdToInrRates = [
                    data.data.INR.value * (1 + Math.random() * 0.01), // Slightly fluctuated rate
                    data.data.INR.value * (1 - Math.random() * 0.01),
                    data.data.INR.value * (1 + Math.random() * 0.01),
                    data.data.INR.value * (1 - Math.random() * 0.01),
                    data.data.INR.value * (1 + Math.random() * 0.01),
                    data.data.INR.value * (1 - Math.random() * 0.01),
                    data.data.INR.value * (1 + Math.random() * 0.01),
                    data.data.INR.value * (1 - Math.random() * 0.01),
                    data.data.INR.value,
                ];

                setChartData({
                    series: [
                        {
                            name: "USD to INR",
                            data: usdToInrRates,
                        },
                    ],
                    options: {
                        ...chartData.options,
                        xaxis: {
                            ...chartData.options.xaxis,
                            categories: timePoints,
                        },
                    },
                });
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, []);

    return (
        <div>
            <div id="chart">
                <ReactApexChart
                    options={chartData.options}
                    series={chartData.series}
                    type="line"
                    height={350}
                />
            </div>
        </div>
    );
}
