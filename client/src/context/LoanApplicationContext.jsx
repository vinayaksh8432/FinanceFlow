import React, { createContext, useState, useCallback, useMemo } from "react";
import { submitLoanApplication } from "@/utils/api";

export const LoanApplicationContext = createContext();

export const LoanApplicationProvider = ({ children }) => {
    const [loanApplication, setLoanApplication] = useState({});
    const [errors, setErrors] = useState({});
    const [currentValidation, setCurrentValidation] = useState({
        personalDetails: false,
        identityDetails: false,
        addressDetails: false,
        employeeDetails: false,
        loanAmount: false,
    });

    const validatePersonalDetails = useCallback((formData) => {
        const newErrors = {};

        // First Name Validation
        if (!formData.FirstName || formData.FirstName.trim() === "") {
            newErrors.FirstName = "First Name is required";
        }

        // Last Name Validation
        if (!formData.LastName || formData.LastName.trim() === "") {
            newErrors.LastName = "Last Name is required";
        }

        // Email Validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!formData.Email || formData.Email.trim() === "") {
            newErrors.Email = "Email is required";
        } else if (!emailRegex.test(formData.Email)) {
            newErrors.Email = "Invalid email format";
        }

        // Phone Validation
        const phoneRegex = /^[6-9]\d{9}$/;
        if (!formData.Phone || formData.Phone.trim() === "") {
            newErrors.Phone = "Phone number is required";
        } else if (!phoneRegex.test(formData.Phone)) {
            newErrors.Phone = "Invalid phone number";
        }

        // Date of Birth Validation
        if (!formData.DateofBirth) {
            newErrors.DateofBirth = "Date of Birth is required";
        } else {
            const dob = new Date(formData.DateofBirth);
            const minAge = new Date();
            minAge.setFullYear(minAge.getFullYear() - 21);

            if (dob > minAge) {
                newErrors.DateofBirth = "You must be at least 21 years old";
            }
        }

        // Gender Validation
        if (!formData.Gender) {
            newErrors.Gender = "Gender is required";
        }

        // Marital Status Validation
        if (!formData.MartialStatus) {
            newErrors.MartialStatus = "Marital Status is required";
        }

        return newErrors;
    }, []);

    const validateIdentityDetails = useCallback((formData) => {
        const newErrors = {};

        // Document Type Validation
        if (!formData.DocumentType) {
            newErrors.DocumentType = "Please select a document type";
        }

        // Document Number Validation
        if (!formData.DocumentNumber || formData.DocumentNumber.trim() === "") {
            newErrors.DocumentNumber = "Document number is required";
        }

        // Document File Validation - Updated to check for both File object and preview
        if (!formData.DocumentFile && !formData.DocumentPreview) {
            newErrors.DocumentFile = "Document file is required";
        }

        // Additional specific validations based on document type
        const documentTypes = {
            Passport: /^[A-Z]\d{7}$/,
            "Driving License": /^[A-Z]{2}\d{13}$/,
            "Voter ID": /^[A-Z]{3}\d{7}$/,
            AadharCard: /^\d{12}$/,
        };

        if (formData.DocumentType && formData.DocumentNumber) {
            const regex = documentTypes[formData.DocumentType];
            if (regex && !regex.test(formData.DocumentNumber)) {
                newErrors.DocumentNumber = "Invalid document number format";
            }
        }

        return newErrors;
    }, []);

    const validateAddressDetails = useCallback((formData) => {
        const newErrors = {};

        // Residential Status Validation
        if (!formData.residentialStatus) {
            newErrors.residentialStatus = "Residential Status is required";
        }

        // Address Line 1 Validation
        if (!formData.addressLine1 || formData.addressLine1.trim() === "") {
            newErrors.addressLine1 = "Address Line 1 is required";
        }

        // Postal Code Validation
        const postalCodeRegex = /^\d{6}$/;
        if (!formData.postalCode) {
            newErrors.postalCode = "Postal Code is required";
        } else if (!postalCodeRegex.test(formData.postalCode)) {
            newErrors.postalCode = "Invalid Postal Code";
        }

        // State Validation
        if (!formData.selectedState) {
            newErrors.selectedState = "State is required";
        }

        // City Validation
        if (!formData.selectedCity) {
            newErrors.selectedCity = "City is required";
        }

        // Address Duration Validation
        if (!formData.addressDuration) {
            newErrors.addressDuration = "Address Duration is required";
        } else {
            const duration = parseInt(formData.addressDuration);
            if (isNaN(duration) || duration < 0 || duration > 50) {
                newErrors.addressDuration = "Invalid Address Duration";
            }
        }

        // Optional: Rent validation for rented properties
        if (
            formData.residentialStatus === "Rented" &&
            (!formData.rent || parseFloat(formData.rent) <= 0)
        ) {
            newErrors.rent = "Rent amount is required for rented properties";
        }

        return newErrors;
    }, []);

    const validateEmployeeDetails = useCallback((formData) => {
        const newErrors = {};

        // Occupation Validation
        if (!formData.occupation) {
            newErrors.occupation = "Organization Type is required";
        }

        // Employment Status Validation
        if (!formData.employmentStatus) {
            newErrors.employmentStatus = "Employment Status is required";
        }

        // Gross Income Validation
        const grossIncome = parseFloat(formData.grossIncome);
        if (!formData.grossIncome || isNaN(grossIncome) || grossIncome <= 0) {
            newErrors.grossIncome = "Valid Gross Monthly Income is required";
        } else if (grossIncome < 10000 || grossIncome > 9999999) {
            newErrors.grossIncome =
                "Income should be between ₹10,000 and ₹99,99,999";
        }

        // Years of Experience Validation
        const yearsExperience = parseInt(formData.yearsExperience);
        if (!formData.yearsExperience || isNaN(yearsExperience)) {
            newErrors.yearsExperience = "Years of Experience is required";
        } else if (yearsExperience < 0 || yearsExperience > 50) {
            newErrors.yearsExperience = "Invalid Years of Experience";
        }

        // Months of Experience Validation
        const monthsExperience = parseInt(formData.monthsExperience);
        if (!formData.monthsExperience || isNaN(monthsExperience)) {
            newErrors.monthsExperience = "Months of Experience is required";
        } else if (monthsExperience < 0 || monthsExperience > 12) {
            newErrors.monthsExperience = "Invalid Months of Experience";
        }

        // Additional contextual validations
        if (formData.occupation === "Employed" && !formData.employmentStatus) {
            newErrors.employmentStatus =
                "Employment Status is required for Employed candidates";
        }

        return newErrors;
    }, []);

    const validateLoanAmount = useCallback((formData) => {
        const newErrors = {};

        // Loan Type Validation
        if (!formData.loanType) {
            newErrors.loanType = "Loan type is required";
        }

        // Desired Loan Amount Validation
        if (!formData.desiredLoanAmount) {
            newErrors.desiredLoanAmount = "Desired loan amount is required";
        } else {
            // Remove currency formatting and convert to number
            const numericValue = parseFloat(
                String(formData.desiredLoanAmount).replace(/[₹,]/g, "")
            );

            // Minimum loan amount check
            if (numericValue < 100000) {
                newErrors.desiredLoanAmount =
                    "Minimum loan amount is ₹1,00,000";
            }

            // Maximum loan amount check (you might want to dynamically set this based on loan type or income)
            if (numericValue > 10000000) {
                newErrors.desiredLoanAmount =
                    "Maximum loan amount is ₹1,00,00,000";
            }
        }

        // Loan Tenure Validation
        const allowedTenures = ["12", "24", "36", "48", "60", "72", "84", "96"];
        if (!formData.loanTenure) {
            newErrors.loanTenure = "Loan tenure is required";
        } else if (!allowedTenures.includes(formData.loanTenure)) {
            newErrors.loanTenure = "Invalid loan tenure selected";
        }

        return newErrors;
    }, []);

    const validateForm = useCallback(
        (formType, formData) => {
            const newErrors =
                formType === "personalDetails"
                    ? validatePersonalDetails(formData)
                    : formType === "identityDetails"
                    ? validateIdentityDetails(formData)
                    : formType === "addressDetails"
                    ? validateAddressDetails(formData)
                    : formType === "employeeDetails"
                    ? validateEmployeeDetails(formData)
                    : formType === "loanAmount"
                    ? validateLoanAmount(formData)
                    : {};

            setErrors(newErrors);

            const isValid = Object.keys(newErrors).length === 0;
            setCurrentValidation((prev) => ({
                ...prev,
                [formType]: isValid,
            }));

            return isValid;
        },
        [
            validatePersonalDetails,
            validateIdentityDetails,
            validateAddressDetails,
            validateEmployeeDetails,
            validateLoanAmount,
        ]
    );

    const updateLoanApplication = useCallback((newData) => {
        console.log("Updating Loan Application with:", newData);
        setLoanApplication((prev) => {
            const updated = { ...prev, ...newData };
            console.log("Updated Loan Application:", updated);
            return updated;
        });
    }, []);

    const parseNumericValue = useCallback((value) => {
        if (typeof value === "number") return value;
        if (!value) return 0;
        // Remove currency symbol, commas and convert to number
        return parseFloat(String(value).replace(/[₹,]/g, "")) || 0;
    }, []);

    const submitApplication = useCallback(async () => {
        try {
            // Create a FormData instance
            const formDataToSubmit = new FormData();

            // Ensure numeric values are properly formatted
            const desiredLoanAmount = loanApplication.desiredLoanAmount;
            const monthlyEmi = loanApplication.monthlyEmi;
            const loanAmountWithInterest =
                loanApplication.loanAmountWithInterest;
            const totalLoanAmount = loanApplication.totalLoanAmount;

            // Validate required numeric fields before proceeding
            if (desiredLoanAmount <= 0) {
                throw new Error("Invalid desired loan amount");
            }
            if (monthlyEmi <= 0) {
                throw new Error("Invalid monthly EMI amount");
            }
            if (totalLoanAmount <= 0) {
                throw new Error("Invalid total loan amount");
            }
            if (loanAmountWithInterest <= 0) {
                throw new Error("Invalid loan amount with interest");
            }

            // Convert the loan application data to a structure suitable for API
            const applicationData = {
                personalDetails: {
                    firstName: loanApplication.FirstName,
                    lastName: loanApplication.LastName,
                    email: loanApplication.Email,
                    phone: loanApplication.Phone,
                    dateOfBirth: loanApplication.DateofBirth,
                    gender: loanApplication.Gender,
                    martialStatus: loanApplication.MartialStatus,
                },
                identityDetails: {
                    documentType: loanApplication.DocumentType,
                    documentNumber: loanApplication.DocumentNumber,
                },
                addressDetails: {
                    addressLine1: loanApplication.addressLine1,
                    addressLine2: loanApplication.addressLine2,
                    selectedState: loanApplication.selectedState,
                    selectedCity: loanApplication.selectedCity,
                    postalCode: loanApplication.postalCode,
                    addressDuration: loanApplication.addressDuration,
                    residentialStatus: loanApplication.residentialStatus,
                },
                employmentInfo: {
                    occupation: loanApplication.occupation,
                    employmentStatus: loanApplication.employmentStatus,
                    grossIncome: loanApplication.grossIncome,
                    yearsExperience: loanApplication.yearsExperience,
                    monthsExperience: loanApplication.monthsExperience,
                },
                loanDetails: {
                    loanType: loanApplication.loanType,
                    desiredLoanAmount: desiredLoanAmount,
                    loanTenure: loanApplication.loanTenure,
                    monthlyEmi: monthlyEmi,
                    loanAmountWithInterest: loanAmountWithInterest,
                    totalLoanAmount: totalLoanAmount,
                },
            };

            console.log("Submitting application data:", applicationData); // Debug log

            // Append the JSON data
            formDataToSubmit.append(
                "applicationData",
                JSON.stringify(applicationData)
            );

            // Handle document file
            let documentFile;
            if (loanApplication.DocumentFile instanceof File) {
                documentFile = loanApplication.DocumentFile;
            } else if (loanApplication.DocumentPreview) {
                try {
                    const response = await fetch(
                        loanApplication.DocumentPreview
                    );
                    const blob = await response.blob();
                    documentFile = new File(
                        [blob],
                        loanApplication.DocumentFileName || "document.pdf",
                        { type: blob.type }
                    );
                } catch (error) {
                    console.error("Error processing document:", error);
                    throw new Error("Failed to process document file");
                }
            }

            if (!documentFile) {
                throw new Error("Document file is required");
            }

            // Append the file with the field name expected by multer
            formDataToSubmit.append("document", documentFile);

            // Submit the form data using the API utility
            const response = await submitLoanApplication(formDataToSubmit);

            if (!response.success) {
                throw new Error(
                    response.message || "Failed to submit application"
                );
            }

            return response;
        } catch (error) {
            console.error("Application submission error:", error);
            throw error instanceof Error
                ? error
                : new Error("Failed to submit application");
        }
    }, [loanApplication, parseNumericValue]);

    const contextValue = useMemo(
        () => ({
            loanApplication,
            updateLoanApplication,
            validateForm,
            submitApplication,
            errors,
            currentValidation,
        }),
        [
            loanApplication,
            updateLoanApplication,
            validateForm,
            submitApplication,
            errors,
            currentValidation,
        ]
    );

    return (
        <LoanApplicationContext.Provider value={contextValue}>
            {children}
        </LoanApplicationContext.Provider>
    );
};
