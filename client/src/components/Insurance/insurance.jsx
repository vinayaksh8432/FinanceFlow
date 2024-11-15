import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowCircleLeft, ArrowCircleRight } from "@phosphor-icons/react";
import { MdPhonelink } from "react-icons/md";
import { GiReceiveMoney } from "react-icons/gi";
import { FaLaptopCode } from "react-icons/fa";
import { MdOutlineSupportAgent } from "react-icons/md";
import { FaJoget } from "react-icons/fa6";

export default function Insurance() {
    const insuranceTypes = [
        {
            id: "Health",
            typeImage: "assets/healthInsurance.svg",
            name: "Health Insurance Policy",
            description: "Get the convenience of No cost EMI",
        },
        {
            id: "Car",
            typeImage: "assets/car.svg",
            name: "Car Insurance Policy",
            description: "Stay insured with your car",
        },
        {
            id: "Travel",
            typeImage: "assets/travel.svg",
            name: "Travel Insurance Policy",
            description: "Emergency travel expenses covered",
        },
        {
            id: "Life",
            typeImage: "assets/life.svg",
            name: "Life Insurance Policy",
            description: "Secure your family's future",
        },
        {
            id: "Investment Plans",
            typeImage: "assets/investment.svg",
            name: "Investment Plans",
            description: "Invest in the best plans",
        },
    ];

    const [currentIndex, setCurrentIndex] = useState(0);
    const navigate = useNavigate();

    const handleMyInsuranceClick = () => {
        navigate("/dashboard/insurance/insurancestatus");
    };

    const handleNewInsuranceClick = () => {
        navigate("/dashboard/insurance/applynewinsurance");
    };

    const handleNext = () => {
        if (currentIndex < insuranceTypes.length - 3) {
            setCurrentIndex(currentIndex + 1);
        }
    };

    const handlePrev = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
        }
    };

    const reasons = [
        { icon: <MdPhonelink />, text: "one stop insurance platform" },
        {
            icon: <GiReceiveMoney />,
            text: "affordable customized coverage plans",
        },
        { icon: <FaLaptopCode />, text: "100% digital process" },
        { icon: <MdOutlineSupportAgent />, text: "dedicated customer support" },
        { icon: <FaJoget />, text: "hassle free claims support" },
    ];

    return (
        <div className="h-full flex flex-col gap-4">
            <div className="grid grid-cols-3 gap-4 overflow-x-auto">
                {insuranceTypes.map((type, index) => (
                    <div
                        key={type.id || index}
                        className="flex-shrink-0 p-6 bg-blue-300 bg-opacity-40 rounded-lg shadow-inner flex items-center justify-between"
                    >
                        <div className="">
                            <h2 className="text-base font-medium mb-2">
                                {type.name}
                            </h2>
                            <p className="text-sm">{type.description}</p>
                        </div>
                        <img
                            src={type.typeImage}
                            alt={`${type.name} icon`}
                            className="w-24 h-auto object-contain drop-shadow-md"
                        />
                    </div>
                ))}
            </div>
            <div className="py-2 flex flex-col gap-4">
                <h1>Why choose us?</h1>
                <div className="grid grid-cols-5 gap-4">
                    {reasons.map((reason, index) => (
                        <div
                            key={index}
                            className="border rounded-lg p-4 flex flex-col gap-2 bg-blue-300 bg-opacity-40 shadow-inner"
                        >
                            <div className="text-4xl">{reason.icon}</div>
                            <p className="uppercase text-sm">{reason.text}</p>
                        </div>
                    ))}
                </div>
            </div>
            <div className="flex flex-col gap-4">
                <button
                    onClick={handleMyInsuranceClick}
                    className="bg-blue-300 bg-opacity-40 text-left text-base flex items-center justify-between rounded-lg py-3 px-6 hover:bg-opacity-75 transition-colors shadow-sm"
                >
                    <p className="flex flex-col">
                        My Insurance
                        <span className="text-sm text-neutral-600">
                            View and manage your existing policies
                        </span>
                    </p>
                    <ArrowCircleRight size={24} />
                </button>

                <button
                    onClick={handleNewInsuranceClick}
                    type="button"
                    className="bg-blue-300 bg-opacity-40 text-left text-base flex items-center justify-between rounded-lg py-3 px-6 hover:bg-opacity-75 transition-colors shadow-sm"
                >
                    <p className="flex flex-col">
                        Apply for New Insurance
                        <span className="text-sm text-neutral-600">
                            Start a new insurance application
                        </span>
                    </p>
                    <ArrowCircleRight size={24} />
                </button>
            </div>
        </div>
    );
}
