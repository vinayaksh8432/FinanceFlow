const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");

const CustomerModel = require("../model/customer");

const otpModule = require("../routes/otp");

const bcrypt = require("bcrypt");

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is not set in the environment");
}

router.post("/register", async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await CustomerModel.create({
            name,
            email,
            password: hashedPassword,
        });
        res.json({ user: { name: user.name, email: user.email } });
    } catch (error) {
        res.status(400).json({
            message: "Error creating user",
            error: error.message,
        });
    }
});

router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await CustomerModel.findOne({ email });
        if (!user) {
            return res
                .status(400)
                .json({ message: "No user found with this email" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        
        if (!isMatch) {
            return res.status(400).json({ message: "Password is incorrect" });
        }

        const otp = otpModule.generateOTP();
        otpModule.storeOTP(user._id.toString(), otp);
        await otpModule.sendOTP(user.email, otp);

        res.json({
            message: "OTP sent to your email",
            userId: user._id,
            requireOtp: true,
        });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({
            message: "Internal server error",
            error: error.message,
        });
    }
});

router.post("/userAuth", async (req, res) => {
    const { userId, otp } = req.body;
    try {
        const user = await CustomerModel.findById(userId);
        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }

        if (!otpModule.verifyOTP(userId, otp)) {
            return res.status(400).json({ message: "Invalid or expired OTP" });
        }

        // Generate token
        const token = jwt.sign({ id: user._id }, JWT_SECRET, {
            expiresIn: "1h",
        });

        res.cookie("token", token, {
            httpOnly: true,
            maxAge: 3600000,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
        });

        res.json({
            message: "Login successful",
            user: { name: user.name, email: user.email },
            token: token,
        });
    } catch (error) {
        console.error("OTP verification error:", error);
        res.status(500).json({
            message: "Internal server error",
            error: error.message,
        });
    }
});

router.post("/logout", async (req, res) => {
    const token = req.cookies.token;
    if (token) {
        try {
            const decoded = jwt.verify(token, JWT_SECRET);
            const user = await CustomerModel.findById(decoded.id);
            if (user) {
                user.lastLogin = Date.now();
                // Do not reset the OTP expiration here
                await user.save();
            }
        } catch (error) {
            console.error("Error updating last login time:", error);
        }
    }
    res.clearCookie("token");
    res.json({ message: "Logged out successfully" });
});

// Modify the user route to return user details
router.get("/user", async (req, res) => {
    const token = req.cookies.token;
    if (!token) {
        return res
            .status(401)
            .json({ message: "No token, authorization denied" });
    }
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        const user = await CustomerModel.findById(decoded.id).select(
            "-password"
        );
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json({ name: user.name, email: user.email });
    } catch (error) {
        res.status(400).json({ message: "Token is not valid" });
    }
});

module.exports = router;
