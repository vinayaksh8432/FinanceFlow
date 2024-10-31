// LoanApplicationController.js
const LoanApplication = require("../model/loanApplication");
const { generateLoanId } = require("../utils/loanId");

exports.submitLoanApplication = async (req, res) => {
    try {
        const {
            personalDetails,
            identityDetails,
            addressDetails,
            employmentInfo,
            finalDetails,
        } = req.body;

        if (
            !personalDetails ||
            !addressDetails ||
            !employmentInfo ||
            !finalDetails
        ) {
            return res.status(400).json({
                message: "Missing required sections in the application",
            });
        }

        const loanId = await generateLoanId(finalDetails.loanType); // generate loan ID

        const newLoanApplication = new LoanApplication({
            loanId,
            // Personal Details
            FirstName: personalDetails.firstName,
            MiddleName: personalDetails.middleName || "",
            LastName: personalDetails.lastName,
            Email: personalDetails.email,
            Phone: personalDetails.phone,
            DateofBirth: personalDetails.dateOfBirth,
            Gender: personalDetails.gender,
            MartialStatus: personalDetails.martialStatus,
            ResidentialStatus: personalDetails.residentialStatus,

            // Identity Details
            IdentityProof: identityDetails?.identityProof,
            ProofNumber: identityDetails?.proofNumber,

            // Address Details
            AddressLine1: addressDetails.addressLine1,
            AddressLine2: addressDetails.addressLine2,
            State: addressDetails.selectedState,
            City: addressDetails.selectedCity,
            PostalCode: addressDetails.postalCode,
            StayedInCurrentAddress: addressDetails.addressDuration,

            // Employment Info
            Occupation: employmentInfo.occupation,
            YearsOfExperience: employmentInfo.experienceDuration,
            GrossMonthlyIncome: parseFloat(
                employmentInfo.grossIncome.replace(/[₹,]/g, "")
            ),
            MonthlyRent: parseFloat(employmentInfo.rent.replace(/[₹,]/g, "")),

            // Loan Details
            LoanType: finalDetails.loanType,
            DesiredLoanAmount: parseFloat(
                finalDetails.desiredLoanAmount.replace(/[₹,]/g, "")
            ),
            LoanTenure: parseInt(finalDetails.loanTenure),
            Comments: finalDetails.comments || "",

            // Additional Details
            Status: "Pending",
            ApplicationDate: new Date(),
            LastModified: new Date(),
        });

        res.status(201).json({
            message: "Loan application submitted successfully",
            application: await newLoanApplication.save(),
        });
    } catch (error) {
        res.status(500).json({
            message: "Error submitting loan application",
            error: error.message,
            stack:
                process.env.NODE_ENV === "development"
                    ? error.stack
                    : undefined,
        });
    }
};
