const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");

const UserModel = require("../model/users");

const otpModule = require("../routes/otp");

const bcrypt = require("bcrypt");

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is not set in the environment");
}

router.get("/", async (req, res) => {
    const token = req.cookies.token;
    if (!token) {
        return res
            .status(401)
            .json({ message: "No token, authorization denied" });
    }
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        const user = await UserModel.findById(decoded.id).select("-password");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json({ name: user.name, email: user.email });
    } catch (error) {
        res.status(400).json({ message: "Token is not valid" });
    }
});

router.post("/register", async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await UserModel.create({
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
        const user = await UserModel.findOne({ email });
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
        const user = await UserModel.findById(userId);
        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }

        if (!otpModule.verifyOTP(userId, otp)) {
            return res.status(400).json({ message: "Invalid or expired OTP" });
        }

        // Generate token
        const token = jwt.sign({ id: user._id }, JWT_SECRET, {
            expiresIn: "1d", // Change to 1 day
        });

        res.cookie("token", token, {
            httpOnly: true,
            maxAge: 86400000, // 1 day in milliseconds
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

router.post("/resend-otp", async (req, res) => {
    const { userId } = req.body;

    try {
        const user = await UserModel.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const otp = otpModule.generateOTP();
        const emailSent = await otpModule.sendOTP(user.email, otp);

        if (!emailSent) {
            return res
                .status(500)
                .json({ message: "Failed to send OTP email" });
        }

        otpModule.storeOTP(userId, otp);

        res.json({ message: "OTP resent successfully" });
    } catch (error) {
        console.error("Error resending OTP:", error);
        res.status(500).json({ message: "Failed to resend OTP" });
    }
});

router.post("/verify-otp", async (req, res) => {
    const { userId, otp } = req.body;

    try {
        if (!otpModule.verifyOTP(userId, otp)) {
            return res.status(400).json({ message: "Invalid or expired OTP" });
        }

        const user = await UserModel.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Generate JWT token
        const token = jwt.sign({ id: user._id }, JWT_SECRET, {
            expiresIn: "1d", // Change to 1 day
        });

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 86400000, // 1 day in milliseconds
        });

        res.json({
            message: "OTP verified successfully",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                // other user fields you want to send
            },
            token,
        });
    } catch (error) {
        console.error("Error verifying OTP:", error);
        res.status(500).json({ message: "Failed to verify OTP" });
    }
});

router.post("/logout", async (req, res) => {
    const token = req.cookies.token;
    if (token) {
        try {
            const decoded = jwt.verify(token, JWT_SECRET);
            const user = await UserModel.findById(decoded.id);
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

module.exports = router;
