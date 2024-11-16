// controllers/InsuranceQuotaController.js
const InsuranceQuota = require("../model/insuranceQuota"); // adjust path as needed

const createInsuranceQuota = async (req, res) => {
    try {
        if (!req.user || !req.user._id) {
            return res.status(401).json({
                success: false,
                message: "User not authenticated",
            });
        }

        const newPolicy = {
            ...req.body,
            startDate: new Date(),
            endDate: new Date(
                new Date().setFullYear(new Date().getFullYear() + 1)
            ),
            status: "Pending", // Default status is now Pending
        };

        // Find existing quota document for user or create new one
        let userQuota = await InsuranceQuota.findOne({ userId: req.user._id });

        if (!userQuota) {
            userQuota = await InsuranceQuota.create({
                userId: req.user._id,
                policies: [newPolicy],
            });
        } else {
            userQuota.policies.push(newPolicy);
            await userQuota.save();
        }

        res.status(201).json({
            success: true,
            message: "Insurance policy added successfully",
            data: userQuota,
        });
    } catch (error) {
        console.error("Error creating insurance quota:", error);
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

const getUserQuotas = async (req, res) => {
    try {
        const userQuota = await InsuranceQuota.findOne({
            userId: req.user._id,
        });
        res.status(200).json({
            success: true,
            data: userQuota ? userQuota.policies : [],
        });
    } catch (error) {
        console.error("Error fetching user quotas:", error);
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};
// Make sure both functions are exported
module.exports = {
    createInsuranceQuota,
    getUserQuotas,
};
