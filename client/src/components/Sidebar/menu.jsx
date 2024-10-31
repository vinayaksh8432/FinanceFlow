import { NavLink } from "react-router-dom";
import { HiMiniHome } from "react-icons/hi2";
import { IoIosStats } from "react-icons/io";
import { LuCreditCard } from "react-icons/lu";
import { MdArrowForwardIos } from "react-icons/md";
import { FaMoneyBillWave } from "react-icons/fa6";

export default function Menu() {
    const menuItems = [
        {
            path: "home",
            icon: <HiMiniHome size="25px" />,
            label: "Home",
        },
        {
            path: "activities",
            icon: <IoIosStats size="25px" />,
            label: "Activities",
        },
        {
            path: "loan",
            icon: <FaMoneyBillWave size="25px" />,
            label: "Loans",
        },
    ];

    return (
        <div>
            <h1 className="my-4 uppercase text-gray-400 font-[SFPro-Reg]">
                Menu
            </h1>
            <div className="flex flex-col gap-4">
                {menuItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) => `
                            w-full flex items-center justify-between rounded-md py-2 px-3
                            ${
                                isActive
                                    ? "bg-white text-black"
                                    : "text-gray-400"
                            }
                        `}
                    >
                        {({ isActive }) => (
                            <>
                                <span className="flex items-center gap-4">
                                    {item.icon}
                                    {item.label}
                                </span>
                                {isActive && <MdArrowForwardIos />}
                            </>
                        )}
                    </NavLink>
                ))}
            </div>
        </div>
    );
}
