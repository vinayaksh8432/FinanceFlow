const LoanApplication = require("../model/loanApplication");
const { generateLoanId } = require("../utils/loanId");

const submitLoanApplication = async (req, res) => {
    try {
        console.log("Request body:", req.body);
        console.log("Request file:", req.file);

        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "Document file is required",
            });
        }

        // Parse applicationData
        let applicationData;
        try {
            applicationData = JSON.parse(req.body.applicationData);
        } catch (error) {
            console.error("Error parsing application data:", error);
            return res.status(400).json({
                success: false,
                message: "Invalid application data format",
            });
        }

        const {
            personalDetails,
            identityDetails,
            addressDetails,
            employmentInfo,
            loanDetails,
        } = applicationData;

        console.log("Application Data", applicationData);

        const loanId = await generateLoanId(loanDetails.loanType);

        console.log("Loan Details:", loanDetails);

        const newLoanApplication = new LoanApplication({
            userId: req.user._id,
            loanId,

            // Personal Details
            FirstName: personalDetails.firstName,
            LastName: personalDetails.lastName,
            Email: personalDetails.email,
            Phone: personalDetails.phone,
            DateofBirth: personalDetails.dateOfBirth,
            Gender: personalDetails.gender,
            MartialStatus: personalDetails.martialStatus,

            // Identity Details
            DocumentType: identityDetails.documentType,
            DocumentNumber: identityDetails.documentNumber,
            DocumentFile: {
                fileName: req.file.filename,
                fileType: req.file.mimetype,
                fileData: req.file.path,
            },

            // Address Details
            AddressLine1: addressDetails.addressLine1,
            AddressLine2: addressDetails.addressLine2 || "",
            State: addressDetails.selectedState,
            City: addressDetails.selectedCity,
            PostalCode: addressDetails.postalCode,
            StayedInCurrentAddress: addressDetails.addressDuration,
            ResidentialStatus: addressDetails.residentialStatus,

            // Employment Details
            Occupation: employmentInfo.occupation,
            EmploymentStatus: employmentInfo.employmentStatus,
            YearsOfExperience: {
                years: parseInt(employmentInfo.yearsExperience),
                months: parseInt(employmentInfo.monthsExperience),
            },
            GrossMonthlyIncome: parseFloat(
                employmentInfo.grossIncome.replace(/[₹,]/g, "")
            ),

            // Loan Details
            LoanType: loanDetails.loanType,
            DesiredLoanAmount: loanDetails.desiredLoanAmount,
            LoanTenure: loanDetails.loanTenure,
            monthlyEmi: loanDetails.monthlyEmi || 0,
            loanAmountWithInterest: loanDetails.loanAmountWithInterest || 0,
            totalLoanAmount: loanDetails.totalLoanAmount || 0,

            Status: "Pending",
            ApplicationDate: new Date(),
            LastModified: new Date(),
        });

        console.log("TotalAmount", loanDetails.totalLoanAmount);
        console.log("monthlyEmi", loanDetails.monthlyEmi);
        console.log(
            "loanAmountWithInterest",
            typeof loanDetails.loanAmountWithInterest
        );

        console.log("New Loan Application:", newLoanApplication);

        const savedApplication = await newLoanApplication.save();

        res.status(201).json({
            success: true,
            message: "Loan application submitted successfully",
            application: savedApplication,
        });
    } catch (error) {
        console.error("Submission Error:", error);
        res.status(500).json({
            success: false,
            message: "Error submitting loan application",
            error: error.message,
        });
    }
};

module.exports = {
    submitLoanApplication,
};
