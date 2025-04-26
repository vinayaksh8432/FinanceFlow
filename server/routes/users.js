const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const UserModel = require("../model/users");
const otpModule = require("../routes/otp");
const bcrypt = require("bcrypt");
const authMiddleware = require("../middleware/authMiddleware");

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is not set in the environment");
}

// Get user details (supports both cookie and bearer token)
router.get("/", authMiddleware, async (req, res) => {
    try {
        // User is already attached to req from the authMiddleware
        res.json({
            name: req.user.name,
            email: req.user.email,
            id: req.user._id,
        });
    } catch (error) {
        console.error("Error getting user details:", error);
        res.status(500).json({
            success: false,
            message: "Failed to get user details",
            error: error.message,
        });
    }
});

router.post("/userAuth", async (req, res) => {
    const { userId, otp } = req.body;
    try {
        const user = await UserModel.findById(userId);
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "User not found",
            });
        }

        if (!otpModule.verifyOTP(userId, otp)) {
            return res.status(400).json({
                success: false,
                message: "Invalid or expired OTP",
            });
        }

        // Generate token
        const token = jwt.sign({ id: user._id }, JWT_SECRET, {
            expiresIn: "1d", // 1 day token
        });

        // Set secure cookie for same-site scenarios
        const isProduction = process.env.NODE_ENV === "production";
        res.cookie("token", token, {
            httpOnly: true,
            maxAge: 86400000, // 1 day in milliseconds
            secure: isProduction,
            sameSite: isProduction ? "none" : "lax", // Allow cross-site cookie for production
            path: "/",
        });

        res.json({
            success: true,
            message: "Login successful",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
            },
            token: token, // Send token for client-side storage
        });
    } catch (error) {
        console.error("OTP verification error:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
});

router.post("/register", async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check if user already exists
        const existingUser = await UserModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User with this email already exists",
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await UserModel.create({
            name,
            email,
            password: hashedPassword,
        });

        res.json({
            success: true,
            message: "User registered successfully",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
            },
        });
    } catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({
            success: false,
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
            return res.status(400).json({
                success: false,
                message: "No user found with this email",
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: "Password is incorrect",
            });
        }

        const otp = otpModule.generateOTP();
        otpModule.storeOTP(user._id.toString(), otp);
        await otpModule.sendOTP(user.email, otp);

        res.json({
            success: true,
            message: "OTP sent to your email",
            userId: user._id,
            requireOtp: true,
        });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
});

router.post("/reset-password", async (req, res) => {
    const { email } = req.body;
    try {
        const user = await UserModel.findOne({ email });
        if (!user) {
            return res
                .status(400)
                .json({ message: "No user found with this email" });
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
        console.error("Reset password error:", error);
        res.status(500).json({
            message: "Internal server error",
            error: error.message,
        });
    }
});

router.post("/update-password", async (req, res) => {
    const { userId, newPassword } = req.body;
    try {
        const user = await UserModel.findById(userId);
        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        await user.save();
        res.json({ message: "Password updated successfully" });
    } catch (error) {
        console.error("Update password error:", error);
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
            return res.status(400).json({
                success: false,
                message: "Invalid or expired OTP",
            });
        }

        const user = await UserModel.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        // Generate JWT token
        const token = jwt.sign({ id: user._id }, JWT_SECRET, {
            expiresIn: "1d", // 1 day token
        });

        // Set secure cookie for same-site scenarios
        const isProduction = process.env.NODE_ENV === "production";
        res.cookie("token", token, {
            httpOnly: true,
            secure: isProduction,
            sameSite: isProduction ? "none" : "lax", // Allow cross-site cookie for production
            path: "/",
            maxAge: 86400000, // 1 day in milliseconds
        });

        res.json({
            success: true,
            message: "OTP verified successfully",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
            },
            token, // For client-side storage
        });
    } catch (error) {
        console.error("Error verifying OTP:", error);
        res.status(500).json({
            success: false,
            message: "Failed to verify OTP",
            error: error.message,
        });
    }
});

router.post("/logout", async (req, res) => {
    let token;

    // Check for token in cookies first
    if (req.cookies && req.cookies.token) {
        token = req.cookies.token;
    }
    // Then check Authorization header (Bearer token)
    else if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer ")
    ) {
        token = req.headers.authorization.split(" ")[1];
    }

    if (token) {
        try {
            const decoded = jwt.verify(token, JWT_SECRET);
            const user = await UserModel.findById(decoded.id);
            if (user) {
                user.lastLogin = Date.now();
                await user.save();
            }
        } catch (error) {
            console.error("Error updating last login time:", error);
        }
    }

    // Clear the cookie
    const isProduction = process.env.NODE_ENV === "production";
    res.clearCookie("token", {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? "none" : "lax",
        path: "/",
    });

    res.json({
        success: true,
        message: "Logged out successfully",
    });
});

module.exports = router;
