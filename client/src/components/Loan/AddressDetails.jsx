import React, { useCallback, useContext, useEffect, useState } from "react";
import { ArrowClockwise } from "@phosphor-icons/react";
import { GetState, GetCity } from "react-country-state-city";
import { TailSpin } from "react-loader-spinner";
import { LoanApplicationContext } from "@/context/LoanApplicationContext";

export default function AddressDetails({ onValidate }) {
    const { loanApplication, updateLoanApplication, validateForm, errors } =
        useContext(LoanApplicationContext);

    const initialData = {
        addressLine1: loanApplication.addressLine1 || "",
        addressLine2: loanApplication.addressLine2 || "",
        postalCode: loanApplication.postalCode || "",
        selectedState: loanApplication.selectedState || "",
        selectedCity: loanApplication.selectedCity || "",
        addressDuration: loanApplication.addressDuration || "",
        residentialStatus: loanApplication.residentialStatus || "",
        rent: loanApplication.rent || "",
    };

    const [data, setData] = useState(initialData);
    const [touched, setTouched] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    const INDIA_COUNTRY_ID = 101;
    const [stateList, setStateList] = useState([]);
    const [cityList, setCityList] = useState([]);

    const residentialStatuses = [
        { value: "", label: "Select Residential Status" },
        { value: "Owner", label: "Owner" },
        { value: "Rented", label: "Rented" },
        { value: "Living with Parents", label: "Living with Parents" },
    ];

    useEffect(() => {
        // Fetch states for India when component mounts
        GetState(INDIA_COUNTRY_ID).then((result) => {
            setStateList(result);
        });
    }, []);

    useEffect(() => {
        handleValidation();
    }, [data]);

    const handleValidation = useCallback(() => {
        const isValid = validateForm("addressDetails", data);
        onValidate(isValid);
        return isValid;
    }, [data, validateForm, onValidate]);

    const handleChange = useCallback(
        (e) => {
            const { name, value } = e.target;
            const updatedData = {
                ...data,
                [name]: value,
            };
            setData(updatedData);
            updateLoanApplication(updatedData);
            handleValidation();
        },
        [data, updateLoanApplication, handleValidation]
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

    const handlePostalCodeChange = async (e) => {
        const input = e.target.value;
        handleChange({
            target: { name: "postalCode", value: input },
        });

        if (input.length === 6) {
            setIsLoading(true);
            try {
                const response = await fetch(
                    `https://api.postalpincode.in/pincode/${input}`
                );
                const responseData = await response.json();

                if (
                    responseData[0]?.Status === "Success" &&
                    responseData[0].PostOffice?.length > 0
                ) {
                    const postOffice = responseData[0].PostOffice[0];
                    const stateFromPostal = postOffice.State;
                    const cityFromPostal = postOffice.District;

                    const updatedData = {
                        ...data,
                        selectedState: stateFromPostal,
                        selectedCity: cityFromPostal,
                        postalCode: input,
                    };

                    setData(updatedData);
                    updateLoanApplication(updatedData);

                    // Fetch cities for the selected state
                    const stateObj = stateList.find(
                        (state) => state.name === stateFromPostal
                    );
                    if (stateObj) {
                        const cities = await GetCity(
                            INDIA_COUNTRY_ID,
                            stateObj.id
                        );
                        setCityList(cities);
                    }
                } else {
                    // Handle invalid postal code
                    setData((prev) => ({
                        ...prev,
                        selectedState: "",
                        selectedCity: "",
                    }));
                }
            } catch (error) {
                console.error("Error fetching postal code data:", error);
            } finally {
                setIsLoading(false);
            }
        }
    };

    const handleStateChange = async (e) => {
        const stateIndex = e.target.value;
        const stateObj = stateList[stateIndex];

        const updatedData = {
            ...data,
            selectedState: stateObj.name,
            selectedCity: "", // Reset city when state changes
        };

        setData(updatedData);
        updateLoanApplication(updatedData);

        // Fetch cities for selected state
        const cities = await GetCity(INDIA_COUNTRY_ID, stateObj.id);
        setCityList(cities);
    };

    const handleCityChange = (e) => {
        const cityIndex = e.target.value;
        const cityObj = cityList[cityIndex];

        const updatedData = {
            ...data,
            selectedCity: cityObj.name,
        };

        setData(updatedData);
        updateLoanApplication(updatedData);
    };

    const getInputProps = useCallback(
        (name, type = "text") => ({
            type,
            name,
            id: name,
            value: data[name] || "",
            onChange: handleChange,
            onBlur: handleBlur,
            className: `py-2 px-4 border rounded-md outline-none text-black ${
                touched[name] && errors[name] ? "border-red-500" : ""
            }`,
        }),
        [data, touched, errors, handleChange, handleBlur]
    );

    return (
        <div>
            <h1 className="text-xl font-semibold px-4 py-3">Address Details</h1>
            <hr className="border-t border-dashed border-gray-300 my-3" />
            <div className="px-4 py-3 space-y-3">
                <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-2 relative">
                        <label htmlFor="residentialStatus">
                            Residential Status
                            <span className="pl-1 text-red-500">*</span>
                        </label>
                        <select {...getInputProps("residentialStatus")}>
                            {residentialStatuses.map((status) => (
                                <option key={status.value} value={status.value}>
                                    {status.label}
                                </option>
                            ))}
                        </select>
                        {touched.residentialStatus &&
                            errors.residentialStatus && (
                                <p className="text-red-500 text-xs absolute top-1 right-0">
                                    {errors.residentialStatus}
                                </p>
                            )}
                    </div>

                    {/* Rent/Mortgage */}
                    <div className="flex flex-col gap-2 relative">
                        <label htmlFor="rent">Monthly Rent</label>
                        <input
                            {...getInputProps("rent", "number")}
                            placeholder="Enter rent/mortgage amount"
                            min="0"
                            disabled={data.residentialStatus !== "Rented"}
                        />
                    </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                    {/* Residential Status */}

                    {/* Address Line 1 */}
                    <div className="flex flex-col gap-2 relative">
                        <label htmlFor="addressLine1">
                            Address Line 1
                            <span className="pl-1 text-red-500">*</span>
                        </label>
                        <input {...getInputProps("addressLine1")} />
                        {touched.addressLine1 && errors.addressLine1 && (
                            <p className="text-red-500 text-xs absolute top-1 right-0">
                                {errors.addressLine1}
                            </p>
                        )}
                    </div>

                    {/* Address Line 2 */}
                    <div className="flex flex-col gap-2">
                        <label htmlFor="addressLine2">Address Line 2</label>
                        <input {...getInputProps("addressLine2")} />
                    </div>

                    {/* Postal Code */}
                    <div className="flex flex-col gap-2 relative w-full">
                        <label htmlFor="postalCode">
                            Postal Code
                            <span className="pl-1 text-red-500">*</span>
                        </label>
                        <div className="w-full flex gap-2">
                            <div className="w-full">
                                <input
                                    {...getInputProps("postalCode")}
                                    onChange={handlePostalCodeChange}
                                    maxLength={6}
                                    placeholder="6-digit Postal Code"
                                    className="w-full border border-gray-200 rounded-md py-2 px-4 outline-none"
                                />
                            </div>
                            {touched.postalCode && errors.postalCode && (
                                <p className="text-red-500 text-xs absolute top-1 right-0">
                                    {errors.postalCode}
                                </p>
                            )}
                            <button
                                type="button"
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
                    </div>

                    {/* State */}
                    <div className="flex flex-col gap-2 relative">
                        <label htmlFor="selectedState">
                            State
                            <span className="pl-1 text-red-500">*</span>
                        </label>
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
                            <p className="text-red-500 text-xs absolute top-1 right-0">
                                {errors.selectedState}
                            </p>
                        )}
                    </div>

                    {/* City */}
                    <div className="flex flex-col gap-2 relative">
                        <label htmlFor="selectedCity">
                            City
                            <span className="pl-1 text-red-500">*</span>
                        </label>
                        <select
                            {...getInputProps("selectedCity")}
                            onChange={handleCityChange}
                            disabled={!data.selectedState}
                            value={cityList.findIndex(
                                (city) => city.name === data.selectedCity
                            )}
                        >
                            <option value="">Select City</option>
                            {cityList.map((city, index) => (
                                <option key={city.id} value={index}>
                                    {city.name}
                                </option>
                            ))}
                        </select>
                        {touched.selectedCity && errors.selectedCity && (
                            <p className="text-red-500 text-xs absolute top-1 right-0">
                                {errors.selectedCity}
                            </p>
                        )}
                    </div>

                    {/* Address Duration */}
                    <div className="flex flex-col gap-2 relative">
                        <label htmlFor="addressDuration">
                            Address Duration (Years)
                            <span className="pl-1 text-red-500">*</span>
                        </label>
                        <input
                            {...getInputProps("addressDuration", "number")}
                            min="0"
                            max="50"
                            placeholder="Years at current address"
                        />
                        {touched.addressDuration && errors.addressDuration && (
                            <p className="text-red-500 text-xs absolute top-1 right-0">
                                {errors.addressDuration}
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
