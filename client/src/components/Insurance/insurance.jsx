import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowCircleLeft, ArrowCircleRight } from "@phosphor-icons/react";
import { MdPhonelink } from "react-icons/md";
import { GiReceiveMoney } from "react-icons/gi";
import { FaLaptopCode } from "react-icons/fa";
import { MdOutlineSupportAgent } from "react-icons/md";
import { FaJoget } from "react-icons/fa6";
import health from "@/assets/heart.png";
import car from "@/assets/car.png";
import airplane from "@/assets/airplane.svg";
import umb from "@/assets/umb.svg";
import coin from "@/assets/coin.svg";

export default function Insurance() {
    const insuranceTypes = [
        {
            id: "Health",
            typeImage: health,
            name: "Health Insurance Policy",
            description: "Get the convenience of No cost EMI",
        },
        {
            id: "Car",
            typeImage: car,
            name: "Car Insurance Policy",
            description: "Stay insured with your car",
        },
        {
            id: "Travel",
            typeImage: airplane,
            name: "Travel Insurance Policy",
            description: "Emergency travel expenses covered",
        },
        {
            id: "Life",
            typeImage: umb,
            name: "Life Insurance Policy",
            description: "Secure your family's future",
        },
        {
            id: "Investment Plans",
            typeImage: coin,
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
            text: "affordable customized coverage",
        },
        { icon: <FaLaptopCode />, text: "100% digital process" },
        { icon: <MdOutlineSupportAgent />, text: "dedicated customer support" },
        { icon: <FaJoget />, text: "hassle free claims support" },
    ];

    return (
        <div className="h-full flex flex-col gap-4">
            <div className="grid grid-cols-6 gap-4">
                {insuranceTypes.map((type, index) => (
                    <div
                        key={type.id || index}
                        className="bg-blue-500 bg-opacity-40 border rounded-xl flex gap-2 flex-col items-center text-center overflow-hidden"
                    >
                        <h2 className="text-sm font-medium bg-blue-200 w-full py-1">
                            {type.name}
                        </h2>
                        {/* <p className="text-sm">{type.description}</p> */}

                        <img
                            src={type.typeImage}
                            alt={`${type.name} icon`}
                            className="w-16 h-auto object-contain drop-shadow-md"
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
                            className="border rounded-lg p-4 flex gap-2 items-center bg-blue-300 bg-opacity-40 shadow-inner"
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