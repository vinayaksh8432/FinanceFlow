const { CarInsurance } = require("./carInsurance");
const { HealthInsurance } = require("./healthInsurance");

// Combine all insurance data
const allInsurance = [...HealthInsurance, ...CarInsurance];

module.exports = { allInsurance };
