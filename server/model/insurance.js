const mongoose = require("mongoose");

const insuranceSchema = new mongoose.Schema(
    {
        id: {
            type: String,
            required: true,
            unique: true,
        },
        image: {
            type: String,
            required: true,
        },
        name: {
            type: String,
            required: true,
        },
        type: {
            type: String,
            required: true,
            enum: ["Retail", "Group"], // Add other types if needed
        },
        catagory: {
            type: String,
            required: true,
            enum: ["Health", "Car"], // Add other categories if needed
        },
        price: {
            type: String,
            required: true,
        },
        coverage: {
            type: String,
            required: false,
        },
        details: {
            type: Map,
            of: String,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

const Insurance = mongoose.model("Insurance", insuranceSchema);

module.exports = Insurance;
