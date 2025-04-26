require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const authRoutes = require("./routes/users");
const loanTypesRoutes = require("./routes/loanTypes");
const insuranceTypesRoutes = require("./routes/insuranceTypes");
const insuranceQuotaRoutes = require("./routes/insuranceQuota");
const loanApplicationRoutes = require("./routes/loanApplication");
const portfolioRoutes = require("./routes/portfolio");
const path = require("path");
const { fileURLToPath } = require("url");

const app = express();

// Apply basic middleware first
app.use(express.json());
app.use(cookieParser());

// Configure CORS - Apply before any route handlers
const allowedOrigins = [
    "http://localhost:5173",
    "http://localhost:5174",
    "https://finance-flow-brown.vercel.app",
    "https://financeflow-brown.vercel.app",
    "https://financeflow-lovat.vercel.app",
];

// Pre-flight OPTIONS handling for CORS
app.options("*", cors());

// Configure CORS with proper credentials support
app.use(
    cors({
        origin: function (origin, callback) {
            // Allow requests with no origin (like mobile apps or curl requests)
            if (!origin) return callback(null, true);

            if (allowedOrigins.indexOf(origin) !== -1) {
                callback(null, true);
            } else {
                console.log("Blocked origin:", origin);
                callback(null, true); // Temporarily allow all origins while debugging
            }
        },
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
    })
);

// Static file serving
app.use("/uploads", express.static(path.join(__dirname, "/public/uploads")));
app.use("/assets", express.static(path.join(__dirname, "public/assets")));

// Database connection
mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.error("Could not connect to MongoDB...", err));

// API routes
app.use("/api/users", authRoutes);
app.use("/api/loan-types", loanTypesRoutes);
app.use("/api/loan-applications", loanApplicationRoutes);
app.use("/api/insurance-types", insuranceTypesRoutes);
app.use("/api/insurance-quotas", insuranceQuotaRoutes);
app.use("/api/portfolio", portfolioRoutes);

// Add a test endpoint to verify CORS is working
app.get("/api/test-cors", (req, res) => {
    res.json({
        message: "CORS is working correctly!",
        origin: req.headers.origin,
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
