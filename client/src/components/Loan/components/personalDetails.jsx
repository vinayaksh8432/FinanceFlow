import { useState, useEffect, useCallback } from "react";

export default function PersonalDetails({ formData, onComplete }) {
    const initialData = {
        firstName: "",
        middleName: "",
        lastName: "",
        email: "",
        phone: "",
        dateOfBirth: "",
        gender: "",
        martialStatus: "",
        residentialStatus: "",
        ...formData, // Spread the formData to override defaults if provided
    };

    const [data, setData] = useState(initialData);
    const [errors, setErrors] = useState({});
    const [date, setDate] = useState(null);
    const [touched, setTouched] = useState({});

    const validateField = (name, value) => {
        switch (name) {
            case "firstName":
                return !value ? "First name is required" : "";
            case "lastName":
                return !value ? "Last name is required" : "";
            case "email":
                return !value
                    ? "Email is required"
                    : !/\S+@\S+\.\S+/.test(value)
                    ? "Invalid email format"
                    : "";
            case "phone":
                return !value
                    ? "Phone number is required"
                    : !/^\+?[\d\s-]{10,}$/.test(value)
                    ? "Invalid phone number"
                    : "";
            case "dateOfBirth":
                return !value ? "Date of birth is required" : "";
            case "gender":
                return !value ? "Gender is required" : "";
            case "martialStatus":
                return !value ? "Martial status is required" : "";
            case "residentialStatus":
                return !value ? "Residential status is required" : "";
            default:
                return "";
        }
    };

    const validateAllFields = useCallback((formData) => {
        const newErrors = {};
        let isValid = true;
        const fieldsToValidate = [
            "firstName",
            "lastName",
            "email",
            "phone",
            "dateOfBirth",
            "gender",
            "martialStatus",
            "residentialStatus",
        ];

        fieldsToValidate.forEach((field) => {
            const error = validateField(field, formData[field]);
            if (error) {
                isValid = false;
                newErrors[field] = error;
            }
        });

        return { isValid, errors: newErrors };
    }, []);

    useEffect(() => {
        const { isValid } = validateAllFields(data);
        if (isValid && JSON.stringify(data) !== JSON.stringify(formData)) {
            onComplete(data);
        }
    }, [data, validateAllFields, onComplete, formData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (e.preventDefault) e.preventDefault();

        setData((prev) => {
            const newData = { ...prev, [name]: value };
            // localStorage.setItem("personalDetails", JSON.stringify(newData));
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
                //     "personalDetails",
                //     JSON.stringify(newData)
                // );
                return newData;
            });
        }
    }, [formData]);

    const genders = ["Male", "Female", "Other", "Prefer not to say"];
    const martialStatuses = ["Single", "Married", "Divorced", "Widowed"];
    const residentialStatuses = ["Owner", "Rented", "Living with Parents"];

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

    return (
        <div className="space-y-4">
            <div>
                <h1 className="text-2xl font-semibold">Personal Details</h1>
                {/* <p className="text-sm">Let us get to know you better.</p> */}
            </div>
            <hr />
            <div className="grid grid-cols-3 gap-4">
                <div className="flex flex-col gap-2">
                    <label htmlFor="firstName">First Name</label>
                    <input {...getInputProps("firstName")} />
                    {touched.firstName && errors.firstName && (
                        <span className="text-red-500 text-sm">
                            {errors.firstName}
                        </span>
                    )}
                </div>

                <div className="flex flex-col gap-2">
                    <label htmlFor="middleName">Middle Name</label>
                    <input {...getInputProps("middleName")} />
                </div>

                <div className="flex flex-col gap-2">
                    <label htmlFor="lastName">Last Name</label>
                    <input {...getInputProps("lastName")} />
                    {touched.lastName && errors.lastName && (
                        <span className="text-red-500 text-sm">
                            {errors.lastName}
                        </span>
                    )}
                </div>

                <div className="flex flex-col gap-2">
                    <label htmlFor="email">Email</label>
                    <input
                        {...getInputProps("email", "email")}
                        placeholder="example@example.com"
                    />
                    {touched.email && errors.email && (
                        <span className="text-red-500 text-sm">
                            {errors.email}
                        </span>
                    )}
                </div>

                <div className="flex flex-col gap-2">
                    <label htmlFor="phone">Phone</label>
                    <input
                        {...getInputProps("phone", "tel")}
                        placeholder="+ 91 XXXXX-XXXXX"
                    />
                    {touched.phone && errors.phone && (
                        <span className="text-red-500 text-sm">
                            {errors.phone}
                        </span>
                    )}
                </div>

                <div className="flex flex-col gap-2">
                    <label htmlFor="dateOfBirth">Date of Birth</label>
                    <input {...getInputProps("dateOfBirth", "date")} />

                    {touched.dateOfBirth && errors.dateOfBirth && (
                        <span className="text-red-500 text-sm">
                            {errors.dateOfBirth}
                        </span>
                    )}
                </div>

                <div className="flex flex-col gap-2">
                    <label htmlFor="gender">Gender</label>
                    <select {...getInputProps("gender")}>
                        <option value="">Select Gender</option>
                        {genders.map((gender, index) => (
                            <option key={index} value={gender}>
                                {gender}
                            </option>
                        ))}
                    </select>
                    {touched.gender && errors.gender && (
                        <span className="text-red-500 text-sm">
                            {errors.gender}
                        </span>
                    )}
                </div>

                <div className="flex flex-col gap-2">
                    <label htmlFor="martialStatus">Marital Status</label>
                    <select {...getInputProps("martialStatus")}>
                        <option value="">Select Marital Status</option>
                        {martialStatuses.map((status, index) => (
                            <option key={index} value={status}>
                                {status}
                            </option>
                        ))}
                    </select>
                    {touched.martialStatus && errors.martialStatus && (
                        <span className="text-red-500 text-sm">
                            {errors.martialStatus}
                        </span>
                    )}
                </div>

                <div className="flex flex-col gap-2">
                    <label htmlFor="residentialStatus">
                        Residential Status
                    </label>
                    <select {...getInputProps("residentialStatus")}>
                        <option value="">Select Residential Status</option>
                        {residentialStatuses.map((status, index) => (
                            <option key={index} value={status}>
                                {status}
                            </option>
                        ))}
                    </select>
                    {touched.residentialStatus && errors.residentialStatus && (
                        <span className="text-red-500 text-sm">
                            {errors.residentialStatus}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
}
