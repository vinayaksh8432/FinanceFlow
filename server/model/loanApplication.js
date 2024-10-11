const mongoose = require("mongoose");

const LoanApplicationSchema = new mongoose.Schema(
    {
        DesiredLoanAmount: { type: Number },
        AnnualIncome: { type: Number },
        LoanType: { type: String },
        LoanTenure: { type: String },
        FirstName: { type: String },
        MiddleName: { type: String },
        LastName: { type: String },
        email: { type: String },
        phone: { type: Number },
        DateofBirth: { type: Date },
        MartialStatus: { type: String },
        AddressLine1: { type: String },
        AddressLine2: { type: String },
        State: { type: String },
        City: { type: String },
        PostalCode: { type: Number },
        StayedInCurrentAddress: { type: String },
        Occupation: { type: String },
        YearsOfExperience: { type: String },
        GrossMonthlyIncome: { type: Number },
        MonthlyRent: { type: Number },
        DownPayment: { type: Number },
        Comments: { type: String },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("LoanApplications", LoanApplicationSchema);
