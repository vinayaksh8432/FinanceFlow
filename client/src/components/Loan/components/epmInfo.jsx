import { useState, useEffect, useCallback } from "react";

export default function EmpInfo({ formData, onComplete }) {
    const initialData = {
        occupation: "",
        experienceDuration: "",
        grossIncome: "",
        rent: "",
        ...formData,
    };

    const [data, setData] = useState(initialData);
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});

    const occupationOptions = ["Employed", "Self Employed", "Business Owner"];
    const experienceOptions = [
        "0-1 Year",
        "1-2 Years",
        "3-4 Years",
        "5+ Years",
    ];

    const validateField = (name, value) => {
        switch (name) {
            case "occupation":
                return !value ? "Occupation is required" : "";
            case "experienceDuration":
                return !value ? "Years of experience is required" : "";
            case "grossIncome":
                return !value
                    ? "Gross monthly income is required"
                    : parseFloat(value.replace(/[₹,]/g, "")) <= 0
                    ? "Income must be greater than 0"
                    : "";
            case "rent":
                return value === ""
                    ? "Monthly rent/mortgage is required"
                    : parseFloat(value.replace(/[₹,]/g, "")) < 0
                    ? "Rent cannot be negative"
                    : "";
            default:
                return "";
        }
    };

    const validateAllFields = useCallback(
        (formData) => {
            const newErrors = {};
            let isValid = true;
            const fieldsToValidate = [
                "occupation",
                "experienceDuration",
                "grossIncome",
                "rent",
            ];

            fieldsToValidate.forEach((field) => {
                const error = validateField(field, formData[field]);
                if (error) {
                    isValid = false;
                    newErrors[field] = error;
                }
            });

            // Additional validation to ensure all fields have been touched
            fieldsToValidate.forEach((field) => {
                if (!touched[field]) {
                    isValid = false;
                }
            });

            return { isValid, errors: newErrors };
        },
        [touched]
    );

    useEffect(() => {
        const { isValid, errors: newErrors } = validateAllFields(data);
        setErrors(newErrors);

        // Only call onComplete if all fields are valid AND have been touched
        if (
            isValid &&
            Object.keys(touched).length === 4 && // Check if all 4 fields have been touched
            Object.values(touched).every((t) => t) && // Ensure all touched values are true
            JSON.stringify(data) !== JSON.stringify(formData)
        ) {
            onComplete(data);
        }
    }, [data, validateAllFields, onComplete, formData, touched]);

    const formatIndianCurrency = (num) => {
        if (num === "") return "";
        const numStr = num.replace(/[₹,]/g, "");
        if (isNaN(numStr)) return "";

        const parts = numStr.split(".");
        let integerPart = parts[0];

        let lastThree = integerPart.substring(integerPart.length - 3);
        let otherNumbers = integerPart.substring(0, integerPart.length - 3);
        if (otherNumbers !== "") lastThree = "," + lastThree;
        let formattedNumber =
            otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree;

        return (
            "₹" +
            (parts[1] ? formattedNumber + "." + parts[1] : formattedNumber)
        );
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        let processedValue = value;
        if (name === "grossIncome" || name === "rent") {
            const numericValue = value.replace(/[₹,]/g, "");
            if (
                (!isNaN(numericValue) &&
                    parseFloat(numericValue) <= 30000000) ||
                numericValue === ""
            ) {
                processedValue = formatIndianCurrency(value);
            } else {
                return;
            }
        }

        setData((prev) => ({
            ...prev,
            [name]: processedValue,
        }));

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
        const { name, value } = e.target;
        const error = validateField(name, value);
        setErrors((prev) => ({
            ...prev,
            [name]: error,
        }));
    };

    useEffect(() => {
        if (formData && Object.keys(formData).length > 0) {
            setData((prev) => ({
                ...prev,
                ...formData,
            }));
            // Set touched state for all fields that have data
            const newTouched = {};
            Object.keys(formData).forEach((key) => {
                if (formData[key] !== "") {
                    newTouched[key] = true;
                }
            });
            setTouched((prev) => ({
                ...prev,
                ...newTouched,
            }));
        }
    }, [formData]);

    const getInputProps = (name, type = "text") => ({
        type,
        name,
        id: name,
        value: data[name],
        onChange: handleChange,
        onBlur: handleBlur,
        className: `outline-none border rounded-md p-2 px-4 ${
            touched[name] && errors[name] ? "border-red-500" : "border-gray-300"
        }`,
    });

    return (
        <div className="space-y-4">
            <h1 className="text-2xl font-semibold">Employement Information</h1>
            <hr />
            <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                    <label htmlFor="occupation">Occupation</label>
                    <select
                        {...getInputProps("occupation")}
                        className={`py-2 px-4 border rounded-md outline-none text-black ${
                            touched.occupation && errors.occupation
                                ? "border-red-500"
                                : "border-gray-300"
                        }`}
                    >
                        <option value="">Select Occupation</option>
                        {occupationOptions.map((occ) => (
                            <option key={occ} value={occ}>
                                {occ}
                            </option>
                        ))}
                    </select>
                    {touched.occupation && errors.occupation && (
                        <span className="text-red-500 text-sm">
                            {errors.occupation}
                        </span>
                    )}
                </div>

                <div className="flex flex-col gap-2">
                    <label>Years of Experience</label>
                    <div className="flex gap-4">
                        {experienceOptions.map((duration) => (
                            <label
                                key={duration}
                                className={`flex gap-2 border bg-white hover:bg-gray-200 p-1 px-2 items-center rounded-md transition-all ${
                                    data.experienceDuration === duration
                                        ? "border-blue-500"
                                        : ""
                                }`}
                            >
                                <input
                                    type="radio"
                                    name="experienceDuration"
                                    value={duration}
                                    checked={
                                        data.experienceDuration === duration
                                    }
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                />
                                {duration}
                            </label>
                        ))}
                    </div>
                    {touched.experienceDuration &&
                        errors.experienceDuration && (
                            <span className="text-red-500 text-sm">
                                {errors.experienceDuration}
                            </span>
                        )}
                </div>

                <div className="flex flex-col gap-2">
                    <label htmlFor="grossIncome">Gross Monthly Income</label>
                    <input
                        type="text"
                        name="grossIncome"
                        id="grossIncome"
                        value={data.grossIncome}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder="ex: ₹15,000"
                        className={`outline-none border rounded-md p-2 px-4 ${
                            touched.grossIncome && errors.grossIncome
                                ? "border-red-500"
                                : "border-gray-300"
                        }`}
                    />
                    {touched.grossIncome && errors.grossIncome && (
                        <span className="text-red-500 text-sm">
                            {errors.grossIncome}
                        </span>
                    )}
                </div>

                <div className="flex flex-col gap-2">
                    <label htmlFor="rent">Monthly Rent/Mortgage</label>
                    <input
                        type="text"
                        name="rent"
                        id="rent"
                        value={data.rent}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder="ex: ₹0 for no rent/mortgage"
                        className={`outline-none border rounded-md p-2 px-4 ${
                            touched.rent && errors.rent
                                ? "border-red-500"
                                : "border-gray-300"
                        }`}
                    />
                    {touched.rent && errors.rent && (
                        <span className="text-red-500 text-sm">
                            {errors.rent}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
}
