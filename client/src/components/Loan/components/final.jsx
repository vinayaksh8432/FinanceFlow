import { useEffect, useState, useCallback, useRef } from "react";
import { fetchLoanTypes } from "@/utils/api";
import LoanCalculator from "./chart";
import { IoMdRadioButtonOff } from "react-icons/io";
import { IoMdRadioButtonOn } from "react-icons/io";
import { CaretLineDown, Question } from "@phosphor-icons/react";

export default function Final({ formData, onComplete }) {
    const initialData = {
        loanType: "",
        desiredLoanAmount: "1,00,000", // 1 lakh default
        annualIncome: "",
        loanTenure: "",
        comments: "",
        consent1: false,
        consent2: false,
        ...formData,
    };

    const allTenures = ["12", "24", "36", "48", "60", "72"];

    const [data, setData] = useState(initialData);
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});
    const [apiError, setApiError] = useState("");
    const [loanTypes, setLoanTypes] = useState([]);
    const [selectedLoanType, setSelectedLoanType] = useState(null);
    const componentRef = useRef(null);

    const validateField = (name, value) => {
        switch (name) {
            case "loanType":
                return !value ? "Loan type is required" : "";
            case "desiredLoanAmount":
                if (!value) return "Desired loan amount is required";
                const numericValue = parseFloat(value.replace(/[₹,]/g, ""));
                if (numericValue <= 0)
                    return "Loan amount must be greater than 0";
                if (
                    selectedLoanType &&
                    numericValue > selectedLoanType.maxAmount
                ) {
                    return `Loan amount cannot exceed ${selectedLoanType.upto}`;
                }
                return "";
            case "annualIncome":
                return !value
                    ? "Annual income is required"
                    : parseFloat(value.replace(/[₹,]/g, "")) <= 0
                    ? "Annual income must be greater than 0"
                    : "";
            case "loanTenure":
                return !value ? "Loan tenure is required" : "";
            case "consent1" && "consent2":
                return !value ? "You must accept the both the consents" : "";
            default:
                return "";
        }
    };

    const validateAllFields = useCallback(
        (formData) => {
            const newErrors = {};
            let isValid = true;
            const fieldsToValidate = [
                "loanType",
                "desiredLoanAmount",
                "loanTenure",
                "consent1",
                "consent2",
            ];

            fieldsToValidate.forEach((field) => {
                const error = validateField(field, formData[field]);
                if (error) {
                    isValid = false;
                    newErrors[field] = error;
                }
            });

            return { isValid, errors: newErrors };
        },
        [selectedLoanType]
    );

    const formatIndianCurrency = (num) => {
        if (num === "") return "";
        const numStr = num.replace(/[₹,]/g, "");
        if (isNaN(numStr)) return "0";

        const parts = numStr.split(".");
        let integerPart = parts[0];

        let lastThree = integerPart.substring(integerPart.length - 3);
        let otherNumbers = integerPart.substring(0, integerPart.length - 3);
        if (otherNumbers !== "") lastThree = "," + lastThree;
        let formattedNumber =
            otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree;

        return (
            "" + (parts[1] ? formattedNumber + "." + parts[1] : formattedNumber)
        );
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        let processedValue = value;
        if (name === "desiredLoanAmount" || name === "annualIncome") {
            const numericValue = value.replace(/[₹,]/g, "");
            if (!isNaN(numericValue) || numericValue === "") {
                if (name === "desiredLoanAmount" && selectedLoanType) {
                    // Ensure the value doesn't exceed max amount
                    const parsedValue = parseInt(numericValue) || 0;
                    if (parsedValue > selectedLoanType.maxAmount) {
                        processedValue = formatIndianCurrency(
                            selectedLoanType.maxAmount.toString()
                        );
                    } else {
                        processedValue = formatIndianCurrency(value);
                    }
                } else {
                    processedValue = formatIndianCurrency(value);
                }
            } else {
                return;
            }
        }

        setData((prev) => {
            const newData = {
                ...prev,
                [name]: type === "checkbox" ? checked : processedValue,
            };
            return newData;
        });

        setTouched((prev) => ({
            ...prev,
            [name]: true,
        }));

        if (errors[name]) {
            setErrors((prev) => ({
                ...prev,
                [name]: "",
            }));
        }
    };

    const handleBlur = (e) => {
        const { name, value, type, checked } = e.target;
        const validationValue = type === "checkbox" ? checked : value;
        const error = validateField(name, validationValue);
        setErrors((prev) => ({
            ...prev,
            [name]: error,
        }));
    };

    const handleLoanTypeSelect = (type) => {
        const selectedType = loanTypes.find((lt) => lt.name === type);
        setSelectedLoanType(selectedType);

        // Get the lowest allowed tenure for the selected loan type
        const lowestTenure = selectedType?.allowedTenures
            .map((tenure) => parseInt(tenure)) // Convert "12 Months" to 12
            .sort((a, b) => a - b)[0] // Get the lowest number
            .toString(); // Convert back to string

        setData((prev) => ({
            ...prev,
            loanType: type,
            loanTenure: lowestTenure, // Set the lowest allowed tenure
            desiredLoanAmount: formatIndianCurrency("100000"), // Set to 1 lakh
        }));
        setTouched((prev) => ({
            ...prev,
            loanType: true,
        }));
    };

    const handleLoanTenureSelect = (tenure) => {
        setData((prev) => ({
            ...prev,
            loanTenure: tenure,
        }));
        setTouched((prev) => ({
            ...prev,
            loanTenure: true,
        }));
    };

    useEffect(() => {
        const fetchLoanTypeData = async () => {
            try {
                const loanTypeData = await fetchLoanTypes();
                setLoanTypes(loanTypeData);
                setApiError("");
            } catch (err) {
                setApiError(
                    "Failed to fetch loan options. Please try again later."
                );
                console.error("Error fetching loan data:", err);
            }
        };

        fetchLoanTypeData();
    }, []);

    useEffect(() => {
        if (formData && Object.keys(formData).length > 0) {
            setData((prev) => ({
                ...prev,
                ...formData,
            }));
        }
    }, [formData]);

    useEffect(() => {
        const { isValid } = validateAllFields(data);
        if (isValid && JSON.stringify(data) !== JSON.stringify(formData)) {
            onComplete?.(data);
        }
    }, [data, validateAllFields, onComplete, formData]);

    const formatIndianCurrencyNaming = (number) => {
        const num = Math.round(parseFloat(number));

        if (num >= 10000000) {
            // For crores (≥ 1 crore)
            const crores = (num / 10000000).toFixed(2);
            return `${crores} Cr`;
        } else if (num >= 100000) {
            // For lakhs (≥ 1 lakh)
            const lakhs = (num / 100000).toFixed(2);
            return `${lakhs} L`;
        } else if (num >= 1000) {
            // For thousands
            const str = num.toString();
            let lastThree = str.substring(str.length - 3);
            const otherNumbers = str.substring(0, str.length - 3);
            if (otherNumbers !== "") {
                lastThree = "," + lastThree;
            }
            return (
                "₹" +
                otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") +
                lastThree
            );
        }
        return `₹${num}`; // For numbers less than 1000
    };

    return (
        <div className="flex gap-6 h-full">
            <div
                className="flex-1 overflow-y-scroll flex flex-col gap-4 rounded-xl relative"
                style={{ maxHeight: "calc(100vh - 23vh)" }}
                ref={componentRef}
            >
                <div className="">
                    <h1 className="pb-2">Select Loan Type</h1>
                    <div className="grid grid-cols-3 gap-2">
                        {loanTypes.map((type) => (
                            <div
                                className={`rounded-md border-2 transition-all duration-200 flex justify-between py-4 cursor-pointer ${
                                    data.loanType === type.name
                                        ? "border-blue-300 text-blue-800"
                                        : "border-gray-300 hover:bg-gray-100"
                                }`}
                                key={type.name}
                                onClick={() => handleLoanTypeSelect(type.name)}
                            >
                                <div className="pl-4 space-y-1 pr-1">
                                    <h1>{type.name}</h1>
                                    <p className="text-xs">
                                        {type.shortDescription}
                                    </p>
                                    <h2 className="text-xs">
                                        ₹ from {type.interestRate} p.a.
                                    </h2>
                                </div>
                                <img
                                    src={`${import.meta.env.VITE_BACKEND_URL}/${
                                        type.typeImage
                                    }`}
                                    alt={`${type.name} icon`}
                                    className="w-16 h-auto object-contain drop-shadow-md"
                                />
                            </div>
                        ))}
                        {touched.loanType && errors.loanType && (
                            <span className="text-red-500 text-sm block mt-2">
                                {errors.loanType}
                            </span>
                        )}
                    </div>
                </div>

                <div className="flex items-center justify-between">
                    <div className="group flex items-center gap-2 relative">
                        Loan Amount
                        <Question />
                        <div
                            className="
                                absolute 
                                text-gray-500 
                                border 
                                rounded-md 
                                bg-white 
                                p-2 
                                top-6
                                left-24 
                                shadow-sm
                                transition-all
                                duration-400
                                invisible
                                translate-y-0.5
                                group-hover:visible
                                group-hover:delay-200
                                group-hover:translate-y-0
                                group-hover:transition-all
                                group-hover:duration-500
                            "
                        >
                            <h1 className="p-1 text-xs">Maximum Amount</h1>
                            {loanTypes.map((type) => (
                                <div
                                    key={type.name}
                                    className="w-40 flex justify-between items-center p-1 hover:bg-gray-50 rounded-md "
                                >
                                    <h1 className="text-sm font-medium">
                                        {type.name}:
                                    </h1>
                                    <h2 className="text-sm">
                                        ₹
                                        {formatIndianCurrencyNaming(
                                            type.maxAmount.toString()
                                        )}
                                    </h2>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex items-center relative">
                        <label
                            htmlFor="desiredLoanAmount"
                            className={`text-blue-500 p-0.5 px-2 rounded-sm cursor-text ${
                                !selectedLoanType
                                    ? "bg-gray-100 cursor-not-allowed"
                                    : touched.desiredLoanAmount &&
                                      (errors.desiredLoanAmount ||
                                          parseFloat(
                                              data.desiredLoanAmount.replace(
                                                  /[₹,]/g,
                                                  ""
                                              )
                                          ) < 100000)
                                    ? "bg-red-100 text-red-600"
                                    : "bg-blue-200"
                            }`}
                        >
                            ₹
                            <input
                                type="text"
                                name="desiredLoanAmount"
                                id="desiredLoanAmount"
                                value={data.desiredLoanAmount || ""}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                disabled={!selectedLoanType}
                                placeholder="0"
                                maxLength={10}
                                className={`text-blue-500 text-right w-24 outline-none ${
                                    !selectedLoanType
                                        ? "bg-gray-100 cursor-not-allowed"
                                        : touched.desiredLoanAmount &&
                                          (errors.desiredLoanAmount ||
                                              parseFloat(
                                                  data.desiredLoanAmount.replace(
                                                      /[₹,]/g,
                                                      ""
                                                  )
                                              ) < 100000)
                                        ? "bg-red-100 text-red-600"
                                        : "bg-blue-200"
                                }`}
                            />
                        </label>
                        {touched.desiredLoanAmount &&
                            errors.desiredLoanAmount && (
                                <span className="text-red-500 text-sm absolute translate-y-8 text-nowrap right-0">
                                    {errors.desiredLoanAmount}
                                </span>
                            )}
                    </div>
                </div>

                <div>
                    <h1 className="pb-2">Loan Tenure </h1>
                    <div className="grid grid-cols-3 gap-4">
                        {allTenures.map((tenure) => {
                            // Parse the tenure from the loanTypes allowedTenures array
                            const isAllowed = selectedLoanType?.allowedTenures
                                .map((t) => t.split(" ")[0]) // Convert "12 Months" to "12"
                                .includes(tenure);

                            return (
                                <button
                                    key={tenure}
                                    type="button"
                                    onClick={() =>
                                        isAllowed &&
                                        handleLoanTenureSelect(tenure)
                                    }
                                    disabled={!selectedLoanType || !isAllowed}
                                    className={`py-2 px-6 rounded-md border transition-all duration-200 flex items-center gap-4
                                        ${
                                            data.loanTenure === tenure
                                                ? "bg-gray-800 text-white"
                                                : !selectedLoanType
                                                ? "border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed"
                                                : !isAllowed
                                                ? "border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed"
                                                : "border-gray-300 hover:bg-gray-100"
                                        }`}
                                >
                                    <div className="">
                                        {data.loanTenure === tenure ? (
                                            <IoMdRadioButtonOn />
                                        ) : (
                                            <IoMdRadioButtonOff />
                                        )}
                                    </div>
                                    {tenure} Months
                                </button>
                            );
                        })}
                    </div>
                    {touched.loanTenure && errors.loanTenure && (
                        <span className="text-red-500 text-sm block mt-2">
                            {errors.loanTenure}
                        </span>
                    )}
                </div>
                <div>
                    <h1 className="pb-2">Comments (Optional)</h1>
                    <textarea
                        name="comments"
                        value={data.comments}
                        onChange={handleChange}
                        rows="3"
                        className="w-full outline-none p-2 px-4 resize-none border border-gray-300 rounded-md"
                    />
                </div>
                <div className="text-justify space-y-2 relative">
                    <h1 className="font-medium">
                        Consent <span className="text-red-500">*</span>
                    </h1>
                    <div className="flex gap-2 items-baseline">
                        <input
                            type="checkbox"
                            name="consent1"
                            id="consent1"
                            checked={data.consent1}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className="mt-1"
                        />
                        <label htmlFor="consent1" className="text-sm">
                            I authorize prospective Credit
                            Grantors/Lending/Leasing Companies to obtain
                            personal and credit information about me from my
                            employer and credit bureau, or credit reporting
                            agency, any person who has or may have any financial
                            dealing with me, or from any references I have
                            provided.
                        </label>
                    </div>

                    <div className="flex gap-2 items-baseline">
                        <input
                            type="checkbox"
                            name="consent2"
                            id="consent2"
                            checked={data.consent2}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className="mt-1"
                        />
                        <label htmlFor="consent2" className="text-sm">
                            I hereby agree that the information given is true,
                            accurate and complete as of the date of this
                            application submission.
                        </label>
                    </div>
                    {touched.consent2 && errors.consent2 && (
                        <span className="text-red-500 text-sm absolute top-0 right-0">
                            {errors.consent2}
                        </span>
                    )}
                </div>
            </div>

            <div className="w-1/3 sticky top-0">
                <LoanCalculator
                    loanAmount={data.desiredLoanAmount || "0"}
                    loanType={data.loanType || ""}
                    loanTenure={data.loanTenure || "0"}
                    interestRate={
                        selectedLoanType?.interestRate.replace("%", "") || "0"
                    }
                />
            </div>

            {apiError && <div className="text-red-500 text-sm">{apiError}</div>}
        </div>
    );
}
