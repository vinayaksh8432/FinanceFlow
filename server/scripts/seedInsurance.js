require("dotenv").config();
const mongoose = require("mongoose");
const Insurance = require("../model/insurance");
const { allInsurance } = require("../data/Insurance/allInsurance");

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    console.error("MONGODB_URI environment variable is not defined");
    process.exit(1);
}

const connectDB = async () => {
    try {
        await mongoose.connect(MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("Connected to MongoDB");
    } catch (err) {
        console.error("Could not connect to MongoDB:", err.message);
        process.exit(1);
    }
};

const seedDatabase = async () => {
    try {
        await connectDB();

        // Clear existing data
        await Insurance.deleteMany({});

        // Drop the collection to ensure clean slate
        if (mongoose.connection.collections["insurances"]) {
            await mongoose.connection.collections["insurances"].drop();
        }

        // Create new documents
        await Insurance.create(allInsurance);

        console.log("Database seeded successfully");
        await mongoose.connection.close();
        process.exit(0);
    } catch (error) {
        console.error("Error seeding database:", error.message);
        await mongoose.connection.close();
        process.exit(1);
    }
};

seedDatabase();
