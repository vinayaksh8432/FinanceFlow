const mongoose = require("mongoose");

const insuranceItemSchema = new mongoose.Schema({
    itemId: {
        // Changed from id to itemId
        type: String,
        required: true,
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
        enum: ["Retail", "Group"],
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
});

const insuranceSchema = new mongoose.Schema(
    {
        category: {
            type: String,
            required: true,
            enum: ["Health", "Car", "TwoWheeler", "Life"],
        },
        items: [insuranceItemSchema],
    },
    {
        timestamps: true,
        collection: "insurances",
    }
);

// Create and export the model
const Insurance = mongoose.model("Insurance", insuranceSchema);
module.exports = Insurance;
