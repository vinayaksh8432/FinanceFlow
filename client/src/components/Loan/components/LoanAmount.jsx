import React, {
    useState,
    useContext,
    useEffect,
    useMemo,
    useCallback,
} from "react";
import { LoanApplicationContext } from "@/context/LoanApplicationContext";
import { fetchLoanTypes } from "@/utils/api";
import LoanChart from "./LoanChart";

export default function LoanAmount({ onValidate }) {
    const { loanApplication, updateLoanApplication, validateForm, errors } =
        useContext(LoanApplicationContext);

    const [loanTypes, setLoanTypes] = useState([]);
    const [selectedLoanType, setSelectedLoanType] = useState(null);
    const [touched, setTouched] = useState({});

    const allTenures = ["12", "24", "36", "48", "60", "72", "84", "96"];

    const initialFormData = useMemo(
        () => ({
            loanType: loanApplication.loanType || "",
            desiredLoanAmount: loanApplication.desiredLoanAmount || "1,00,000",
            loanTenure: loanApplication.loanTenure || "",
            monthlyEmi: loanApplication.monthlyEmi || "",
            loanAmountWithInterest:
                loanApplication.loanAmountWithInterest || "",
            totalLoanAmount: loanApplication.totalLoanAmount || "",
        }),
        [loanApplication]
    );

    const [formData, setFormData] = useState(initialFormData);

    const calculateMaxLoanAmount = useCallback(() => {
        const grossIncome = parseInt(
            loanApplication.grossIncome?.replace(/,/g, "") || "0"
        );
        return grossIncome * 30; // 15 times the monthly income
    }, [loanApplication.grossIncome]);

    const formatIndianCurrency = useCallback(
        (value) => {
            // Remove all non-digit characters
            const numericValue = value.replace(/[^0-9]/g, "");

            // If empty, return empty string
            if (!numericValue) return "";

            // Parse the number
            const number = parseInt(numericValue);

            // Check against maximum allowed amount
            const maxAmount = calculateMaxLoanAmount();
            const finalNumber = Math.min(number, maxAmount);

            // Format with commas (Indian numbering system)
            return finalNumber.toLocaleString("en-IN");
        },
        [calculateMaxLoanAmount]
    );

    const handleLoanTypeSelect = useCallback(
        (type) => {
            const selectedType = loanTypes.find((lt) => lt.name === type);

            const updatedFormData = {
                loanType: type,
                loanTenure:
                    selectedType?.allowedTenures[0]?.split(" ")[0] || "",
                desiredLoanAmount: "1,00,000",
            };

            setSelectedLoanType(selectedType);
            setFormData(updatedFormData);
            updateLoanApplication(updatedFormData);
        },
        [loanTypes, updateLoanApplication]
    );

    const handleLoanAmountChange = useCallback(
        (e) => {
            const formattedAmount = formatIndianCurrency(e.target.value);
            const maxAmount = calculateMaxLoanAmount();
            const currentAmount = parseInt(
                formattedAmount.replace(/,/g, "") || "0"
            );

            setFormData((prev) => ({
                ...prev,
                desiredLoanAmount: formattedAmount,
            }));

            if (currentAmount > maxAmount) {
                setTouched((prev) => ({
                    ...prev,
                    desiredLoanAmount: true,
                }));
                // You might want to add this to your errors context
                errors.desiredLoanAmount = `Maximum loan amount based on your income: ₹${maxAmount.toLocaleString(
                    "en-IN"
                )}`;
            } else {
                errors.desiredLoanAmount = "";
            }

            updateLoanApplication({
                ...formData,
                desiredLoanAmount: formattedAmount,
            });
        },
        [
            formatIndianCurrency,
            calculateMaxLoanAmount,
            formData,
            updateLoanApplication,
            errors,
        ]
    );

    const handleLoanTenureChange = useCallback((tenure) => {
        setFormData((prev) => ({
            ...prev,
            loanTenure: tenure,
        }));
        setTouched((prev) => ({
            ...prev,
            loanTenure: true,
        }));
    }, []);

    useEffect(() => {
        const fetchLoanTypeData = async () => {
            try {
                const loanTypeData = await fetchLoanTypes();
                setLoanTypes(loanTypeData);
            } catch (err) {
                console.error("Error fetching loan data:", err);
            }
        };

        fetchLoanTypeData();
    }, []);

    // Existing validation and other effects...
    useEffect(() => {
        handleValidation();
    }, [formData]);

    const handleValidation = useCallback(() => {
        const isValid = validateForm("loanAmount", formData);
        onValidate(isValid);
        return isValid;
    }, [formData, validateForm, onValidate]);

    return (
        <div
            className="flex gap-6 h-full px-4"
            style={{ maxHeight: "calc(100vh - 24vh)" }}
        >
            <div className="flex-1 overflow-y-scroll flex flex-col gap-4 justify-center rounded-xl relative">
                <div>
                    <h1 className="pb-2">Select Loan Type</h1>
                    <div className="grid grid-cols-2 gap-2">
                        {loanTypes.map((type) => (
                            <div
                                className={`rounded-md relative border-2 transition-all duration-200 flex justify-between py-4 cursor-pointer ${
                                    formData.loanType === type.name
                                        ? "border-blue-300 text-blue-800"
                                        : "border-gray-300 hover:bg-gray-100"
                                }`}
                                key={type.name}
                                onClick={() => handleLoanTypeSelect(type.name)}
                            >
                                <div className="pl-4 space-y-1 pr-1">
                                    <h1>{type.name} Loan</h1>
                                    <p className="text-xs">
                                        {type.description}
                                    </p>
                                    <h2 className="text-xs">
                                        Starting from {type.interestRate} p.a.
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
                    </div>
                    {touched.loanType && errors.loanType && (
                        <span className="text-red-500 text-sm block mt-2">
                            {errors.loanType}
                        </span>
                    )}
                </div>

                <div className="flex items-center justify-between py-1">
                    <h1>Loan Amount</h1>
                    <div className="flex items-center relative">
                        <div
                            className={`text-blue-500 flex items-center bg-blue-200 rounded-sm p-0.5 px-1 ${
                                touched.desiredLoanAmount &&
                                errors.desiredLoanAmount
                                    ? "bg-red-200"
                                    : "bg-blue-200"
                            }`}
                        >
                            <span className="px-1">₹</span>
                            <input
                                type="text"
                                name="desiredLoanAmount"
                                value={formData.desiredLoanAmount || ""}
                                onChange={handleLoanAmountChange}
                                disabled={!selectedLoanType}
                                placeholder="0"
                                className={`text-blue-500 text-right w-24 outline-none ${
                                    !selectedLoanType
                                        ? "cursor-not-allowed"
                                        : touched.desiredLoanAmount &&
                                          errors.desiredLoanAmount
                                        ? "bg-red-200"
                                        : "bg-blue-200"
                                }`}
                            />
                        </div>
                        {touched.desiredLoanAmount &&
                            errors.desiredLoanAmount && (
                                <span className="text-red-500 text-sm absolute text-nowrap right-32">
                                    {errors.desiredLoanAmount}
                                </span>
                            )}
                    </div>
                </div>

                <div>
                    <h1 className="pb-2">
                        Choose your Loan Tenure
                        <span className="text-gray-500 pl-2">
                            {formData.loanTenure
                                ? `${formData.loanTenure} Months`
                                : "Select tenure"}
                        </span>
                    </h1>

                    <div className="grid grid-cols-8 gap-4">
                        {allTenures.map((tenure) => {
                            const isAllowed = selectedLoanType?.allowedTenures
                                .map((t) => t.split(" ")[0])
                                .includes(tenure);

                            return (
                                <button
                                    key={tenure}
                                    type="button"
                                    onClick={() =>
                                        isAllowed &&
                                        handleLoanTenureChange(tenure)
                                    }
                                    disabled={!selectedLoanType || !isAllowed}
                                    className={`py-2 rounded-md border transition-all duration-200
                                        ${
                                            formData.loanTenure === tenure
                                                ? "bg-gray-800 text-white"
                                                : !selectedLoanType
                                                ? "border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed"
                                                : !isAllowed
                                                ? "border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed"
                                                : "border-gray-300 hover:bg-gray-100"
                                        }`}
                                >
                                    {tenure}
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
            </div>

            <div className="w-1/3 sticky top-0">
                <LoanChart
                    key={`${formData.loanType}-${formData.loanTenure}-${formData.desiredLoanAmount}`}
                    loanType={formData.loanType}
                    loanAmount={formData.desiredLoanAmount}
                    loanTenure={formData.loanTenure}
                    interestRate={
                        selectedLoanType?.interestRate.replace("%", "") || "0"
                    }
                />
            </div>
        </div>
    );
}
