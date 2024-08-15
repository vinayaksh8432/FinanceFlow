import { useState } from "react";
import { HiMiniHome } from "react-icons/hi2";
import { IoIosStats } from "react-icons/io";
import { LuCreditCard } from "react-icons/lu";
import { MdArrowForwardIos } from "react-icons/md";
import { FaMoneyBillWave } from "react-icons/fa6";

export default function Menu() {
    const [activeButton, setActiveButton] = useState("home");

    const handleButtonClick = (button) => {
        setActiveButton(button);
    };

    return (
        <>
            <div>
                <h1 className="my-4 uppercase text-gray-400 font-[SFPro-Reg]">
                    Menu
                </h1>
                <div className="h-full flex flex-col justify-between gap-4">
                    <button
                        className={`w-full flex items-center justify-between rounded-md p-3 px-4 ${
                            activeButton === "home" ? "bg-white text-black" : "text-gray-400"
                        }`}
                        onClick={() => handleButtonClick("home")}
                    >
                        <span className="flex items-center gap-4">
                            <HiMiniHome size="25px" />
                            Home
                        </span>
                        {activeButton === "home" && <MdArrowForwardIos />}
                    </button>
                    <button
                        className={`w-full flex items-center justify-between rounded-md p-3 px-4 ${
                            activeButton === "activities" ? "bg-white text-black" : "text-gray-400"
                        }`}
                        onClick={() => handleButtonClick("activities")}
                    >
                        <span className="flex items-center gap-4">
                            <IoIosStats size="25px" />
                            Activities
                        </span>
                        {activeButton === "activities" && <MdArrowForwardIos />}
                    </button>
                    <button
                        className={`w-full flex items-center justify-between rounded-md p-3 px-4 ${
                            activeButton === "transactions" ? "bg-white text-black" : "text-gray-400"
                        }`}
                        onClick={() => handleButtonClick("transactions")}
                    >
                        <span className="flex items-center gap-4">
                            <LuCreditCard size="25px" />
                            Transactions
                        </span>
                        {activeButton === "transactions" && <MdArrowForwardIos />}
                    </button>
                    <button
                        className={`w-full flex items-center justify-between rounded-md p-3 px-4 ${
                            activeButton === "emi" ? "bg-white text-black" : "text-gray-400"
                        }`}
                        onClick={() => handleButtonClick("emi")}
                    >
                        <span className="flex items-center gap-4">
                            <FaMoneyBillWave size="25px" />
                            EMI / Loans
                        </span>
                        {activeButton === "emi" && <MdArrowForwardIos />}
                    </button>
                </div>
            </div>
        </>
    );
}
