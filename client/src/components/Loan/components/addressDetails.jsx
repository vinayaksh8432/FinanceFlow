import { ArrowClockwise } from "@phosphor-icons/react";
import { GetState, GetCity } from "react-country-state-city";
import { useCallback, useEffect, useState } from "react";
import { TailSpin } from "react-loader-spinner";

export default function AddressDetails({ formData, onComplete }) {
    const initialData = {
        addressLine1: "",
        addressLine2: "",
        postalCode: "",
        selectedState: "",
        selectedCity: "",
        addressDuration: "",
        ...formData,
    };

    const [data, setData] = useState(initialData);
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    // India specific state management
    const INDIA_COUNTRY_ID = 101;
    const [stateList, setStateList] = useState([]);
    const [cityList, setCityList] = useState([]);

    const validateField = (name, value) => {
        switch (name) {
            case "addressLine1":
                return !value ? "Address Line 1 is required" : "";
            case "addressLine2":
                return !value ? "Address Line 2 is required" : "";
            case "postalCode":
                return !value
                    ? "Postal Code is required"
                    : !/^\d{6}$/.test(value)
                    ? "Invalid postal code format"
                    : "";
            case "selectedState":
                return !value ? "State selection is required" : "";
            case "selectedCity":
                return !value ? "City selection is required" : "";
            case "addressDuration":
                return !value ? "Address duration is required" : "";
            default:
                return "";
        }
    };

    const validateAllFields = useCallback((formData) => {
        const newErrors = {};
        let isValid = true;
        const fieldsToValidate = [
            "addressLine1",
            "addressLine2",
            "postalCode",
            "selectedState",
            "selectedCity",
            "addressDuration",
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
        e.preventDefault();

        setData((prev) => {
            const newData = { ...prev, [name]: value };
            // localStorage.setItem("addressDetails", JSON.stringify(newData));
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
                // localStorage.setItem("addressDetails", JSON.stringify(newData));
                return newData;
            });
        }
    }, [formData]);

    useEffect(() => {
        // Fetch states for India when component mounts
        GetState(INDIA_COUNTRY_ID).then((result) => {
            setStateList(result);
        });
    }, []);

    const handlePostalCodeChange = async (e) => {
        const input = e.target.value;
        handleChange({
            preventDefault: () => {},
            target: { name: "postalCode", value: input },
        });

        if (input.length === 6) {
            setIsLoading(true);
            try {
                const response = await fetch(
                    `https://api.postalpincode.in/pincode/${input}`
                );
                const data = await response.json();
                const postOffice = data[0].PostOffice[0];

                const stateFromPostal = postOffice.State;
                const cityFromPostal = postOffice.District;

                setData((prev) => ({
                    ...prev,
                    selectedState: stateFromPostal,
                    selectedCity: cityFromPostal,
                }));

                // Fetch cities for the selected state
                const stateObj = stateList.find(
                    (state) => state.name === stateFromPostal
                );
                if (stateObj) {
                    const cities = await GetCity(INDIA_COUNTRY_ID, stateObj.id);
                    setCityList(cities);
                }
            } catch (error) {
                console.error("Error fetching postal code data:", error);
            } finally {
                setIsLoading(false);
            }
        }
    };

    const handleStateChange = async (e) => {
        const stateObj = stateList[e.target.value];
        handleChange({
            preventDefault: () => {},
            target: { name: "selectedState", value: stateObj.name },
        });

        // Reset city when state changes
        setData((prev) => ({ ...prev, selectedCity: "" }));

        // Fetch cities for selected state
        const cities = await GetCity(INDIA_COUNTRY_ID, stateObj.id);
        setCityList(cities);
    };

    const handleCityChange = (e) => {
        const cityObj = cityList[e.target.value];
        handleChange({
            preventDefault: () => {},
            target: { name: "selectedCity", value: cityObj.name },
        });
    };

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
            <h1 className="text-2xl font-semibold">Address Details</h1>
            <hr />
            <div className="grid grid-cols-3 gap-4">
                <div className="flex flex-col gap-2">
                    <label htmlFor="addressLine1">Address Line 1</label>
                    <input {...getInputProps("addressLine1")} />
                    {touched.addressLine1 && errors.addressLine1 && (
                        <span className="text-red-500 text-sm">
                            {errors.addressLine1}
                        </span>
                    )}
                </div>

                <div className="flex flex-col gap-2">
                    <label htmlFor="addressLine2">Address Line 2</label>
                    <input {...getInputProps("addressLine2")} />
                    {touched.addressLine2 && errors.addressLine2 && (
                        <span className="text-red-500 text-sm">
                            {errors.addressLine2}
                        </span>
                    )}
                </div>

                <div className="flex flex-col gap-2">
                    <label htmlFor="postalCode">Postal Code</label>
                    <div className="flex gap-4">
                        <input
                            {...getInputProps("postalCode")}
                            onChange={handlePostalCodeChange}
                            maxLength={6}
                            placeholder="6-digit Postal Code"
                        />
                        <button
                            className="p-2.5 border rounded-md shadow-sm flex gap-1 items-center justify-center bg-white"
                            disabled={isLoading}
                            onClick={() =>
                                handlePostalCodeChange({
                                    target: { value: data.postalCode },
                                })
                            }
                        >
                            {isLoading ? (
                                <TailSpin
                                    height="15"
                                    width="20"
                                    color="#000"
                                    ariaLabel="loading"
                                />
                            ) : (
                                <ArrowClockwise />
                            )}
                        </button>
                    </div>
                    {touched.postalCode && errors.postalCode && (
                        <span className="text-red-500 text-sm">
                            {errors.postalCode}
                        </span>
                    )}
                </div>

                <div className="flex flex-col gap-2">
                    <label htmlFor="selectedState">State</label>
                    <select
                        {...getInputProps("selectedState")}
                        onChange={handleStateChange}
                        value={stateList.findIndex(
                            (state) => state.name === data.selectedState
                        )}
                    >
                        <option value="">Select State</option>
                        {stateList.map((state, index) => (
                            <option key={state.id} value={index}>
                                {state.name}
                            </option>
                        ))}
                    </select>
                    {touched.selectedState && errors.selectedState && (
                        <span className="text-red-500 text-sm">
                            {errors.selectedState}
                        </span>
                    )}
                </div>

                <div className="flex flex-col gap-2">
                    <label htmlFor="selectedCity">City</label>
                    <select
                        {...getInputProps("selectedCity")}
                        onChange={handleCityChange}
                        value={cityList.findIndex(
                            (city) => city.name === data.selectedCity
                        )}
                        disabled={!data.selectedState}
                    >
                        <option value="">Select City</option>
                        {cityList.map((city, index) => (
                            <option key={city.id} value={index}>
                                {city.name}
                            </option>
                        ))}
                    </select>
                    {touched.selectedCity && errors.selectedCity && (
                        <span className="text-red-500 text-sm">
                            {errors.selectedCity}
                        </span>
                    )}
                </div>

                <div className="flex flex-col gap-2">
                    <label>Address Duration (Years)</label>
                    <div className="flex gap-4">
                        {["0-1", "1-2", "3-4", "5+"].map((duration) => (
                            <label
                                key={duration}
                                className={`bg-white rounded-md border p-1 px-2 flex gap-2 items-center hover:bg-gray-100 cursor-pointer ${
                                    data.addressDuration === duration
                                        ? "border-blue-500"
                                        : ""
                                }`}
                            >
                                <input
                                    type="radio"
                                    name="addressDuration"
                                    value={duration}
                                    checked={data.addressDuration === duration}
                                    onChange={handleChange}
                                />
                                {duration}
                            </label>
                        ))}
                    </div>
                    {touched.addressDuration && errors.addressDuration && (
                        <span className="text-red-500 text-sm">
                            {errors.addressDuration}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
}
