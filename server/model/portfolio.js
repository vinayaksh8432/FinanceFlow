const mongoose = require("mongoose");

const stockHoldingSchema = new mongoose.Schema({
    symbol: { type: String },
    companyName: { type: String, required: true },
    quantity: { type: Number, required: true },
    averagePrice: { type: Number, required: true },
    currentPrice: { type: Number, required: true },
    investmentValue: { type: Number, required: true },
    currentValue: { type: Number, required: true },
    profitLoss: { type: Number, required: true },
    profitLossPercentage: { type: Number, required: true },
    lastUpdated: { type: Date, default: Date.now },
});

const portfolioSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true,
    },
    holdings: [stockHoldingSchema],
    totalInvestment: { type: Number, default: 0 },
    currentValue: { type: Number, default: 0 },
    lastUpdated: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Portfolio", portfolioSchema);
