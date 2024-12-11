const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const {
    submitLoanApplication,
} = require("../controllers/LoanApplicationController");
const LoanApplication = require("../model/loanApplication");
const uploadMiddleware = require("../middleware/upload");

router.use(authMiddleware);

router.post("/", uploadMiddleware, submitLoanApplication);

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

router.put("/approve/:id", authMiddleware, async (req, res) => {
    try {
        const application = await LoanApplication.findByIdAndUpdate(
            req.params.id,
            { Status: "Approved" }, // Changed from lowercase 'status' to uppercase 'Status'
            { new: true }
        );

        if (!application) {
            return res.status(404).json({
                success: false,
                message: "Application not found",
            });
        }

        res.json({
            success: true,
            message: "Application approved successfully",
            application,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
});

router.put("/reject/:id", authMiddleware, async (req, res) => {
    try {
        const application = await LoanApplication.findByIdAndUpdate(
            req.params.id,
            { Status: "Rejected" },
            { new: true }
        );
        if (!application) {
            return res.status(404).json({
                success: false,
                message: "Application not found",
            });
        }
        res.json({
            success: true,
            message: "Application rejected successfully",
            application,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
});

module.exports = router;
