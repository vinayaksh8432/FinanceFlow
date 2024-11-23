import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowCircleRight } from "@phosphor-icons/react";
import { MdPhonelink } from "react-icons/md";
import { GiReceiveMoney } from "react-icons/gi";
import { FaLaptopCode } from "react-icons/fa";
import { MdOutlineSupportAgent } from "react-icons/md";
import { FaJoget } from "react-icons/fa6";
import heart from "@/assets/heart.svg";
import car from "@/assets/car.svg";
import twoWheel from "@/assets/twoWheel.svg";
import airplane from "@/assets/airplane.svg";
import umb from "@/assets/umb.svg";
import coin from "@/assets/coin.svg";
import old from "@/assets/old.svg";
import home from "@/assets/home.svg";

export default function Insurance() {
    const insuranceTypes = [
        {
            typeImage: heart,
            name: "Health Insurance Policy",
        },
        {
            typeImage: car,
            name: "Car Insurance Policy",
        },
        {
            typeImage: twoWheel,
            name: "Two-Wheeler Policy",
        },
        {
            typeImage: airplane,
            name: "Travel Insurance Policy",
        },
        {
            typeImage: umb,
            name: "Life Insurance Policy",
        },
        {
            typeImage: coin,
            name: "Investment Plans",
        },
        {
            typeImage: old,
            name: "Retirement Plans",
        },
        {
            typeImage: home,
            name: "Home Insurance",
        },
    ];

    const navigate = useNavigate();

    const handleMyInsuranceClick = () => {
        navigate("/dashboard/insurance/insurancestatus");
    };

    const handleNewInsuranceClick = () => {
        navigate("/dashboard/insurance/applynewinsurance");
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
        <div className="h-full flex gap-10 p-2">
            <div className="w-full h-full flex flex-col gap-10">
                <div className="grid grid-cols-2 gap-6">
                    <button
                        onClick={handleMyInsuranceClick}
                        className="bg-white border-2 border-blue-200 text-left flex items-center justify-between rounded-2xl px-6 py-4 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 hover:border-blue-400"
                    >
                        <div className="flex flex-col gap-2">
                            <h1 className="text-2xl font-bold text-blue-800">
                                My Insurance
                            </h1>
                            <span className="text-sm text-gray-600">
                                View and manage your existing policies
                            </span>
                        </div>
                        <ArrowCircleRight size={32} className="text-blue-500" />
                    </button>

                    <button
                        onClick={handleNewInsuranceClick}
                        className="bg-gradient-to-r from-blue-500 to-blue-700 text-left flex items-center justify-between rounded-2xl px-6 py-4 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
                    >
                        <div className="flex flex-col gap-2">
                            <h1 className="text-2xl font-bold text-white">
                                Apply for New Insurance
                            </h1>
                            <span className="text-sm text-blue-100">
                                Start a new insurance application
                            </span>
                        </div>
                        <ArrowCircleRight size={40} className="text-white" />
                    </button>
                </div>

                <div className="grid grid-cols-4 gap-6">
                    {insuranceTypes.map((type, index) => (
                        <div
                            key={type.id || index}
                            className="bg-white border border-blue-100 rounded-xl flex flex-col items-center text-center shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
                        >
                            <h2 className="text-sm font-semibold bg-gradient-to-r from-blue-500 to-blue-600 text-white w-full py-3 rounded-t-xl">
                                {type.name}
                            </h2>
                            <div className="py-6 px-4">
                                <img
                                    src={type.typeImage}
                                    alt={`${type.name} icon`}
                                    className="w-auto h-20 object-contain drop-shadow-lg hover:scale-110 transition-transform duration-300"
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <div className="w-1/3 pl-8 flex flex-col gap-8 border-l-2 border-blue-100">
                <h1 className="text-3xl font-bold text-blue-800 text-center">
                    Why Choose Us?
                </h1>
                {reasons.map((reason, index) => (
                    <div
                        key={index}
                        className="bg-white border-2 border-blue-100 rounded-xl flex gap-4 items-center shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                    >
                        <div className="text-4xl bg-gradient-to-r from-blue-500 to-blue-600 p-5 text-white rounded-l-xl">
                            {reason.icon}
                        </div>
                        <p className="uppercase text-sm font-semibold text-gray-700 pr-4">
                            {reason.text}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}
