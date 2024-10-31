import {
    ArrowCircleLeft,
    ArrowCircleRight,
    ArrowLeft,
    CheckCircle,
    User,
} from "@phosphor-icons/react";
import React, { useState, useEffect } from "react";
import { TailSpin, ThreeDots } from "react-loader-spinner";
import { useNavigate } from "react-router-dom";
import PersonalDetails from "./components/personalDetails";
import IdentityDetails from "./components/identityDetails";
import AddressDetails from "./components/addressDetails";
import EmpInfo from "./components/epmInfo";
import Final from "./components/final";
import { FaRegAddressCard } from "react-icons/fa6";
import { MdOutlineHomeWork } from "react-icons/md";
import { PiBuildingOffice } from "react-icons/pi";
import { BsFileEarmarkText } from "react-icons/bs";
import { submitLoanApplication } from "../../utils/api";
import Alert from "@mui/material/Alert";
import { leapfrog } from "ldrs";
import { ring2 } from "ldrs";

leapfrog.register();
ring2.register();

export default function ApplyLoan() {
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [submitStatus, setSubmitStatus] = useState(null);
    const [formData, setFormData] = useState({
        personalDetails: {
            isComplete: false,
            data: {
                firstName: "",
                middleName: "",
                lastName: "",
                email: "",
                phone: "",
                dateOfBirth: "",
                gender: "",
                martialStatus: "",
                residentialStatus: "",
            },
            requiredFields: [
                "firstName",
                "lastName",
                "email",
                "phone",
                "dateOfBirth",
                "gender",
                "martialStatus",
                "residentialStatus",
            ],
        },
        identityDetails: {
            isComplete: false,
            data: {},
            requiredFields: ["identityProof", "proofNumber"],
        },
        addressDetails: {
            isComplete: false,
            data: {},
            requiredFields: [],
        },
        employmentInfo: {
            isComplete: false,
            data: {},
            requiredFields: [],
        },
        finalDetails: {
            isComplete: false,
            data: {},
            requiredFields: [
                "loanType",
                "desiredLoanAmount",
                "loanTenure",
                "consent1",
                "consent2",
            ],
        },
    });

    const steps = [
        {
            id: "personalDetails",
            icon: <User />,
            title: "Personal Details",
            component: PersonalDetails,
        },
        {
            id: "identityDetails",
            icon: <FaRegAddressCard />,
            title: "Identity Details",
            component: IdentityDetails,
        },
        {
            id: "addressDetails",
            icon: <MdOutlineHomeWork />,
            title: "Address Details",
            component: AddressDetails,
        },
        {
            id: "employmentInfo",
            icon: <PiBuildingOffice />,
            title: "Employee Information",
            component: EmpInfo,
        },
        {
            id: "finalDetails",
            icon: <BsFileEarmarkText />,
            title: "Loan Amount",
            component: Final,
        },
    ];

    const isStepComplete = (stepId, stepData) => {
        if (stepId === "addressDetails") {
            const requiredFields = [
                "addressLine1",
                "addressLine2",
                "postalCode",
                "selectedState",
                "selectedCity",
                "addressDuration",
            ];
            return requiredFields.every(
                (field) =>
                    stepData[field] && stepData[field].toString().trim() !== ""
            );
        } else if (stepId === "employmentInfo") {
            const requiredFields = [
                "occupation",
                "experienceDuration",
                "grossIncome",
                "rent",
            ];
            return requiredFields.every(
                (field) =>
                    stepData[field] && stepData[field].toString().trim() !== ""
            );
        }

        const step = formData[stepId];
        if (!step.requiredFields.length) return true;

        return step.requiredFields.every((field) => {
            const value = stepData[field];
            return value !== null && value !== undefined && value !== "";
        });
    };

    const handleNext = async () => {
        if (
            currentStep < steps.length - 1 &&
            formData[steps[currentStep].id].isComplete
        ) {
            setIsLoading(true);
            await new Promise((resolve) => setTimeout(resolve, 500));
            setCurrentStep(currentStep + 1);
            setIsLoading(false);
        }
    };

    const handlePrevious = async () => {
        if (currentStep > 0) {
            setIsLoading(true);
            await new Promise((resolve) => setTimeout(resolve, 500));
            setCurrentStep(currentStep - 1);
            setIsLoading(false);
        }
    };

    const isStepAccessible = (stepIndex) => {
        if (stepIndex === 0) return true;

        if (stepIndex === currentStep) return true;

        if (formData[steps[stepIndex].id].isComplete) return true;

        if (stepIndex === currentStep + 1) {
            return steps
                .slice(0, stepIndex)
                .every((step) => formData[step.id].isComplete);
        }

        if (stepIndex > currentStep + 1) {
            return steps
                .slice(0, stepIndex)
                .every((step) => formData[step.id].isComplete);
        }

        return false;
        // return true;
    };

    const handleStepClick = async (index) => {
        if (isStepAccessible(index)) {
            setIsLoading(true);
            await new Promise((resolve) => setTimeout(resolve, 500));
            setCurrentStep(index);
            setIsLoading(false);
        }
    };

    const isCurrentStepValid = () => {
        const currentStepId = steps[currentStep].id;
        return formData[currentStepId].isComplete;
    };

    const handleFormComplete = (stepId, stepData) => {
        const isComplete = isStepComplete(stepId, stepData);

        setFormData((prev) => ({
            ...prev,
            [stepId]: {
                ...prev[stepId],
                isComplete: isComplete,
                data: stepData,
            },
        }));
    };

    const handleConfirmSubmit = async () => {
        setIsLoading(true);
        try {
            // Prepare the complete form data
            const completeFormData = {
                personalDetails: formData.personalDetails.data,
                identityDetails: formData.identityDetails.data,
                addressDetails: formData.addressDetails.data,
                employmentInfo: formData.employmentInfo.data,
                finalDetails: formData.finalDetails.data,
            };

            const response = await submitLoanApplication(completeFormData);

            if (response && response.message) {
                setSubmitStatus("success");
                setShowConfirmDialog(false);
                setTimeout(() => {
                    navigate("/dashboard/loan/loanstatus");
                }, 5000); // Redirect to dashboard after 5 seconds
            } else {
                throw new Error("Invalid response from server");
            }
        } catch (error) {
            setSubmitStatus("error");
            setErrorMessage(
                error.message ||
                    "Failed to submit loan application. Please try again."
            );
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = (e) => {
        if (e) e.preventDefault();
        if (currentStep === steps.length - 1) {
            const allStepsComplete = steps.every(
                (step) => formData[step.id].isComplete
            );
            if (allStepsComplete) {
                setShowConfirmDialog(true);
            } else {
                setErrorMessage(
                    "Please complete all required fields in all steps"
                );
                setTimeout(() => setErrorMessage(""), 5000);
            }
        }
    };

    useEffect(() => {
        const currentStepId = steps[currentStep].id;
        const currentStepData = formData[currentStepId].data;

        const isComplete = isStepComplete(currentStepId, currentStepData);

        if (isComplete !== formData[currentStepId].isComplete) {
            setFormData((prev) => ({
                ...prev,
                [currentStepId]: {
                    ...prev[currentStepId],
                    isComplete: isComplete,
                },
            }));
        }
    }, [currentStep, formData]);

    const getButtonText = () => {
        if (currentStep === steps.length - 1) return "Submit";
        return "Next";
    };

    const getButtonIcon = () => {
        if (currentStep === steps.length - 1) return <CheckCircle size={18} />;
        return <ArrowCircleRight size={18} />;
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-300 h-full flex flex-col overflow-hidden">
            <label className="p-4 py-3 text-xl bg-slate-200 shadow-inner flex items-center gap-2">
                <ArrowLeft
                    className="text-3xl cursor-pointer hover:bg-gray-300 hover:shadow-inner p-1.5 transition-all rounded-full"
                    onClick={() => window.history.back()}
                />
                <h1>Apply for a new Loan</h1>
            </label>

            <div className="flex flex-1 overflow-y-auto">
                <div className="w-max border-r bg-gray-50">
                    <div className="flex flex-col p-4">
                        {steps.map((step, index) => {
                            const isActive = currentStep === index;
                            const isComplete = formData[step.id].isComplete;
                            const canAccess = isStepAccessible(index);

                            return (
                                <div
                                    key={step.id}
                                    className="flex-1 flex flex-col"
                                >
                                    <button
                                        onClick={() => handleStepClick(index)}
                                        disabled={!canAccess || isLoading}
                                        className={`flex items-center p-3 gap-3 rounded-lg text-left
                                        transition-all duration-200
                                        ${
                                            isActive
                                                ? "bg-indigo-50"
                                                : "bg-transparent"
                                        }
                                        ${
                                            isComplete
                                                ? "text-green-600"
                                                : isActive
                                                ? "text-blue-600"
                                                : "text-gray-700"
                                        }
                                        ${
                                            (!canAccess || isLoading) &&
                                            "opacity-50 cursor-not-allowed"
                                        }
                                        ${
                                            canAccess &&
                                            !isLoading &&
                                            "hover:bg-gray-100 cursor-pointer"
                                        }`}
                                    >
                                        <div
                                            className={`p-2 rounded-full flex items-center justify-center
                                            ${
                                                isComplete
                                                    ? "bg-green-100 text-green-600"
                                                    : isActive
                                                    ? "bg-blue-100 text-blue-600"
                                                    : "bg-gray-100 text-gray-700"
                                            }`}
                                        >
                                            {step.icon}
                                        </div>
                                        <span className="text-sm">
                                            {step.title}
                                        </span>
                                    </button>
                                    {index < steps.length - 1 && (
                                        <hr className="border-t border-dashed border-gray-300 my-2" />
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        handleSubmit();
                    }}
                    className="flex-1 py-4 px-6 justify-between flex flex-col relative"
                >
                    {isLoading ? (
                        <div className="m-auto flex">
                            <div className="m-auto flex flex-col gap-4 items-center">
                                <h1>please wait a moment</h1>
                                <l-leapfrog
                                    size="40"
                                    speed="3.0"
                                    color="black"
                                />
                            </div>
                        </div>
                    ) : (
                        <>
                            {React.createElement(steps[currentStep].component, {
                                formData: formData[steps[currentStep].id].data,
                                onComplete: (data) =>
                                    handleFormComplete(
                                        steps[currentStep].id,
                                        data
                                    ),
                            })}
                            <div className="flex justify-between text-sm">
                                <button
                                    type="button"
                                    onClick={handlePrevious}
                                    disabled={currentStep === 0}
                                    className={`p-2 border border-gray-300 rounded-lg transition-all duration-200 flex gap-1 items-center
                                        ${
                                            currentStep === 0
                                                ? "opacity-50 cursor-not-allowed"
                                                : "hover:bg-gray-50 cursor-pointer"
                                        }`}
                                >
                                    <ArrowCircleLeft size={18} />
                                    Previous
                                </button>

                                <button
                                    onClick={
                                        currentStep === steps.length - 1
                                            ? handleSubmit
                                            : handleNext
                                    }
                                    type={
                                        currentStep === steps.length - 1
                                            ? "submit"
                                            : "button"
                                    }
                                    disabled={!isCurrentStepValid()}
                                    className={`p-2 rounded-lg bg-blue-600 text-white transition-all duration-200 flex gap-1 items-center
                                        ${
                                            !isCurrentStepValid()
                                                ? "opacity-50 cursor-not-allowed"
                                                : "hover:bg-blue-700 cursor-pointer"
                                        }`}
                                >
                                    {getButtonText()} {getButtonIcon()}
                                </button>
                            </div>
                        </>
                    )}
                    {errorMessage && (
                        <Alert
                            severity="error"
                            className="absolute bottom-20 left-6 right-6"
                            onClose={() => setErrorMessage("")}
                        >
                            {errorMessage}
                        </Alert>
                    )}

                    {submitStatus === "success" && (
                        <Alert
                            severity="success"
                            className="absolute bottom-20 left-6 right-6 flex items-center"
                        >
                            <div className="flex items-center gap-2">
                                Loan application submitted successfully!
                                Redirecting
                                <l-ring-2
                                    size="18"
                                    stroke="1"
                                    stroke-length="0.25"
                                    bg-opacity="0.1"
                                    speed="0.8"
                                    color="black"
                                />
                            </div>
                        </Alert>
                    )}

                    {showConfirmDialog && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                            <div className="bg-white rounded-lg shadow-lg max-w-md overflow-hidden">
                                <div className="p-4 space-y-2">
                                    <h1 className="text-xl font-semibold">
                                        Confirm Submission
                                    </h1>
                                    <p>
                                        Are you sure you want to submit your
                                        loan application? Please verify all the
                                        information before proceeding.
                                    </p>
                                </div>
                                <hr className="border border-gray-300" />
                                <div className="p-2 flex justify-end gap-4 text-sm bg-gray-100">
                                    <button
                                        onClick={() =>
                                            setShowConfirmDialog(false)
                                        }
                                        className="bg-white px-4 py-2 border border-gray-300 rounded-lg hover:bg-slate-200"
                                    >
                                        Verify Again
                                    </button>
                                    <button
                                        onClick={handleConfirmSubmit}
                                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                    >
                                        Confirm & Submit
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
}
