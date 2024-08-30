const nodemailer = require("nodemailer");

const OTP_VALID_DURATION = 600000; // 10 minutes
const otpStorage = new Map();

function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

async function sendOTP(email, otp) {
    let testAccount = await nodemailer.createTestAccount();

    let transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false,
        auth: {
            user: testAccount.user,
            pass: testAccount.pass,
        },
    });

    let info = await transporter.sendMail({
        from: '"Your App" <noreply@yourapp.com>',
        to: email,
        subject: "Your Login OTP",
        text: `Your OTP is: ${otp}`,
        html: `<b>Your OTP is: ${otp}</b>`,
    });

    console.log("Message sent: %s", info.messageId);
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
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
