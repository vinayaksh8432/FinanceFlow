require("dotenv").config();
const mongoose = require("mongoose");
const Insurance = require("../model/insurance");
const { CarInsurance } = require("../data/Insurance/carInsurance");
const { HealthInsurance } = require("../data/Insurance/healthInsurance");

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    console.error("MONGODB_URI environment variable is not defined");
    process.exit(1);
}

mongoose
    .connect(MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => {
        console.error("Could not connect to MongoDB:", err.message);
        process.exit(1);
    });

const seedDatabase = async () => {
    try {
        // Clear existing data
        await Insurance.deleteMany({});

        // Combine all insurance data
        const allInsurance = [...CarInsurance, ...HealthInsurance];

        // Insert data
        await Insurance.insertMany(allInsurance);

        console.log("Database seeded successfully");
        process.exit(0);
    } catch (error) {
        console.error("Error seeding database:", error.message);
        process.exit(1);
    }
};

seedDatabase();
