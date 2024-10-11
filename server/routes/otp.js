const nodemailer = require("nodemailer");

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
        // html: `<b>Your OTP is: ${otp}</b>`,
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

module.exports = {
    generateOTP,
    sendOTP,
    storeOTP,
    verifyOTP,
    OTP_VALID_DURATION,
};
