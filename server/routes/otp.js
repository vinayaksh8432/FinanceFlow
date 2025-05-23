const nodemailer = require("nodemailer");
const express = require("express");
const router = express.Router();

const OTP_VALID_DURATION = 600000; // 10 minutes
const otpStorage = new Map();

function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

async function sendOTP(email, otp) {
    // Create a transporter using Gmail SMTP
    let transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER, // Your Gmail address
            pass: process.env.EMAIL_APP_PASSWORD, // Your Gmail App Password
        },
    });

    // Email options
    let mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Your Login OTP",
        text: `Your OTP is: ${otp}`,
        html: `<h1>Your OTP is: ${otp}</h1>`,
    };

    try {
        let info = await transporter.sendMail(mailOptions);
        console.log("Message sent: %s", info.messageId);
        return true;
    } catch (error) {
        console.error("Error sending email:", error);
        return false;
    }
}

function storeOTP(userId, otp) {
    otpStorage.set(userId, {
        otp: otp,
        expires: Date.now() + OTP_VALID_DURATION,
    });

    setTimeout(() => {
        otpStorage.delete(userId);
    }, OTP_VALID_DURATION);
}

function verifyOTP(userId, otp) {
    const storedOtpData = otpStorage.get(userId);
    if (
        !storedOtpData ||
        storedOtpData.otp !== otp ||
        Date.now() > storedOtpData.expires
    ) {
        return false;
    }
    otpStorage.delete(userId);
    return true;
}

// API Routes for OTP
router.post("/generate", async (req, res) => {
    const { email, userId } = req.body;

    if (!email || !userId) {
        return res
            .status(400)
            .json({ success: false, message: "Email and userId are required" });
    }

    try {
        const otp = generateOTP();
        const sent = await sendOTP(email, otp);

        if (sent) {
            storeOTP(userId, otp);
            return res
                .status(200)
                .json({ success: true, message: "OTP sent successfully" });
        } else {
            return res
                .status(500)
                .json({ success: false, message: "Failed to send OTP" });
        }
    } catch (error) {
        console.error("OTP generation error:", error);
        return res
            .status(500)
            .json({ success: false, message: "Error generating OTP" });
    }
});

router.post("/verify", (req, res) => {
    const { userId, otp } = req.body;

    if (!userId || !otp) {
        return res
            .status(400)
            .json({ success: false, message: "userId and OTP are required" });
    }

    const isValid = verifyOTP(userId, otp);

    if (isValid) {
        return res
            .status(200)
            .json({ success: true, message: "OTP verified successfully" });
    } else {
        return res
            .status(400)
            .json({ success: false, message: "Invalid or expired OTP" });
    }
});

// Export the router
module.exports = router;

// Also export the utility functions to use in other files if needed
module.exports.utils = {
    generateOTP,
    sendOTP,
    storeOTP,
    verifyOTP,
    OTP_VALID_DURATION,
};
