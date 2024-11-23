const mongoose = require("mongoose");

const loanApplicationSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    loanId: {
        type: String,
        required: true,
        unique: true,
    },
    // Personal Details
    FirstName: { type: String, required: true },
    MiddleName: { type: String },
    LastName: { type: String, required: true },
    Email: { type: String, required: true },
    Phone: { type: String, required: true },
    DateofBirth: { type: Date, required: true },
    Gender: { type: String, required: true },
    MartialStatus: { type: String, required: true },

    // Identity Details
    DocumentType: { type: String, required: true },
    DocumentNumber: { type: String, required: true },
    DocumentFile: {
        type: {
            fileName: String,
            fileType: String,
            fileData: String,
        },
        required: true,
    },

    // Address Details
    AddressLine1: { type: String, required: true },
    AddressLine2: { type: String },
    State: { type: String, required: true },
    City: { type: String, required: true },
    PostalCode: { type: String, required: true },
    StayedInCurrentAddress: { type: String, required: true },
    ResidentialStatus: { type: String, required: true },

    // Employment Info
    Occupation: { type: String, required: true },
    EmploymentStatus: { type: String, required: true },
    YearsOfExperience: {
        years: { type: Number, required: true },
        months: { type: Number, required: true },
    },
    GrossMonthlyIncome: { type: Number, required: true },

    // Loan Details
    LoanType: { type: String, required: true },
    DesiredLoanAmount: { type: Number, required: true },
    LoanTenure: { type: Number, required: true },
    monthlyEmi: { type: Number, required: true },
    loanAmountWithInterest: { type: Number, required: true },
    totalLoanAmount: { type: Number, required: true },

    // Status and Dates
    Status: {
        type: String,
        enum: ["Pending", "Approved", "Rejected", "Under Review"],
        default: "Pending",
    },
    ApplicationDate: {
        type: Date,
        default: Date.now,
    },
    LastModified: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model("LoanApplication", loanApplicationSchema);
