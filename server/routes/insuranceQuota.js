const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const insuranceQuotaController = require("../controllers/InsuranceQuotaController");

console.log(
    "Available controller methods:",
    Object.keys(insuranceQuotaController)
);

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

router.delete(
    "/delete/:id",
    authMiddleware,
    insuranceQuotaController.deleteInsuranceQuota
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
