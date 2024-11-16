const mongoose = require("mongoose");

const insuranceQuotaSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        policies: [
            {
                name: {
                    type: String,
                    required: true,
                },
                type: {
                    type: String,
                    required: true,
                },
                coverage: {
                    type: Number,
                    required: true,
                },
                premium: {
                    type: Number,
                    required: true,
                },
                startDate: {
                    type: Date,
                    required: true,
                },
                endDate: {
                    type: Date,
                    required: true,
                },
                status: {
                    type: String,
                    required: true,
                    enum: ["Pending", "Active", "Expired", "Cancelled"],
                    default: "Pending",
                },
                details: {
                    type: mongoose.Schema.Types.Mixed,
                },
            },
        ],
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("InsuranceQuota", insuranceQuotaSchema);
