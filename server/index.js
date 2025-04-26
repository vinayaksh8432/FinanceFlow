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

// Configure CORS with specific allowed origins
const allowedOrigins = [
    "http://localhost:5173",
    "http://localhost:5174",
    "https://finance-flow-brown.vercel.app",
    "https://financeflow-brown.vercel.app",
    "https://financeflow-lovat.vercel.app",
];

// Use the cors package explicitly with proper options
app.use(
    cors({
        origin: function (origin, callback) {
            // Allow requests with no origin (like mobile apps or curl requests)
            if (!origin) return callback(null, true);

            if (allowedOrigins.indexOf(origin) !== -1) {
                callback(null, origin);
            } else {
                console.log(`Blocked request from origin: ${origin}`);
                // During development, you might want to allow all origins
                callback(null, origin); // Comment this in production
                // Uncomment in production:
                // callback(new Error('Not allowed by CORS'));
            }
        },
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
    })
);

// Handle preflight OPTIONS requests separately for better browser compatibility
app.options("*", cors());

// Add CORS debugging information to all responses
app.use((req, res, next) => {
    // Log request details
    console.log(`${req.method} ${req.url} from origin: ${req.headers.origin}`);
    next();
});

// Static file serving
app.use("/uploads", express.static(path.join(__dirname, "/public/uploads")));
app.use("/assets", express.static(path.join(__dirname, "public/assets")));

// Database connection
mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.error("Could not connect to MongoDB...", err));

// Test endpoint to verify CORS is working
app.get("/api/test-cors", (req, res) => {
    res.json({
        message: "CORS is working correctly!",
        origin: req.headers.origin,
        headers: req.headers,
        allowedOrigins: allowedOrigins,
    });
});

// API routes
app.use("/api/users", authRoutes);
app.use("/api/loan-types", loanTypesRoutes);
app.use("/api/loan-applications", loanApplicationRoutes);
app.use("/api/insurance-types", insuranceTypesRoutes);
app.use("/api/insurance-quotas", insuranceQuotaRoutes);
app.use("/api/portfolio", portfolioRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`CORS allowed origins: ${allowedOrigins.join(", ")}`);
});
