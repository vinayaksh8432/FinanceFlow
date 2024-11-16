const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const insuranceQuotaController = require("../controllers/InsuranceQuotaController");

// Verify controller functions exist before using them
console.log(
    "Available controller methods:",
    Object.keys(insuranceQuotaController)
);

// Define routes with proper controller functions
router.post(
    "/create",
    authMiddleware,
    insuranceQuotaController.createInsuranceQuota
);
router.get(
    "/user-quotas",
    authMiddleware,
    insuranceQuotaController.getUserQuotas
);

// Error handling middleware
router.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: "Something went wrong!",
        error: err.message,
    });
});

module.exports = router;
