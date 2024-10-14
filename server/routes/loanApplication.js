// routes/loanApplicationRoutes.js

const express = require("express");
const router = express.Router();
const {
    submitLoanApplication,
} = require("../controllers/LoanApplicationController");
const LoanApplication = require("../model/loanApplication");

router.post("/submit", submitLoanApplication);

router.get("/", async (req, res) => {
    try {
        const applications = await LoanApplication.find();
        res.json(applications);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.put("/updateApplication/:id", async (req, res) => {
    try {
        const updatedApplication = await LoanApplication.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (!updatedApplication) {
            return res.status(404).send("Application not found");
        }
        res.json(updatedApplication);
    } catch (error) {
        res.status(400).send(error.message);
    }
});

router.delete("/deleteApplication/:id", async (req, res) => {
    try {
        const result = await LoanApplication.deleteOne({ _id: req.params.id });
        if (result.deletedCount === 1) {
            res.json({ message: "Successfully Deleted" });
        } else {
            res.status(404).json({ message: "Application not found" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
