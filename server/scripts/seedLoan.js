require("dotenv").config();
const mongoose = require("mongoose");
const LoanType = require("../model/loanTypes");
const { loanTypes } = require("../data/loanTypes");

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    console.error("MONGODB_URI environment variable is not defined");
    process.exit(1);
}

mongoose
    .connect(MONGODB_URI, {
        dbName: "FinanceFlow",
    })
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => {
        console.error("Could not connect to MongoDB:", err.message);
        process.exit(1);
    });

const seedDatabase = async () => {
    try {
        // Clear existing data
        await LoanType.deleteMany({});
        console.log("Cleared existing loan types");

        // Insert data
        await LoanType.insertMany(loanTypes);
        console.log("Database seeded successfully");
        process.exit(0);
    } catch (error) {
        console.error("Error seeding database:", error.message);
        process.exit(1);
    }
};

seedDatabase();
