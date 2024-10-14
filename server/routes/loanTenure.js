const express = require("express");
const router = express.Router();
const { loanTenure } = require("../data/loanTenure");

router.get("/", (req, res) => {
    try {
        res.json(loanTenure);
    } catch (error) {
        console.error("Error fetching loan tenure:", error);
        res.status(500).json({ message: "Error fetching loan tenure" });
    }
});

module.exports = router;
