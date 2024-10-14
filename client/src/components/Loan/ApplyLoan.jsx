import React, { useState, useEffect } from "react";
import { fetchLoanTypes } from "../../utils/api";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers";
import { GetState, GetCity } from "react-country-state-city";
import { useNavigate } from "react-router-dom";

export default function ApplyLoan({ onFormSubmit }) {
    const navigate = useNavigate();
    const INDIA_COUNTRY_ID = 101;
    const [selectedLoanType, setSelectedLoanType] = useState("");
    const [selectedLoanTenure, setSelectedLoanTenure] = useState("");
    const [loanTypes, setLoanTypes] = useState([]);
    const [error, setError] = useState(null);
    const [martialStatus, setMartialStatus] = useState("");

    const [stateList, setStateList] = useState([]);
    const [cityList, setCityList] = useState([]);
    const [selectedState, setSelectedState] = useState("");
    const [selectedCity, setSelectedCity] = useState("");

    const loanTenures = [
        "12 Months",
        "24 Months",
        "36 Months",
        "48 Months",
        "60 Months",
    ];

    const [postalCode, setPostalCode] = useState("");

    const martialStatuses = ["Single", "Married", "Divorced", "Widowed"];

    const [occupationStatus, setOccupationStatus] = useState("");
    const occupation = ["Employed", "Self Employed", "Business Owner"];

    useEffect(() => {
        const getLoanTypes = async () => {
            try {
                const data = await fetchLoanTypes();
                setLoanTypes(data);
                setError(null);
            } catch (err) {
                setError(err.message || "Failed to fetch loan types");
                console.error("Error fetching loan types:", err);
            }
        };

        getLoanTypes();
    }, []);

    const handleLoanTypeSelect = (type) => {
        setSelectedLoanType(type);
    };

    const handleLoanTenureSelect = (tenure) => {
        setSelectedLoanTenure(tenure);
    };

    const handleMartialStatusSelect = (status) => {
        setMartialStatus(status);
    };

    const handlePostalCodeChange = async (e) => {
        const input = e.target.value;
        setPostalCode(input);
        try {
            const response = await fetch(
                `https://api.postalpincode.in/pincode/${input}`
            );
            const data = await response.json();
            const postOffice = data[0].PostOffice[0];

            // Update state and then city
            const stateFromPostal = postOffice.State;
            const cityFromPostal = postOffice.District;

            // Find the state in stateList and update
            const stateIndex = stateList.findIndex(
                (state) => state.name === stateFromPostal
            );

            if (stateIndex !== -1) {
                const state = stateList[stateIndex];
                setSelectedState(state.name);

                // Fetch cities for the selected state
                const cities = await GetCity(INDIA_COUNTRY_ID, state.id);
                setCityList(cities);

                // Find and select the city
                const cityIndex = cities.findIndex(
                    (city) => city.name === cityFromPostal
                );
                if (cityIndex !== -1) {
                    setSelectedCity(cities[cityIndex].name);
                }
            }
        } catch (error) {
            setSelectedState("");
            setSelectedCity("");
            setCityList([]);
        }
    };

    useEffect(() => {
        GetState(INDIA_COUNTRY_ID).then((result) => {
            setStateList(result);
        });
    }, []);

    useEffect(() => {
        // Fetch states for India when component mounts
        GetState(INDIA_COUNTRY_ID).then((result) => {
            setStateList(result);
        });
    }, []);

    const handleStateChange = async (e) => {
        const stateIndex = e.target.value;
        const state = stateList[stateIndex];
        setSelectedState(state.name);
        setSelectedCity(""); // Reset city when state changes

        // Fetch cities for selected state
        const cities = await GetCity(INDIA_COUNTRY_ID, state.id);
        setCityList(cities);
    };

    const handleCityChange = (e) => {
        const cityIndex = e.target.value;
        const city = cityList[cityIndex];
        setSelectedCity(city.name);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const formData = {
                desiredLoanAmount: parseInt(e.target.desiredLoanAmount.value),
                annualIncome: parseInt(e.target.annualIncome.value),
                loanType: selectedLoanType, // This is now the loan type name
                loanTenure: selectedLoanTenure,
                firstName: e.target.firstName.value,
                middleName: e.target.middleName.value,
                lastName: e.target.lastName.value,
                email: e.target.email.value,
                phone: parseInt(e.target.phone.value.replace(/\D/g, "")), // Remove non-digits
                dob: e.target.dob?.value || "",
                martialStatus,
                addressLine1: e.target.addressLine1.value,
                addressLine2: e.target.addressLine2.value,
                selectedState,
                selectedCity,
                postalCode: parseInt(postalCode),
                stayedInCurrentAddress: e.target.addressDuration.value,
                occupation: e.target.occupation.value,
                yearsOfExperience: e.target.experience.value,
                grossMonthlyIncome: e.target.grossIncome.value,
                monthlyRent: e.target.rent.value,
                downPayment: e.target.downPayement.value,
                comments: e.target.comment.value,
            };

            const response = await fetch(
                "http://localhost:3000/api/loan-applications/submit",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(formData),
                }
            );

            if (!response.ok) {
                throw new Error("Failed to submit loan application");
            }

            const result = await response.json();
            alert("Loan application submitted successfully!");
            onFormSubmit();
        } catch (error) {
            setError("Failed to submit loan application. Please try again.");
            console.error("Error:", error);
        }
    };

    const [applicationsFound, setApplicationsFound] = useState(false);

    useEffect(() => {
        // Check if there are any applications
        const checkApplications = async () => {
            try {
                const response = await fetch(
                    "http://localhost:3000/api/loan-applications"
                );
                const data = await response.json();
                setApplicationsFound(data.length > 0);
            } catch (error) {
                console.error("Error checking applications:", error);
            }
        };

        checkApplications();
    }, []);

    return (
        <>
            <div>
                <h1 className="p-4 py-3 text-xl bg-slate-200 h-full shadow-inner border border-b-0 rounded-t-xl flex justify-between items-center">
                    Apply Loan in Minutes
                </h1>
                <hr />
                <form
                    action="/loanApplication"
                    onSubmit={handleSubmit}
                    method="post"
                    className="p-4 flex flex-col gap-4"
                >
                    <div className="flex gap-4">
                        <div className="w-1/2 flex flex-col gap-2">
                            <h1 className="text-lg">Desired Loan Amount ₹</h1>
                            <input
                                type="number"
                                name="desiredLoanAmount"
                                placeholder="₹0"
                                className="w-full outline-none border border-gray-300 rounded-md p-2 px-4"
                            />
                        </div>
                        <div className="w-1/2 flex flex-col gap-2">
                            <h1 className="text-lg">Annual Income ₹</h1>
                            <input
                                type="number"
                                name="annualIncome"
                                placeholder="₹0"
                                className="w-full outline-none border border-gray-300 rounded-md p-2 px-4"
                            />
                        </div>
                    </div>
                    <div>
                        <h1 className="mb-3 font-medium">
                            Loan will be used for
                        </h1>
                        <div className="grid grid-cols-5 gap-4">
                            {loanTypes.map((type) => (
                                <button
                                    key={type.id}
                                    type="button"
                                    onClick={() =>
                                        handleLoanTypeSelect(type.name)
                                    } // Change this to use type.name
                                    className={`py-2 px-4 rounded-md border border-gray-300 transition-all duration-200 ${
                                        selectedLoanType === type.name // Change this to compare with type.name
                                            ? "bg-gray-800 text-white"
                                            : "border border-gray-300 hover:bg-gray-100"
                                    }`}
                                >
                                    {type.name}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div>
                        <h1 className="pb-2">Loan Tenure</h1>
                        <div className="grid grid-cols-5 gap-4">
                            {loanTenures.map((tenure, index) => (
                                <button
                                    key={index}
                                    type="button"
                                    onClick={() =>
                                        handleLoanTenureSelect(tenure)
                                    }
                                    className={`py-2 px-4 rounded-md border border-gray-300 transition-all duration-200 ${
                                        selectedLoanTenure === tenure
                                            ? "bg-gray-800 text-white transition-all"
                                            : "border border-gray-300 hover:bg-gray-100 transition-all"
                                    }`}
                                >
                                    {tenure}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-md">
                        <fieldset className="border border-gray-300 rounded">
                            <legend className="ml-3 px-1 text-lg">
                                Contact Information
                            </legend>
                            <div className="p-4 flex flex-col gap-4">
                                <div className="flex gap-4">
                                    <div>
                                        <div className="flex gap-4">
                                            <label>
                                                <p className="">First Name</p>
                                                <input
                                                    type="text"
                                                    name="firstName"
                                                    id="firstName"
                                                    className="py-2 px-4 border border-gray-300 rounded-md outline-none text-black"
                                                />
                                            </label>
                                            <label>
                                                <p className="">Middle Name</p>
                                                <input
                                                    type="text"
                                                    name="middleName"
                                                    id="middleName"
                                                    className="py-2 px-4 border border-gray-300 rounded-md outline-none text-black"
                                                />
                                            </label>
                                            <label>
                                                <p className="">Last Name</p>
                                                <input
                                                    type="text"
                                                    name="lastName"
                                                    id="lastName"
                                                    className="py-2 px-4 border border-gray-300 rounded-md outline-none text-black"
                                                />
                                            </label>
                                        </div>
                                    </div>
                                    <div className="flex w-1/2 gap-4">
                                        <div className="w-full">
                                            <div className="flex justify-between items-center">
                                                <h1>Email</h1>
                                                <p className="font-[SFPro-Reg] text-sm text-neutral-500">
                                                    example@example.com
                                                </p>
                                            </div>
                                            <label className="flex flex-col ">
                                                <input
                                                    type="email"
                                                    name="email"
                                                    id="email"
                                                    className="py-2 px-4 border border-gray-300 rounded-md outline-none w-full text-black"
                                                />
                                            </label>
                                        </div>
                                        <div className="w-full">
                                            <div className="flex justify-between items-center">
                                                <h1>Phone</h1>
                                                <p className="font-[SFPro-Reg] text-sm text-neutral-500">
                                                    + 91 XXXXX-XXXXX
                                                </p>
                                            </div>
                                            <label>
                                                <input
                                                    type="tel"
                                                    name="phone"
                                                    id="phone"
                                                    className="py-2 px-4 border border-gray-300 rounded-md outline-none w-full text-black"
                                                />
                                            </label>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div>
                                        <h1 className="pb-2">Date of Birth</h1>
                                        <LocalizationProvider
                                            dateAdapter={AdapterDayjs}
                                            className="border border-gray-300"
                                        >
                                            <DatePicker
                                                label="DD/MM/YYYY"
                                                format="DD/MM/YYYY"
                                                className="outline-none"
                                            />
                                        </LocalizationProvider>
                                    </div>
                                    <div className="w-full">
                                        <h1 className="pb-2">Martial Status</h1>
                                        <div className="grid grid-cols-4 gap-4">
                                            {martialStatuses.map(
                                                (status, index) => (
                                                    <button
                                                        key={index}
                                                        type="button"
                                                        onClick={() =>
                                                            handleMartialStatusSelect(
                                                                status
                                                            )
                                                        }
                                                        className={`py-3.5 px-4 rounded-md border border-gray-300 transition-all duration-200 ${
                                                            martialStatus ===
                                                            status
                                                                ? "bg-gray-900 text-white"
                                                                : "border border-gray-300 hover:bg-gray-100"
                                                        }`}
                                                    >
                                                        {status}
                                                    </button>
                                                )
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </fieldset>
                    </div>
                    <hr />
                    <div className="p-4 bg-gray-50 rounded-md">
                        <fieldset className="border border-gray-300 rounded">
                            <legend className="ml-3 px-1 text-lg">
                                Address
                            </legend>
                            <div className="p-4 flex flex-col gap-4">
                                <div className="flex gap-4">
                                    <label className="flex flex-col w-full">
                                        <p>Address Line 1</p>
                                        <input
                                            type="text"
                                            name="addressLine1"
                                            id="addressLine1"
                                            className="py-2 px-4 border border-gray-300 rounded-md outline-none text-black"
                                        />
                                    </label>
                                    <label className="flex flex-col w-full">
                                        <p>Address Line 2</p>
                                        <input
                                            type="text"
                                            name="addressLine2" // Changed from addressLine1+2
                                            id="addressLine2"
                                            className="py-2 px-4 border border-gray-300 rounded-md outline-none text-black"
                                        />
                                    </label>
                                </div>
                                <div className="flex justify-between">
                                    <label className="flex flex-col w-1/6 relative">
                                        <p>Postal / Zip Code</p>

                                        <input
                                            type="text"
                                            value={postalCode}
                                            onChange={handlePostalCodeChange}
                                            maxLength={6}
                                            className="py-2 px-4 border border-gray-300 rounded-md outline-none text-black"
                                            placeholder="6-digit Postal Code"
                                        />
                                    </label>
                                    <label className="flex flex-col w-2/5">
                                        <p>State</p>
                                        <select
                                            onChange={handleStateChange}
                                            value={stateList.findIndex(
                                                (state) =>
                                                    state.name === selectedState
                                            )}
                                            className="p-2 border border-gray-300 rounded-md outline-none text-black"
                                        >
                                            <option value="">
                                                Select State
                                            </option>
                                            {stateList.map((state, index) => (
                                                <option
                                                    key={state.id}
                                                    value={index}
                                                >
                                                    {state.name}
                                                </option>
                                            ))}
                                        </select>
                                    </label>
                                    <label className="flex flex-col w-2/5">
                                        <p>City</p>
                                        <select
                                            onChange={handleCityChange}
                                            value={cityList.findIndex(
                                                (city) =>
                                                    city.name === selectedCity
                                            )}
                                            className="p-2 border border-gray-300 rounded-md outline-none text-black"
                                            disabled={
                                                !selectedState ||
                                                cityList.length === 0
                                            }
                                        >
                                            <option value="">
                                                Select City
                                            </option>
                                            {cityList.map((city, index) => (
                                                <option
                                                    key={city.id}
                                                    value={index}
                                                >
                                                    {city.name}
                                                </option>
                                            ))}
                                        </select>
                                    </label>
                                </div>
                                <div className="flex gap-5">
                                    <h1>
                                        How long have you live in your given
                                        address?
                                    </h1>
                                    <ul className="grid grid-cols-4 gap-4">
                                        {[
                                            "0-1 Year",
                                            "1-2 Years",
                                            "3-4 Years",
                                            "5+ Years",
                                        ].map((duration, index) => (
                                            <li key={index}>
                                                <input
                                                    type="radio"
                                                    name="addressDuration"
                                                    value={duration}
                                                    id={`addressDuration${index}`} // Changed from duration${index}
                                                />{" "}
                                                {duration}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </fieldset>
                    </div>
                    <hr />
                    <div className="p-4 bg-gray-50 rounded-md">
                        <fieldset className="border border-gray-300 rounded">
                            <legend className="ml-3 px-1 text-lg">
                                Employement Information
                            </legend>
                            <div className="p-4 flex flex-col gap-4">
                                <h1 className="">Occupation</h1>
                                <div className="flex gap-12 items-center">
                                    <div className="w-1/4">
                                        <select
                                            value={occupationStatus}
                                            onChange={(e) =>
                                                setOccupationStatus(
                                                    e.target.value
                                                )
                                            }
                                            className="py-2 px-4 border border-gray-300 rounded-md outline-none text-black w-full"
                                            name="occupation"
                                            id="occupation"
                                        >
                                            <option value="" className="">
                                                Select Occupation
                                            </option>
                                            {occupation.map((occ) => (
                                                <option key={occ} value={occ}>
                                                    {occ}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="w-full flex gap-12">
                                        <h1 className="text-nowrap">
                                            Years of Experience
                                        </h1>
                                        <ul className="flex justify-between w-full">
                                            {[
                                                "0-1 Year",
                                                "1-2 Years",
                                                "3-4 Years",
                                                "5+ Years",
                                            ].map((duration, index) => (
                                                <li key={index}>
                                                    <input
                                                        type="radio"
                                                        name="experience"
                                                        value={duration}
                                                        id={`experienceDuration${index}`} // Changed from duration${index}
                                                    />{" "}
                                                    {duration}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>

                                <div className="flex gap-12">
                                    <div className="w-1/2 flex flex-col gap-4">
                                        <h1>Gross Monthly Income ₹</h1>
                                        <input
                                            type="number"
                                            name="grossIncome"
                                            placeholder="ex: ₹1500"
                                            className="w-full outline-none border border-gray-300 rounded-md p-2 px-4"
                                        />
                                    </div>
                                    <div className="w-1/2 flex flex-col gap-4">
                                        <h1>Monthly rent/mortgage ₹</h1>
                                        <input
                                            type="number"
                                            name="rent"
                                            placeholder="ex: ₹0 for no rent/mortgage"
                                            className="w-full outline-none border border-gray-300 rounded-md p-2 px-4"
                                        />
                                    </div>
                                    <div className="w-1/2 flex flex-col gap-4">
                                        <h1>Down Payment Amount ₹</h1>
                                        <input
                                            type="number"
                                            name="downPayement"
                                            className="w-full outline-none border border-gray-300 rounded-md p-2 px-4"
                                        />
                                    </div>
                                </div>
                            </div>
                        </fieldset>
                    </div>

                    <hr />
                    <div>
                        <h1 className="pb-2">Comments</h1>
                        <textarea
                            name="comment"
                            id=""
                            rows="4"
                            className="outline-none p-2 px-4 w-full resize-none border border-gray-300 rounded-md"
                        ></textarea>
                    </div>
                    <hr />
                    <div className="text-justify">
                        <h1 className="pb-1">Consent</h1>
                        <div className="flex gap-2 items-baseline py-2">
                            <input type="checkbox" id="consent1" />
                            <label htmlFor="consent1">
                                I authorize prospective Credit
                                Grantors/Lending/Leasing Companies to obtain
                                personal and credit information about me from my
                                employer and credit bureau, or credit reporting
                                agency, any person who has or may have any
                                financial dealing with me, or from any
                                references I have provided. This information, as
                                well as that provided by me in the application,
                                will be referred to in connection with this
                                lease and any other relationships we may
                                establish from time to time. Any personal and
                                credit information obtained may be disclosed
                                from time to time to other lenders, credit
                                bureaus or other credit reporting agencies.
                            </label>
                        </div>
                        <div className="flex gap-2 items-baseline">
                            <input type="checkbox" id="consent2" />
                            <label htmlFor="consent2">
                                I hereby agree that the information given is
                                true, accurate and complete as of the date of
                                this application submission.
                            </label>
                        </div>
                    </div>
                    <div className="mt-4">
                        <button className="bg-black text-white py-2 px-4 rounded-md">
                            Send Application Now
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
}
