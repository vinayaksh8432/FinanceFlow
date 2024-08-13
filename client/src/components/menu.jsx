import { HiMiniHome } from "react-icons/hi2";
import { IoIosStats } from "react-icons/io";
import { LuCreditCard } from "react-icons/lu";
import { BsGraphUpArrow } from "react-icons/bs";
import { FaMoneyBillWave } from "react-icons/fa6";
export default function Menu() {
    return (
        <>
            <div>
                <h1 className="my-4 uppercase text-gray-400 font-[SFPro-Reg]">
                    Menu
                </h1>
                <div className="h-full flex flex-col justify-between">
                    <div className="flex flex-col gap-2">
                        <button className="w-full flex items-center gap-2 rounded-md bg-white p-3 px-4 ">
                            <HiMiniHome size="25px" />
                            Home
                        </button>
                        <button className="w-full flex items-center gap-2 rounded-md bg-white p-2 px-4 ">
                            <IoIosStats size="25px" />
                            Activities
                        </button>
                        <button className="w-full flex items-center gap-2 rounded-md bg-white p-2 px-4 ">
                            <LuCreditCard size="25px" />
                            Transactions
                        </button>
                        <button className="w-full flex items-center gap-2 rounded-md bg-white p-2 px-4 ">
                            <FaMoneyBillWave size="25px" />
                            EMI / Loans
                        </button>
                    </div>
                    
                </div>
            </div>
        </>
    );
}
