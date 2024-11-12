const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const {
    addStock,
    getPortfolio,
} = require("../controllers/PortfolioController");
const authMiddleware = require("../middleware/authMiddleware");

router.use(authMiddleware);
router.post("/add-stock", addStock);
router.get("/", getPortfolio);

module.exports = router;
