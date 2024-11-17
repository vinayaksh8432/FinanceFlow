const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const {
    submitLoanApplication,
} = require("../controllers/LoanApplicationController");
const LoanApplication = require("../model/loanApplication");

router.use(authMiddleware);

router.post("/", submitLoanApplication);

router.get("/", async (req, res) => {
    try {
        const applications = await LoanApplication.find({
            userId: req.user._id,
        });
        res.json({
            success: true,
            applications,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
});

// Update application
router.put("/:id", async (req, res) => {
    try {
        const application = await LoanApplication.findOneAndUpdate(
            { _id: req.params.id, userId: req.user._id },
            req.body,
            { new: true }
        );

        if (!application) {
            return res.status(404).json({
                success: false,
                message: "Application not found or unauthorized",
            });
        }

        res.json({
            success: true,
            application,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
});

// Delete application
router.delete("/:id", async (req, res) => {
    try {
        const result = await LoanApplication.deleteOne({
            _id: req.params.id,
            userId: req.user._id,
        });

        if (result.deletedCount === 0) {
            return res.status(404).json({
                success: false,
                message: "Application not found or unauthorized",
            });
        }

        res.json({
            success: true,
            message: "Successfully deleted",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
});

module.exports = router;
