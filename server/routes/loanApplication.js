// routes/loanApplicationRoutes.js

const express = require("express");
const router = express.Router();
const {
    submitLoanApplication,
} = require("../controllers/LoanApplicationController");

router.post("/submit", submitLoanApplication);

module.exports = router;
