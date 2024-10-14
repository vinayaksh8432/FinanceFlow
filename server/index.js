require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const authRoutes = require("./routes/users");
const loanTypesRoutes = require("./routes/loanTypes");
const loanApplicationRoutes = require("./routes/loanApplication");
const loanTenureRoutes = require("./routes/loanTenure");

const app = express();

app.use(express.json());
app.use(cookieParser());

const allowedOrigins = ["http://localhost:5173", "http://localhost:5174"];

app.use(
    cors({
        origin: function (origin, callback) {
            if (!origin) return callback(null, true);
            if (allowedOrigins.indexOf(origin) === -1) {
                var msg =
                    "The CORS policy for this site does not " +
                    "allow access from the specified Origin.";
                return callback(new Error(msg), false);
            }
            return callback(null, true);
        },
        credentials: true,
    })
);

mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.error("Could not connect to MongoDB...", err));

app.use("/api/users", authRoutes);
app.use("/api/loan-types", loanTypesRoutes);
app.use("/api/loan-tenure", loanTenureRoutes);
app.use("/api/loan-applications", loanApplicationRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
