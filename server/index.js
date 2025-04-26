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
const otpRoutes = require("./routes/otp");
const path = require("path");

const app = express();

// Apply basic middleware
app.use(express.json());
app.use(cookieParser());

// Configure CORS with specific allowed origins
const allowedOrigins = [
    "http://localhost:5173",
    "http://localhost:5174",
    "https://financeflow-white.vercel.app",
    "https://www.financeflow-white.vercel.app",
    process.env.CLIENT_URL,
];

// Apply CORS configuration
app.use(
    cors({
        origin: function (origin, callback) {
            // Allow requests with no origin (like mobile apps, Postman, or curl requests)
            if (!origin) return callback(null, true);

            if (allowedOrigins.indexOf(origin) !== -1) {
                callback(null, origin);
            } else {
                console.log(
                    `Blocked request from disallowed origin: ${origin}`
                );
                // For security in production, remove this line and uncomment the line below
                // callback(new Error('Not allowed by CORS'));
                callback(null, origin); // More permissive during testing
            }
        },
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allowedHeaders: [
            "Content-Type",
            "Authorization",
            "X-Requested-With",
            "Accept",
        ],
        exposedHeaders: ["Content-Length", "X-Requested-With"],
        maxAge: 86400, // 24 hours in seconds
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
app.get("/", (req, res) => {
    res.send("Welcome to the FinanceFlow API!");
});
app.get("/api", (req, res) => {
    res.send("Welcome to the FinanceFlow API!");
});
app.use("/api/users", authRoutes);
app.use("/api/loan-types", loanTypesRoutes);
app.use("/api/loan-applications", loanApplicationRoutes);
app.use("/api/insurance-types", insuranceTypesRoutes);
app.use("/api/insurance-quotas", insuranceQuotaRoutes);
app.use("/api/portfolio", portfolioRoutes);
app.use("/api/otp", otpRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: "Something went wrong on the server",
        error:
            process.env.NODE_ENV === "development"
                ? err.message
                : "Internal server error",
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`CORS allowed origins: ${allowedOrigins.join(", ")}`);
});
