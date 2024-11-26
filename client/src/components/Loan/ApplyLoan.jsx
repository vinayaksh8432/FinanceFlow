import {
    ArrowCircleLeft,
    ArrowCircleRight,
    CheckCircle,
    User,
    WarningCircle,
    XCircle,
} from "@phosphor-icons/react";
import React, { useState, useContext } from "react";
import { FaRegAddressCard } from "react-icons/fa6";
import { MdOutlineHomeWork } from "react-icons/md";
import { PiBuildingOffice } from "react-icons/pi";
import { BsFileEarmarkText } from "react-icons/bs";
import PersonalDetails from "./components/PersonalDetails";
import IdentityDetails from "./components/IdentityDetails";
import AddressDetails from "./components/AddressDetails";
import EmployeeDetails from "./components/EmployeeDetails";
import LoanAmount from "./components/LoanAmount";
import {
    LoanApplicationProvider,
    LoanApplicationContext,
} from "@/context/LoanApplicationContext";
import { tailspin } from "ldrs";
import { useNotifications } from "@/context/notification";
import { useNavigate } from "react-router-dom";

tailspin.register();

const sidebar = [
    {
        icon: <User />,
        title: "Personal Details",
        component: PersonalDetails,
        validationKey: "personalDetails",
    },
    {
        icon: <FaRegAddressCard />,
        title: "Identity Details",
        component: IdentityDetails,
        validationKey: "identityDetails",
    },
    {
        icon: <MdOutlineHomeWork />,
        title: "Address Details",
        component: AddressDetails,
        validationKey: "addressDetails",
    },
    {
        icon: <PiBuildingOffice />,
        title: "Employee Information",
        component: EmployeeDetails,
        validationKey: "employeeDetails",
    },
    {
        icon: <BsFileEarmarkText />,
        title: "Loan Amount",
        component: LoanAmount,
        validationKey: "loanAmount",
    },
];

