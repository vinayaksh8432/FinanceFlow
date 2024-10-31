import React, { useState, useEffect } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

export default function LoanCalculator({
    loanAmount,
    loanType,
    loanTenure,
    interestRate,
}) {
    const [calculatedData, setCalculatedData] = useState({
        monthlyEMI: 0,
        totalAmount: 0,
        totalInterest: 0,
        principalAmount: 0,
    });

    const formatIndianCurrency = (number) => {
        const num = Math.round(number);
        const str = num.toString();
        let lastThree = str.substring(str.length - 3);
        const otherNumbers = str.substring(0, str.length - 3);
        if (otherNumbers !== "") {
            lastThree = "," + lastThree;
        }
        const formatted =
            otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree;
        return "₹" + formatted;
    };

    useEffect(() => {
        if (loanAmount && loanTenure && interestRate) {
            const principal = parseFloat(loanAmount.replace(/[₹,]/g, ""));
            const monthlyRate = parseFloat(interestRate) / 12 / 100;
            const numberOfPayments = parseInt(loanTenure);

            // Calculate EMI using the formula: P * r * (1 + r)^n / ((1 + r)^n - 1)
            const emi =
                (principal *
                    monthlyRate *
                    Math.pow(1 + monthlyRate, numberOfPayments)) /
                (Math.pow(1 + monthlyRate, numberOfPayments) - 1);

            const totalAmount = emi * numberOfPayments;
            const totalInterest = totalAmount - principal;

            setCalculatedData({
                monthlyEMI: Math.round(emi),
                totalAmount: Math.round(totalAmount),
                totalInterest: Math.round(totalInterest),
                principalAmount: principal,
            });
        }
    }, [loanAmount, loanTenure, interestRate]);

    const chartData = [
        { name: "Principal", value: calculatedData.principalAmount },
        { name: "Interest", value: calculatedData.totalInterest },
    ];

    const COLORS = ["#4F46E5", "#E11D48"];

    return (
        <div className="bg-white rounded-lg">
            <div className="space-y-6">
                <div>
                    <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                        <div className="text-sm font-medium">Monthly EMI</div>
                        <div className="text-xl font-semibold">
                            {formatIndianCurrency(calculatedData.monthlyEMI)}
                        </div>
                    </div>
                </div>

                <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                        <Pie
                            data={chartData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                        >
                            {chartData.map((entry, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={COLORS[index % COLORS.length]}
                                />
                            ))}
                        </Pie>
                        <Tooltip
                            formatter={(value) => formatIndianCurrency(value)}
                        />
                    </PieChart>
                </ResponsiveContainer>

                <div className="flex flex-col gap-6">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center">
                            <div className="w-3 h-3 rounded-full bg-indigo-600 mr-2"></div>
                            <span className="text-sm">Principal Amount</span>
                        </div>
                        <span className="font-medium">
                            {formatIndianCurrency(
                                calculatedData.principalAmount
                            )}
                        </span>
                    </div>

                    <div className="flex justify-between items-center">
                        <div className="flex items-center">
                            <div className="w-3 h-3 rounded-full bg-rose-600 mr-2"></div>
                            <span className="text-sm">Total Interest</span>
                        </div>
                        <span className="font-medium">
                            {formatIndianCurrency(calculatedData.totalInterest)}
                        </span>
                    </div>

                    <hr />

                    <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">
                            Total Amount
                        </span>
                        <span className="font-semibold">
                            {formatIndianCurrency(calculatedData.totalAmount)}
                        </span>
                    </div>
                </div>

                <div className="text-xs text-gray-500 space-y-1">
                    <h1>Interest Rate: {interestRate}% p.a.</h1>
                    <h1>Loan Tenure: {loanTenure} months</h1>
                    <h1>Loan Type: {loanType} loan</h1>
                </div>
            </div>
        </div>
    );
}
