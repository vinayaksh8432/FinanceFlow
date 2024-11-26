import React, {
    createContext,
    useState,
    useCallback,
    useMemo,
    useEffect,
} from "react";
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

    // Add debug logging for validation state
    useEffect(() => {
        console.log("Current Validation State:", currentValidation);
        console.log("Current Loan Application:", loanApplication);
    }, [currentValidation, loanApplication]);

    const validatePersonalDetails = useCallback((formData) => {
        const newErrors = {};

        if (!formData.FirstName?.trim())
            newErrors.FirstName = "First Name is required";
        if (!formData.LastName?.trim())
            newErrors.LastName = "Last Name is required";

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!formData.Email?.trim()) {
            newErrors.Email = "Email is required";
        } else if (!emailRegex.test(formData.Email)) {
            newErrors.Email = "Invalid email format";
        }

        const phoneRegex = /^[6-9]\d{9}$/;
        if (!formData.Phone?.trim()) {
            newErrors.Phone = "Phone number is required";
        } else if (!phoneRegex.test(formData.Phone)) {
            newErrors.Phone = "Invalid phone number";
        }

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

        if (!formData.Gender) newErrors.Gender = "Gender is required";
        if (!formData.MartialStatus)
            newErrors.MartialStatus = "Marital Status is required";

        return newErrors;
    }, []);

    const validateIdentityDetails = useCallback((formData) => {
        const newErrors = {};

        if (!formData.DocumentType) {
            newErrors.DocumentType = "Please select a document type";
        }

        if (!formData.DocumentNumber?.trim()) {
            newErrors.DocumentNumber = "Document number is required";
        }

        if (!formData.DocumentFile && !formData.DocumentPreview) {
            newErrors.DocumentFile = "Document file is required";
        }

        const documentTypes = {
            Passport: /^[A-Z]\d{7}$/,
            "Driving License": /^[A-Z]{2}\d{13}$/,
            "Voter ID": /^[A-Z]{3}\d{7}$/,
            AadharCard: /^\d{12}$/,
        };

        if (
            formData.DocumentType &&
            formData.DocumentNumber &&
            documentTypes[formData.DocumentType]
        ) {
            if (
                !documentTypes[formData.DocumentType].test(
                    formData.DocumentNumber
                )
            ) {
                newErrors.DocumentNumber = "Invalid document number format";
            }
        }

        return newErrors;
    }, []);

    const validateAddressDetails = useCallback((formData) => {
        const newErrors = {};

        if (!formData.residentialStatus)
            newErrors.residentialStatus = "Residential Status is required";
        if (!formData.addressLine1?.trim())
            newErrors.addressLine1 = "Address Line 1 is required";

        const postalCodeRegex = /^\d{6}$/;
        if (!formData.postalCode) {
            newErrors.postalCode = "Postal Code is required";
        } else if (!postalCodeRegex.test(formData.postalCode)) {
            newErrors.postalCode = "Invalid Postal Code";
        }

        if (!formData.selectedState)
            newErrors.selectedState = "State is required";
        if (!formData.selectedCity) newErrors.selectedCity = "City is required";

        if (!formData.addressDuration) {
            newErrors.addressDuration = "Address Duration is required";
        } else {
            const duration = parseInt(formData.addressDuration);
            if (isNaN(duration) || duration < 0 || duration > 50) {
                newErrors.addressDuration = "Invalid Address Duration";
            }
        }

        return newErrors;
    }, []);

    const validateEmployeeDetails = useCallback((formData) => {
        const newErrors = {};

        if (!formData.occupation)
            newErrors.occupation = "Organization Type is required";
        if (!formData.employmentStatus)
            newErrors.employmentStatus = "Employment Status is required";

        const grossIncomeStr = String(formData.grossIncome || "").replace(
            /[₹,\s]/g,
            ""
        );
        const grossIncome = parseInt(grossIncomeStr);

        if (!grossIncomeStr || isNaN(grossIncome) || grossIncome <= 0) {
            newErrors.grossIncome = "Valid Gross Monthly Income is required";
        } else if (grossIncome < 10000) {
            newErrors.grossIncome = "Minimum income should be ₹10,000";
        } else if (grossIncome > 200000) {
            newErrors.grossIncome = "Maximum income limit is ₹2,00,000";
        }

        const yearsExp = parseInt(formData.yearsExperience);
        const monthsExp = parseInt(formData.monthsExperience);

        if (isNaN(yearsExp) || yearsExp < 0 || yearsExp > 50) {
            newErrors.yearsExperience = "Invalid Years of Experience";
        }

        if (isNaN(monthsExp) || monthsExp < 0 || monthsExp > 11) {
            newErrors.monthsExperience = "Invalid Months of Experience";
        }

        return newErrors;
    }, []);

    const validateLoanAmount = useCallback((formData) => {
        const newErrors = {};

        if (!formData.loanType) newErrors.loanType = "Loan type is required";

        if (!formData.desiredLoanAmount) {
            newErrors.desiredLoanAmount = "Desired loan amount is required";
        } else {
            const numericValue = parseInt(
                String(formData.desiredLoanAmount).replace(/[₹,\s]/g, "")
            );

            if (numericValue < 100000) {
                newErrors.desiredLoanAmount =
                    "Minimum loan amount is ₹1,00,000";
            } else if (numericValue > 5000000) {
                newErrors.desiredLoanAmount =
                    "Maximum loan amount is ₹50,00,000";
            }
        }

        if (!formData.loanTenure) {
            newErrors.loanTenure = "Loan tenure is required";
        }

        return newErrors;
    }, []);

    const validateForm = useCallback(
        (formType, formData) => {
            let validationFunction;
            switch (formType) {
                case "personalDetails":
                    validationFunction = validatePersonalDetails;
                    break;
                case "identityDetails":
                    validationFunction = validateIdentityDetails;
                    break;
                case "addressDetails":
                    validationFunction = validateAddressDetails;
                    break;
                case "employeeDetails":
                    validationFunction = validateEmployeeDetails;
                    break;
                case "loanAmount":
                    validationFunction = validateLoanAmount;
                    break;
                default:
                    return false;
            }

            const newErrors = validationFunction(formData);
            setErrors(newErrors);

            const isValid = Object.keys(newErrors).length === 0;
            setCurrentValidation((prev) => {
                const updated = {
                    ...prev,
                    [formType]: isValid,
                };
                console.log(`Validation update for ${formType}:`, isValid);
                console.log("New validation state:", updated);
                return updated;
            });

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
        setLoanApplication((prev) => {
            const updated = { ...prev, ...newData };
            console.log("Updating loan application:", updated);
            return updated;
        });
    }, []);

    const submitApplication = useCallback(async () => {
        try {
            const formData = new FormData();
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
                    desiredLoanAmount: String(
                        loanApplication.desiredLoanAmount || ""
                    )?.replace(/[₹,\s]/g, ""),
                    loanTenure: loanApplication.loanTenure,
                    monthlyEmi: loanApplication.monthlyEmi,
                    loanAmountWithInterest:
                        loanApplication.loanAmountWithInterest,
                    totalLoanAmount: loanApplication.totalLoanAmount,
                },
            };

            formData.append("applicationData", JSON.stringify(applicationData));

            if (loanApplication.DocumentFile) {
                formData.append("document", loanApplication.DocumentFile);
            }

            const response = await submitLoanApplication(formData);
            if (!response.success) {
                throw new Error(
                    response.message || "Failed to submit application"
                );
            }

            return response;
        } catch (error) {
            console.error("Application submission error:", error);
            throw error;
        }
    }, [loanApplication]);

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

export default LoanApplicationProvider;
