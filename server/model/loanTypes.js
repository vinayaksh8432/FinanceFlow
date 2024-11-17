const mongoose = require("mongoose");

const loanTypeSchema = new mongoose.Schema(
    {
        id: {
            type: String,
            required: true,
            unique: true,
        },
        typeImage: {
            type: String,
            required: true,
        },
        name: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        shortDescription: {
            type: String,
            required: true,
        },
        interestRate: {
            type: String,
            required: true,
        },
        upto: {
            type: String,
            required: true,
        },
        maxAmount: {
            type: Number,
            required: true,
        },
        allowedTenures: [
            {
                type: String,
                required: true,
            },
        ],
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("LoanType", loanTypeSchema);
