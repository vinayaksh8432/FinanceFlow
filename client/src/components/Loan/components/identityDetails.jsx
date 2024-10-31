import { useState, useEffect, useCallback } from "react";

export default function IdentityDetails({ formData, onComplete }) {
    const initialData = {
        identityProof: "",
        proofNumber: "",
        ...formData,
    };

    const [data, setData] = useState(initialData);
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});

    const identityProofs = [
        "Aadhar Card",
        "PAN Card",
        "Voter ID",
        "Passport",
        "Driving License",
    ];

    const validateField = (name, value) => {
        switch (name) {
            case "identityProof":
                return !value ? "Identity proof type is required" : "";
            case "proofNumber":
                if (!value) return "Identity proof number is required";

                // Specific validation rules for each type of ID
                switch (data.identityProof) {
                    case "Aadhar Card":
                        return !/^\d{12}$/.test(value)
                            ? "Aadhar number must be 12 digits"
                            : "";
                    case "PAN Card":
                        return !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(value)
                            ? "Invalid PAN card format (e.g., ABCDE1234F)"
                            : "";
                    case "Passport":
                        return !/^[A-Z]{1}[0-9]{7}$/.test(value)
                            ? "Invalid passport number format (e.g., A1234567)"
                            : "";
                    case "Voter ID":
                        return !/^[A-Z]{3}[0-9]{7}$/.test(value)
                            ? "Invalid voter ID format (e.g., ABC1234567)"
                            : "";
                    case "Driving License":
                        return !/^[A-Z]{2}[0-9]{13}$/.test(value)
                            ? "Invalid driving license format (e.g., DL1234567890123)"
                            : "";
                    default:
                        return "";
                }
            default:
                return "";
        }
    };

    const validateAllFields = useCallback(
        (formData) => {
            const newErrors = {};
            let isValid = true;
            const fieldsToValidate = ["identityProof", "proofNumber"];

            fieldsToValidate.forEach((field) => {
                const error = validateField(field, formData[field]);
                if (error) {
                    isValid = false;
                    newErrors[field] = error;
                }
            });

            return { isValid, errors: newErrors };
        },
        [data.identityProof]
    );

    useEffect(() => {
        const { isValid } = validateAllFields(data);
        if (isValid && JSON.stringify(data) !== JSON.stringify(formData)) {
            onComplete?.(data);
        }
    }, [data, validateAllFields, onComplete, formData]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setData((prev) => {
            const newData = { ...prev, [name]: value };
            // Clear proof number when identity proof type changes
            if (name === "identityProof") {
                newData.proofNumber = "";
            }
            // localStorage.setItem("identityDetails", JSON.stringify(newData));
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
        const { name, value } = e.target;
        const error = validateField(name, value);
        setErrors((prev) => ({
            ...prev,
            [name]: error,
        }));
    };

    useEffect(() => {
        if (formData && Object.keys(formData).length > 0) {
            setData((prev) => {
                const newData = { ...prev, ...formData };
                // localStorage.setItem(
                //     "identityDetails",
                //     JSON.stringify(newData)
                // );
                return newData;
            });
        }
    }, [formData]);

    const getInputProps = (name, type = "text") => ({
        type,
        name,
        id: name,
        value: data[name],
        onChange: handleChange,
        onBlur: handleBlur,
        className: `py-2 px-4 border rounded-md outline-none text-black ${
            touched[name] && errors[name] ? "border-red-500" : "border-gray-300"
        }`,
    });

    const getProofNumberPlaceholder = () => {
        switch (data.identityProof) {
            case "Aadhar Card":
                return "123456789012";
            case "PAN Card":
                return "ABCDE1234F";
            case "Voter ID":
                return "ABC1234567";
            case "Passport":
                return "A1234567";
            case "Driving License":
                return "DL1234567890123";
            default:
                return "Enter proof number";
        }
    };

    return (
        <div className="space-y-4">
            <h1 className="text-2xl font-semibold">Identity Details</h1>
            <hr />
            <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                    <label htmlFor="identityProof">Identity Proof Type</label>
                    <select
                        {...getInputProps("identityProof")}
                        value={data.identityProof}
                    >
                        <option value="">Select Identity Proof</option>
                        {identityProofs.map((proof, index) => (
                            <option key={index} value={proof}>
                                {proof}
                            </option>
                        ))}
                    </select>
                    {touched.identityProof && errors.identityProof && (
                        <span className="text-red-500 text-sm">
                            {errors.identityProof}
                        </span>
                    )}
                </div>

                {data.identityProof && (
                    <div className="flex flex-col gap-2">
                        <label htmlFor="proofNumber">
                            {data.identityProof} Number
                        </label>
                        <input
                            {...getInputProps("proofNumber")}
                            placeholder={getProofNumberPlaceholder()}
                        />
                        {touched.proofNumber && errors.proofNumber && (
                            <span className="text-red-500 text-sm">
                                {errors.proofNumber}
                            </span>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