function ApplyLoanContent() {
    const [selectedComponent, setSelectedComponent] = useState(0);
    const [componentValidation, setComponentValidation] = useState(
        new Array(sidebar.length).fill(false)
    );
    const {
        currentValidation = {},
        loanApplication, // Corrected from loanApplicationData
        submitApplication,
    } = useContext(LoanApplicationContext) || {};
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { addNotification } = useNotifications();
    const navigate = useNavigate();

    const handleSubmit = async () => {
        try {
            showConfirm(false);
            setIsSubmitting(true);
            const response = await submitApplication();
            alert("Loan application submitted successfully!");
            addNotification({
                message: `Your application has been submitted successfully`,
                type: "quote",
                link: "/dashboard/loan/loanstatus",
            });
            navigate("/dashboard/loan/loanstatus");
        } catch (error) {
            console.error("Submission Error:", error);
            alert(error.message || "Failed to submit loan application");
            addNotification({
                message: `Failed to submit application ${error.message}`,
                type: "error",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleValidation = (index, isValid) => {
        const newValidation = [...componentValidation];
        newValidation[index] = isValid;
        setComponentValidation(newValidation);
    };

    const handleNext = () => {
        if (
            componentValidation[selectedComponent] &&
            selectedComponent < sidebar.length - 1
        ) {
            setSelectedComponent(selectedComponent + 1);
        }
    };

    const handlePrevious = () => {
        if (selectedComponent > 0) {
            setSelectedComponent(selectedComponent - 1);
        }
    };

    const [confirm, setConfirm] = useState(false);

    const showConfirm = () => {
        setConfirm(!confirm);
    };

    const CurrentComponent = sidebar[selectedComponent].component;
    // const CurrentComponent = sidebar[4].component;

    return (
        <div className="flex h-full rounded-lg border border-gray-300 overflow-hidden shadow-sm">
            <div className="bg-gray-50 h-full p-4 border-r border-gray-300">
                {sidebar.map((item, index) => (
                    <div key={index} className="flex-1 flex flex-col">
                        <button
                            className={`flex items-center p-3 gap-3 rounded-lg transition-all duration-300 
                                ${
                                    selectedComponent === index
                                        ? "bg-blue-100 text-blue-600"
                                        : "hover:bg-gray-100"
                                }
                                ${
                                    index === selectedComponent ||
                                    componentValidation[index] ||
                                    (index < selectedComponent &&
                                        currentValidation[
                                            sidebar[index].validationKey
                                        ])
                                        ? ""
                                        : "opacity-50 cursor-not-allowed"
                                }`}
                            onClick={() => {
                                if (
                                    index === selectedComponent ||
                                    componentValidation[index] ||
                                    (index < selectedComponent &&
                                        currentValidation[
                                            sidebar[index].validationKey
                                        ])
                                ) {
                                    setSelectedComponent(index);
                                }
                            }}
                            disabled={
                                index > selectedComponent &&
                                !componentValidation[index]
                            }
                        >
                            <span
                                className={`p-2 rounded-full flex items-center justify-center
                                    ${
                                        currentValidation[
                                            sidebar[index].validationKey
                                        ]
                                            ? "bg-green-100 text-green-600"
                                            : selectedComponent === index
                                            ? "bg-blue-200 text-blue-600"
                                            : "bg-gray-100 text-gray-700"
                                    }`}
                            >
                                {item.icon}
                            </span>
                            <span
                                className={`text-sm ${
                                    currentValidation[
                                        sidebar[index].validationKey
                                    ]
                                        ? "text-green-600"
                                        : "text-gray-700"
                                }`}
                            >
                                {item.title}
                            </span>
                        </button>
                        {index < sidebar.length - 1 && (
                            <hr className="border-t border-dashed border-gray-300 my-2" />
                        )}
                    </div>
                ))}
            </div>
            <div className="flex-1 p-4 flex flex-col justify-between h-full">
                <CurrentComponent
                    onValidate={(isValid) =>
                        handleValidation(selectedComponent, isValid)
                    }
                />
                <div className="flex justify-end gap-4 text-sm px-4">
                    {selectedComponent === sidebar.length - 1 ? (
                        <button
                            onClick={handlePrevious}
                            disabled={selectedComponent === 0}
                            className={`p-2 border border-gray-300 rounded-lg transition-all duration-200 flex gap-1 items-center ${
                                selectedComponent === 0
                                    ? "opacity-50 cursor-not-allowed"
                                    : ""
                            }`}
                        >
                            <ArrowCircleLeft size={18} />
                            Previous
                        </button>
                    ) : (
                        <button
                            onClick={handlePrevious}
                            disabled={selectedComponent === 0}
                            className={`p-2 border border-gray-300 rounded-lg transition-all duration-200 flex gap-1 items-center ${
                                selectedComponent === 0
                                    ? "opacity-50 cursor-not-allowed"
                                    : ""
                            }`}
                        >
                            <ArrowCircleLeft size={18} />
                            Previous
                        </button>
                    )}

                    {selectedComponent === sidebar.length - 1 ? (
                        <div className="">
                            <button
                                // onClick={handleSubmit}
                                onClick={showConfirm}
                                disabled={
                                    !componentValidation.every(
                                        (validation) => validation
                                    ) || isSubmitting
                                }
                                className={`p-2 rounded-lg bg-green-600 text-white transition-all duration-200 flex gap-1 items-center ${
                                    !componentValidation.every(
                                        (validation) => validation
                                    ) || isSubmitting
                                        ? "opacity-50 cursor-not-allowed"
                                        : ""
                                }`}
                            >
                                {isSubmitting ? (
                                    <div className="m-auto flex px-5">
                                        <l-tailspin
                                            size="20"
                                            stroke="3"
                                            speed="1"
                                            color="white"
                                        />
                                    </div>
                                ) : (
                                    "Submit Application"
                                )}
                            </button>
                            {confirm && (
                                <div className="h-screen w-full z-30 absolute top-0 left-0 bg-black bg-opacity-45 flex items-start m-auto">
                                    <div className="m-auto bg-gray-100 text-lg rounded-xl max-w-lg overflow-hidden">
                                        <div className="px-4 py-4 border-b border-gray-400">
                                            <p>
                                                Are you sure you want to submit
                                                your application?
                                            </p>
                                            <span className="text-sm flex items-center gap-1 text-yellow-600">
                                                <WarningCircle /> You wont be
                                                able to make changes after
                                                submission.
                                            </span>
                                        </div>

                                        <div className="flex gap-2 justify-end p-4 text-base bg-gradient-to-r from-blue-400 to-blue-300">
                                            <button
                                                className="px-2 py-1 rounded-md flex items-center gap-2 hover:bg-gray-50 bg-white"
                                                onClick={() =>
                                                    showConfirm(false)
                                                }
                                            >
                                                Verify Again <XCircle />
                                            </button>
                                            <button
                                                className="px-2 py-1 rounded-md flex items-center gap-2 hover:bg-gray-50 bg-gradient-to-b from-blue-600 to-blue-500 text-white"
                                                onClick={() => handleSubmit()}
                                            >
                                                Confirm Changes
                                                <CheckCircle />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <button
                            onClick={handleNext}
                            disabled={
                                selectedComponent === sidebar.length - 1 ||
                                !componentValidation[selectedComponent]
                            }
                            className={`p-2 rounded-lg bg-blue-600 text-white transition-all duration-200 flex gap-1 items-center ${
                                selectedComponent === sidebar.length - 1 ||
                                !componentValidation[selectedComponent]
                                    ? "opacity-50 cursor-not-allowed"
                                    : ""
                            }`}
                        >
                            Next <ArrowCircleRight size={18} />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

export default function ApplyLoan() {
    return (
        <LoanApplicationProvider>
            <ApplyLoanContent />
        </LoanApplicationProvider>
    );
}
