const express = require("express");
const router = express.Router();
const CustomerModel = require("../model/customer");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret"; // Use environment variable in production

router.post("/register", async (req, res) => {
    try {
        const user = await CustomerModel.create(req.body);
        res.json({ user: { name: user.name, email: user.email } });
    } catch (error) {
        res.status(400).json({ message: "Error creating user" });
    }
});

router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await CustomerModel.findOne({ email: email });
        if (user) {
            if (user.password === password) {
                const token = jwt.sign(
                    { id: user._id, email: user.email, name: user.name },
                    JWT_SECRET,
                    { expiresIn: "1h" }
                );

                res.cookie("token", token, {
                    httpOnly: true,
                    maxAge: 3600000, // 1 hour
                    secure: process.env.NODE_ENV === "production",
                    sameSite: "strict",
                });

                res.json({
                    message: "Login successful",
                    user: { name: user.name, email: user.email },
                });
            } else {
                res.status(400).json({ message: "Password is incorrect" });
            }
        } else {
            res.status(400).json({ message: "No user found with this email" });
        }
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
});

router.post("/logout", (req, res) => {
    res.clearCookie("token");
    res.clearCookie("user");
    res.json({ message: "Logged out successfully" });
});

module.exports = router;
