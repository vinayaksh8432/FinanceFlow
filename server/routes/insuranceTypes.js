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

// Add new insurance
router.post("/add", async (req, res) => {
    try {
        const newInsurance = new Insurance(req.body);
        await newInsurance.save();
        res.status(201).json(newInsurance);
    } catch (error) {
        console.error("Error adding insurance:", error);
        res.status(500).json({ message: "Error adding insurance" });
    }
});

// Update existing insurance
router.put("/update/:id", async (req, res) => {
    try {
        const updatedInsurance = await Insurance.findOneAndUpdate(
            { id: req.params.id },
            req.body,
            { new: true }
        );
        if (!updatedInsurance) {
            return res.status(404).json({ message: "Insurance not found" });
        }
        res.json(updatedInsurance);
    } catch (error) {
        console.error("Error updating insurance:", error);
        res.status(500).json({ message: "Error updating insurance" });
    }
});

// Delete insurance
router.delete("/delete/:id", async (req, res) => {
    try {
        const deletedInsurance = await Insurance.findOneAndDelete({
            id: req.params.id,
        });
        if (!deletedInsurance) {
            return res.status(404).json({ message: "Insurance not found" });
        }
        res.json({ message: "Insurance deleted successfully" });
    } catch (error) {
        console.error("Error deleting insurance:", error);
        res.status(500).json({ message: "Error deleting insurance" });
    }
});

module.exports = router;
