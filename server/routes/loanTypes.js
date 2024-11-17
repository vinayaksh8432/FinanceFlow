const express = require("express");
const router = express.Router();
const LoanType = require("../model/loanTypes");

// Get all loan types
router.get("/", async (req, res) => {
    try {
        const loanTypes = await LoanType.find({});
        res.json(loanTypes);
    } catch (error) {
        console.error("Error fetching loan types:", error);
        res.status(500).json({ message: "Error fetching loan types" });
    }
});

// Add a new loan type
router.post("/", async (req, res) => {
    try {
        const newLoanType = new LoanType(req.body);
        await newLoanType.save();
        res.status(201).json(newLoanType);
    } catch (error) {
        console.error("Error creating loan type:", error);
        res.status(400).json({ message: error.message });
    }
});

// Update a loan type
router.put("/:id", async (req, res) => {
    try {
        const updatedLoanType = await LoanType.findOneAndUpdate(
            { id: req.params.id },
            req.body,
            { new: true }
        );
        if (!updatedLoanType) {
            return res.status(404).json({ message: "Loan type not found" });
        }
        res.json(updatedLoanType);
    } catch (error) {
        console.error("Error updating loan type:", error);
        res.status(400).json({ message: error.message });
    }
});

// Delete a loan type
router.delete("/:id", async (req, res) => {
    try {
        const deletedLoanType = await LoanType.findOneAndDelete({
            id: req.params.id,
        });
        if (!deletedLoanType) {
            return res.status(404).json({ message: "Loan type not found" });
        }
        res.json({ message: "Loan type deleted successfully" });
    } catch (error) {
        console.error("Error deleting loan type:", error);
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
