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
                success: false,
                message: "Missing required sections in the application",
            });
        }

        const loanId = await generateLoanId(finalDetails.loanType);

        const newLoanApplication = new LoanApplication({
            userId: req.user._id, // Using the authenticated user's ID
            loanId,
            FirstName: personalDetails.firstName,
            MiddleName: personalDetails.middleName || "",
            LastName: personalDetails.lastName,
            Email: personalDetails.email,
            Phone: personalDetails.phone,
            DateofBirth: personalDetails.dateOfBirth,
            Gender: personalDetails.gender,
            MartialStatus: personalDetails.martialStatus,
            ResidentialStatus: personalDetails.residentialStatus,
            IdentityProof: identityDetails?.identityProof,
            ProofNumber: identityDetails?.proofNumber,
            AddressLine1: addressDetails.addressLine1,
            AddressLine2: addressDetails.addressLine2,
            State: addressDetails.selectedState,
            City: addressDetails.selectedCity,
            PostalCode: addressDetails.postalCode,
            StayedInCurrentAddress: addressDetails.addressDuration,
            Occupation: employmentInfo.occupation,
            YearsOfExperience: employmentInfo.experienceDuration,
            GrossMonthlyIncome: parseFloat(
                employmentInfo.grossIncome.replace(/[₹,]/g, "")
            ),
            MonthlyRent: parseFloat(employmentInfo.rent.replace(/[₹,]/g, "")),
            LoanType: finalDetails.loanType,
            DesiredLoanAmount: parseFloat(
                finalDetails.desiredLoanAmount.replace(/[₹,]/g, "")
            ),
            LoanTenure: parseInt(finalDetails.loanTenure),
            Comments: finalDetails.comments || "",
            Status: "Pending",
            ApplicationDate: new Date(),
            LastModified: new Date(),
        });

        const savedApplication = await newLoanApplication.save();
        res.status(201).json({
            success: true,
            message: "Loan application submitted successfully",
            application: savedApplication,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error submitting loan application",
            error: error.message,
        });
    }
};
