const express = require("express");
const router = express.Router();
const Insurance = require("../model/insurance");

// Get all insurance data
router.get("/all", async (req, res) => {
    try {
        const insurances = await Insurance.find({});
        res.json(insurances);
    } catch (error) {
        console.error("Error fetching all insurance types:", error);
        res.status(500).json({ message: "Error fetching all insurance types" });
    }
});

module.exports = router;
