import React, {
    useState,
    useContext,
    useEffect,
    useMemo,
    useCallback,
} from "react";
import { LoanApplicationContext } from "@/context/LoanApplicationContext";

export default function EmployeeDetails({ onValidate }) {
    const { loanApplication, updateLoanApplication, validateForm, errors } =
        useContext(LoanApplicationContext);

    const occupationOptions = [
        { value: "", label: "Select Occupation" },
        { value: "Employed", label: "Employed" },
        { value: "Self Employed", label: "Self Employed" },
        { value: "Business Owner", label: "Business Owner" },
    ];

    const employmentStatusOptions = [
        { value: "", label: "Select Status" },
        { value: "Permanent", label: "Permanent" },
        { value: "Contractual", label: "Contractual" },
        { value: "Retainership", label: "Retainership" },
        { value: "Part time", label: "Part Time" },
    ];

    const initialFormData = useMemo(
        () => ({
            occupation: loanApplication.occupation || "",
            employmentStatus: loanApplication.employmentStatus || "",
            grossIncome: loanApplication.grossIncome || "",
            yearsExperience: loanApplication.yearsExperience || "",
            monthsExperience: loanApplication.monthsExperience || "",
        }),
        [loanApplication]
    );

    const [formData, setFormData] = useState(initialFormData);
    const [touched, setTouched] = useState({});

    useEffect(() => {
        handleValidation();
    }, [formData]);

    const handleValidation = useCallback(() => {
        const isValid = validateForm("employeeDetails", formData);
        onValidate(isValid);
        return isValid;
    }, [formData, validateForm, onValidate]);

    const handleChange = useCallback(
        (e) => {
            const { name, value } = e.target;
            let processedValue = value;

            // Format gross income input
            if (name === "grossIncome") {
                // Remove non-numeric characters
                const numericValue = value.replace(/[^0-9]/g, "");
                if (numericValue) {
                    // Ensure the value doesn't exceed 2,00,000
                    const parsedValue = parseInt(numericValue);
                    if (parsedValue > 200000) {
                        processedValue = "2,00,000";
                    } else {
                        // Format with commas for Indian currency
                        processedValue = parsedValue.toLocaleString("en-IN");
                    }
                } else {
                    processedValue = "";
                }
            }

            const updatedFormData = {
                ...formData,
                [name]: processedValue,
            };
            setFormData(updatedFormData);
            updateLoanApplication(updatedFormData);
            handleValidation();
        },
        [formData, updateLoanApplication, handleValidation]
    );
    const handleBlur = useCallback(
        (e) => {
            const { name } = e.target;
            setTouched((prev) => ({
                ...prev,
                [name]: true,
            }));
            handleValidation();
        },
        [handleValidation]
    );

    const handleSubmit = useCallback(
        (e) => {
            e.preventDefault();
            handleValidation();
        },
        [handleValidation]
    );

    const getInputProps = useCallback(
        (name, type = "text") => ({
            type,
            name,
            id: name,
            value: formData[name] || "",
            onChange: handleChange,
            onBlur: handleBlur,
            className: `py-2 px-4 border rounded-md outline-none text-black ${
                touched[name] && errors[name] ? "border-red-500" : ""
            }`,
        }),
        [formData, touched, errors, handleChange, handleBlur]
    );

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <h1 className="text-xl font-semibold px-4 py-3">
                    Employment Information
                </h1>
                <hr className="border-t border-dashed border-gray-300 my-3" />
                <div className="grid grid-cols-2 gap-4 px-4 py-3">
                    {[
                        {
                            name: "occupation",
                            label: "Organization Type",
                            type: "select",
                            options: occupationOptions,
                            required: true,
                        },
                        {
                            name: "employmentStatus",
                            label: "Employment Status",
                            type: "select",
                            options: employmentStatusOptions,
                            required: true,
                        },
                        {
                            name: "grossIncome",
                            label: "Gross Monthly Income",
                            type: "text",
                            placeholder: "Ex: ₹15,000",
                            required: true,
                        },
                        {
                            name: "yearsExperience",
                            label: "Total Work Experience (Years)",
                            type: "number",
                            placeholder: "00",
                            min: 0,
                            max: 50,
                            required: true,
                        },
                        {
                            name: "monthsExperience",
                            label: "Total Work Experience (Months)",
                            type: "number",
                            placeholder: "00",
                            min: 0,
                            max: 12,
                            required: true,
                        },
                    ].map((field) => (
                        <div
                            key={field.name}
                            className="flex flex-col gap-2 relative"
                        >
                            <label htmlFor={field.name}>
                                {field.label}
                                {field.required ? (
                                    <span className="pl-1 text-red-500">*</span>
                                ) : (
                                    ""
                                )}
                            </label>
                            {field.type === "select" ? (
                                <select
                                    {...getInputProps(field.name)}
                                    className="py-2 px-4 border rounded-md outline-none text-black"
                                >
                                    {field.options.map((option) => (
                                        <option
                                            key={option.value}
                                            value={option.value}
                                        >
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                            ) : (
                                <input
                                    {...getInputProps(field.name, field.type)}
                                    placeholder={field.placeholder}
                                    min={field.min}
                                    max={field.max}
                                    onInput={
                                        field.type === "number" &&
                                        (field.name === "yearsExperience" ||
                                            field.name === "monthsExperience")
                                            ? (e) => {
                                                  const { value } = e.target;
                                                  if (value.length > 2) {
                                                      e.target.value =
                                                          value.slice(0, 2);
                                                  }
                                              }
                                            : undefined
                                    }
                                />
                            )}
                            {touched[field.name] && errors[field.name] && (
                                <p className="text-red-500 text-xs top-1 absolute right-0">
                                    {errors[field.name]}
                                </p>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </form>
    );
}
