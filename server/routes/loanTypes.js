const express = require("express");
const router = express.Router();
const { loanTypes } = require("../data/loanTypes"); 

router.get("/", (req, res) => {
    try {
        res.json(loanTypes);
    } catch (error) {
        console.error("Error fetching loan types:", error);
        res.status(500).json({ message: "Error fetching loan types" });
    }
});

module.exports = router;
