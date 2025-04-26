import React, {
    useState,
    useContext,
    useEffect,
    useMemo,
    useCallback,
} from "react";
import { LoanApplicationContext } from "@/context/LoanApplicationContext";

export default function PersonalDetails({ onValidate }) {
    const { loanApplication, updateLoanApplication, validateForm, errors } =
        useContext(LoanApplicationContext);

    const initialFormData = useMemo(
        () => ({
            FirstName: loanApplication.FirstName || "",
            MiddleName: loanApplication.MiddleName || "",
            LastName: loanApplication.LastName || "",
            Email: loanApplication.Email || "",
            Phone: loanApplication.Phone || "",
            DateofBirth: loanApplication.DateofBirth || "",
            Gender: loanApplication.Gender || "",
            MartialStatus: loanApplication.MartialStatus || "",
        }),
        [loanApplication]
    );

    const [formData, setFormData] = useState(initialFormData);
    const [touched, setTouched] = useState({});

    useEffect(() => {
        handleValidation();
    }, [formData]);

    const handleValidation = useCallback(() => {
        const isValid = validateForm("personalDetails", formData);
        onValidate(isValid);
        return isValid;
    }, [formData, validateForm, onValidate]);

    const handleChange = useCallback(
        (e) => {
            const { name, value } = e.target;
            const updatedFormData = {
                ...formData,
                [name]: value,
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
                    Personal Details
                </h1>
                <hr className="border-t border-dashed border-gray-300 my-3" />
                <div className="grid grid-cols-3 gap-4 px-4 py-2">
                    {[
                        {
                            name: "FirstName",
                            label: "First Name",
                            type: "text",
                            required: true,
                        },
                        {
                            name: "MiddleName",
                            label: "Middle Name",
                            type: "text",
                            required: false,
                        },
                        {
                            name: "LastName",
                            label: "Last Name",
                            type: "text",
                            required: true,
                        },
                        {
                            name: "Email",
                            label: "Email",
                            type: "email",
                            placeholder: "example@example.com",
                            required: true,
                        },
                        {
                            name: "Phone",
                            label: "Phone",
                            type: "tel",
                            isPhone: true,
                            placeholder: "XXXXXXXXXX",
                            maxLength: 10,
                            pattern: "[0-9]{10}",
                            required: true,
                        },
                        {
                            name: "DateofBirth",
                            label: "Date of Birth",
                            type: "date",
                            max: new Date(
                                new Date().setFullYear(
                                    new Date().getFullYear() - 21
                                )
                            )
                                .toISOString()
                                .split("T")[0],
                            required: true,
                        },
                        {
                            name: "Gender",
                            label: "Gender",
                            type: "select",
                            options: [
                                { value: "", label: "Select Gender" },
                                { value: "Male", label: "Male" },
                                { value: "Female", label: "Female" },
                                { value: "Other", label: "Other" },
                            ],
                            required: true,
                        },
                        {
                            name: "MartialStatus",
                            label: "Marital Status",
                            type: "select",
                            options: [
                                { value: "", label: "Select Marital Status" },
                                { value: "Single", label: "Single" },
                                { value: "Married", label: "Married" },
                                { value: "Divorced", label: "Divorced" },
                                { value: "Widowed", label: "Widowed" },
                            ],
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
                            {field.isPhone ? (
                                <div className="flex w-full items-center border border-gray-300 rounded-lg overflow-hidden">
                                    <h1 className="py-2 px-3 border-r bg-gray-100">
                                        +91
                                    </h1>
                                    <input
                                        {...getInputProps(
                                            field.name,
                                            field.type
                                        )}
                                        placeholder={field.placeholder}
                                        className="p-2 w-full outline-none"
                                        maxLength={field.maxLength}
                                        pattern={field.pattern}
                                    />
                                </div>
                            ) : field.type === "select" ? (
                                <select {...getInputProps(field.name)}>
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
                                    max={field.max}
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
