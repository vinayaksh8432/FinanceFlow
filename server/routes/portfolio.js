const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const {
    addStock,
    getPortfolio,
    removeStock,
    updateStock,
} = require("../controllers/PortfolioController");
const authMiddleware = require("../middleware/authMiddleware");

router.use(authMiddleware);
router.post("/add-stock", addStock);
router.put("/update-stock/:id", updateStock);
router.delete("/remove-stock/:id", removeStock);
router.get("/", getPortfolio);

module.exports = router;
