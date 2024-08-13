const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const authRoutes = require("./routes/users"); // Import the new auth routes

const app = express();
app.use(express.json());
app.use(
    cors({
        origin: "http://localhost:5173",
        credentials: true,
    })
);
app.use(cookieParser());

mongoose
    .connect("mongodb://127.0.0.1:27017/customer", {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.error("Could not connect to MongoDB...", err));

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

// Use the auth routes
app.use("/api/users", authRoutes);

app.get("/api/users/user", (req, res) => {
    const token = req.cookies.token;
    if (!token) {
        return res
            .status(401)
            .json({ message: "No token, authorization denied" });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        res.json(decoded);
    } catch (error) {
        res.status(400).json({ message: "Token is not valid" });
    }
});

app.listen(3000, () => {
    console.log("Server is currently running on port 3000");
});
