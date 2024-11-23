import React, { useMemo, useEffect, useContext } from "react";
import {
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
    Tooltip,
    Legend,
} from "recharts";
import { motion } from "framer-motion";
import { LoanApplicationContext } from "@/context/LoanApplicationContext";

export default function LoanChart({
    loanType,
    loanAmount,
    loanTenure,
    interestRate,
}) {
    const { updateLoanApplication } = useContext(LoanApplicationContext);

    const formatIndianCurrency = (num) => {
        if (!num) return "0";
        // const roundedNum = Math(num);
        return num.toLocaleString("en-IN");
    };

    const cleanAmount = useMemo(() => {
        return (
            parseFloat((loanAmount || "").toString().replace(/[₹,]/g, "")) || 0
        );
    }, [loanAmount]);

    const calculatedData = useMemo(() => {
        if (!loanType || !loanTenure || !interestRate || cleanAmount === 0) {
            return {
                principal: 0,
                interest: 0,
                monthlyEMI: 0,
                totalAmount: 0,
                loanAmountWithInterest: 0,
            };
        }

        const monthlyRate = parseFloat(interestRate) / 12 / 100;
        const numberOfPayments = parseInt(loanTenure);

        // Calculate EMI using the formula: EMI = P * R * (1 + R)^N / ((1 + R)^N - 1)
        const emi =
            (cleanAmount *
                monthlyRate *
                Math.pow(1 + monthlyRate, numberOfPayments)) /
            (Math.pow(1 + monthlyRate, numberOfPayments) - 1);

        // Calculate total amount to be paid
        const totalAmount = emi * numberOfPayments;

        // Calculate total interest
        const totalInterest = totalAmount - cleanAmount;

        // Ensure all values are valid numbers and round to 2 decimal places
        const validEmi = isFinite(emi) ? Math.round(emi * 100) / 100 : 0;
        const validTotalAmount = isFinite(totalAmount)
            ? Math.round(totalAmount * 100) / 100
            : 0;
        const validTotalInterest = isFinite(totalInterest)
            ? Math.round(totalInterest * 100) / 100
            : 0;

        return {
            principal: Math.round(cleanAmount * 100) / 100,
            interest: validTotalInterest,
            monthlyEMI: validEmi,
            totalAmount: validTotalAmount,
            loanAmountWithInterest: validTotalInterest, // This should be the total interest amount
        };
    }, [cleanAmount, loanTenure, interestRate, loanType]);

    useEffect(() => {
        if (loanType && calculatedData.monthlyEMI > 0) {
            // const { rawValues } = calculatedData;

            console.log("Calculated Data", calculatedData);

            // Update the loan application context with the numeric values
            updateLoanApplication({
                monthlyEmi: calculatedData.monthlyEMI,
                loanAmountWithInterest: calculatedData.loanAmountWithInterest,
                totalLoanAmount: calculatedData.totalAmount,
                desiredLoanAmount: cleanAmount, // Make sure this is a number, not a formatted string
            });
        }
    }, [calculatedData, loanType, updateLoanApplication, cleanAmount]);

    // Rest of the component remains the same...
    const chartData = [
        { name: "Principal", value: calculatedData.principal },
        { name: "Interest", value: calculatedData.interest },
    ];

    const COLORS = ["#4F46E5", "#E11D48"];

    if (!loanType || calculatedData.monthlyEMI === 0) {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-lg h-full pb-4 flex items-center justify-center"
            >
                <p className="text-gray-500">
                    Select a loan type to view calculations
                </p>
            </motion.div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 0 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-gray-50 rounded-xl overflow-hidden p-4 h-full"
        >
            <div className="flex flex-col justify-between h-full">
                <motion.div
                    initial={{ opacity: 0, x: 0 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2, duration: 0.4 }}
                    className="flex justify-between items-center p-4 bg-white border rounded-lg mb-2"
                >
                    <div className="text-sm font-medium">Monthly EMI</div>
                    <div className="text-xl font-semibold">
                        ₹ {formatIndianCurrency(calculatedData.monthlyEMI)}
                    </div>
                </motion.div>

                <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                        <Pie
                            data={chartData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={90}
                            paddingAngle={5}
                            dataKey="value"
                        >
                            {chartData.map((_, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={COLORS[index % COLORS.length]}
                                />
                            ))}
                        </Pie>
                        <Tooltip
                            formatter={(value) => [
                                `₹ ${formatIndianCurrency(value)}`,
                                "Amount",
                            ]}
                            contentStyle={{
                                backgroundColor: "#f8f8f8",
                                borderRadius: "8px",
                                boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                            }}
                        />
                        <Legend
                            layout="horizontal"
                            verticalAlign="bottom"
                            align="center"
                        />
                    </PieChart>
                </ResponsiveContainer>

                <motion.div
                    initial={{ opacity: 0, y: 0 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.4 }}
                    className="flex flex-col gap-4 mt-4"
                >
                    <div className="flex justify-between items-center">
                        <div className="flex items-center">
                            <div className="w-3 h-3 rounded-full bg-indigo-600 mr-2"></div>
                            <span className="text-sm">Principal Amount</span>
                        </div>
                        <span className="font-medium">
                            ₹ {formatIndianCurrency(calculatedData.principal)}
                        </span>
                    </div>

                    <div className="flex justify-between items-center">
                        <div className="flex items-center">
                            <div className="w-3 h-3 rounded-full bg-rose-600 mr-2"></div>
                            <span className="text-sm">Total Interest</span>
                        </div>
                        <span className="font-medium">
                            ₹ {formatIndianCurrency(calculatedData.interest)}
                        </span>
                    </div>
                </motion.div>

                <hr className="my-4" />

                <motion.div
                    initial={{ opacity: 0, y: 0 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, duration: 0.4 }}
                    className="bg-white border rounded-xl px-4 py-2"
                >
                    <h1 className="pb-2 font-semibold">Loan Summary</h1>
                    <div className="text-sm grid grid-cols-2">
                        <div className="space-y-1">
                            <h1>Total Amount</h1>
                            <h1>Interest Rate</h1>
                            <h1>Loan Tenure</h1>
                            <h1>Loan Type</h1>
                        </div>

                        <div className="text-end space-y-1">
                            <h1>
                                ₹{" "}
                                {formatIndianCurrency(
                                    calculatedData.totalAmount
                                )}
                            </h1>
                            <h1>{interestRate}% p.a</h1>
                            <h1>{loanTenure} months</h1>
                            <h1>{loanType} loan</h1>
                        </div>
                    </div>
                </motion.div>
            </div>
        </motion.div>
    );
}
