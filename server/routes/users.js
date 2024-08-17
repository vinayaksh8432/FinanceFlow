const express = require("express");
const router = express.Router();
const CustomerModel = require("../model/customer");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const crypto = require("crypto");

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is not set in the environment");
}

const OTP_VALID_DURATION = 600000; // 1 hour in milliseconds

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

function generateOTP() {
    return Math.floor(1000 + Math.random() * 9000).toString();
}

async function sendOTP(email, otp) {
    // Create a test account
    let testAccount = await nodemailer.createTestAccount();

    // Create a transporter using the test account
    let transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: testAccount.user, // generated ethereal user
            pass: testAccount.pass, // generated ethereal password
        },
    });

    // Send mail with defined transport object
    let info = await transporter.sendMail({
        from: '"Your App" <noreply@yourapp.com>',
        to: email,
        subject: "Your Login OTP",
        text: `Your OTP is: ${otp}`,
        html: `<b>Your OTP is: ${otp}</b>`,
    });

    console.log("Message sent: %s", info.messageId);
    // Preview URL
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
}

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

        // Check if OTP is still valid
        if (user.otpExpires && user.otpExpires > Date.now()) {
            // OTP is still valid, proceed with login without requiring OTP
            const token = jwt.sign({ id: user._id }, JWT_SECRET, {
                expiresIn: "1h",
            });

            res.cookie("token", token, {
                httpOnly: true,
                maxAge: 3600000,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
            });

            return res.json({
                message: "Login successful",
                user: { name: user.name, email: user.email },
                token: token,
            });
        }

        // Generate new OTP
        const otp = generateOTP();
        const hashedOtp = crypto.createHash("sha256").update(otp).digest("hex");

        // Save OTP to user document
        user.otp = hashedOtp;
        user.otpExpires = Date.now() + OTP_VALID_DURATION;
        await user.save();

        // Send OTP
        await sendOTP(user.email, otp);

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

        const hashedReceivedOtp = crypto
            .createHash("sha256")
            .update(otp)
            .digest("hex");

        if (user.otp !== hashedReceivedOtp || Date.now() > user.otpExpires) {
            return res.status(400).json({ message: "Invalid or expired OTP" });
        }

        // Clear the OTP after successful verification
        user.otp = undefined;
        user.otpExpires = undefined;
        await user.save();

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
            token: token, // Include the token in the response
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
