// controllers/loanApplicationController.js

const LoanApplication = require("../model/loanApplication");

exports.submitLoanApplication = async (req, res) => {
    try {
        const {
            desiredLoanAmount,
            annualIncome,
            selectedLoanType,
            selectedLoanTenure,
            firstName,
            lastName,
            email,
            phone,
            dob,
            martialStatus,
            addressLine1,
            addressLine2,
            selectedState,
            selectedCity,
            postalCode,
            addressDuration,
            occupation,
            yearsOfExperience,
            grossMonthlyIncome,
            monthlyRent,
            downPayment,
            comments,
        } = req.body;

        const newLoanApplication = new LoanApplication({
            DesiredLoanAmount: desiredLoanAmount,
            AnnualIncome: annualIncome,
            LoanType: selectedLoanType,
            LoanTenure: selectedLoanTenure,
            FirstName: firstName,
            LastName: lastName,
            email: email,
            phone: phone,
            DateofBirth: dob,
            MartialStatus: martialStatus,
            AddressLine1: addressLine1,
            AddressLine2: addressLine2,
            State: selectedState,
            City: selectedCity,
            PostalCode: postalCode,
            StayedInCurrentAddress: addressDuration,
            Occupation: occupation,
            YearsOfExperience: yearsOfExperience,
            GrossMonthlyIncome: grossMonthlyIncome,
            MonthlyRent: monthlyRent,
            DownPayment: downPayment,
            Comments: comments,
        });

        await newLoanApplication.save();
        res.status(201).json({
            message: "Loan application submitted successfully",
            application: newLoanApplication,
        });
    } catch (error) {
        console.error("Error submitting loan application:", error);
        res.status(500).json({
            message: "Error submitting loan application",
            error: error.message,
        });
    }
};
